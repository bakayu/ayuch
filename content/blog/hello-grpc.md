+++
title = "gRPC for the REST of Us"
date = 2026-03-11
description = "Not a deep spec dive - just a look at when gRPC beats REST."

[taxonomies]
tags = ["gRPC", "REST", "rust", "tonic", "backend"]

[extra]
giscus = true
social_media_card = "/images/reze-plush.jpg"
+++

![banner](/images/reze-plush.jpg)

> *Would you rather be a city mouse or a country mouse?* -- Aesop's Fables

## Preface

I've built plenty of standard REST APIs. It's the default choice for communication between two pieces of software, and for good reasons. But recently, while designing the architecture for my current project, [Raven](https://github.com/bakayu/raven), I realized REST wasn't going to cut it.

Raven is a self-hosted server monitoring and centralized logging tool - you drop a tiny agent (call it a daemon) on your linux machine and it quitely collects CPU, memory, disk, and network stats, tails your log files, and streams everything back to a central server. No SaaS fees, no bloat, just your data on your hardware.

The moment I started thinking seriously about the agent-to-server communication, REST started showing its cracks. Agents don't ask questions - they produce a continuous stream of `MetricBatch` and `LogBatch` data, flushing every 100 items or 5 seconds, whichever comes first. That's not a request-response pattern. Polling felt wasteful and added unnecessary latency. Webhooks felt backwards - the agent shouldn't be a server. WebSockets were closer, but they're a browser primitive - bolting one onto a Rust daemon just to push metrics felt like the wrong tool for the job. What I actually needed was a persistent, efficient outbound stream with a strict typed contract, and REST over HTTP/1.1 wasn't built for that.

That's when I dug into gRPC. If REST is the city mouse - loud, everywhere, and everyone's first choice, gRPC is the country mouse - quieter, stricter, and in the right environment, far more powerful. Let's dig into why.

## Why gRPC Over REST?

REST is genuinely great. It's simple, human-readable, and works everywhere. But "works everywhere" is also its weakness - it makes very few demands, and that looseness has a cost.

### HTTP/2 and Binary All the Way Down

REST typically runs over HTTP/1.1, which means one request per connection, text-based headers sent repeatedly, and no built-in multiplexing. gRPC runs on HTTP/2 by default. That means multiple streams over a single connection, header compression, and binary framing - all without you doing anything extra.

On top of that, gRPC uses Protocol Buffers for serialization instead of JSON. Protobufs are binary, strongly typed, and significantly smaller on the wire. For something like Raven, where agents are flushing batches of metrics and log lines every few seconds across potentially many machines, that difference compounds fast.

### The Contract Problem

With REST, the API contract lives in documentation, or a OpenAPI spec if you're disciplined, or nowhere at all if you're honest (I just write some code docs in the code itself if I'm feeling generous). The client and server have to agree informally - and they drift over time when changes are introduced, it takes extra time and effort in development time to keep everything tied together.

gRPC flips this. The `.proto` file *is* the contract. Both sides generate their types from it at compile time. If the server changes a field, the client won't compile until it catches up. There's no runtime surprise where a JSON key is missing or spelled differently - the compiler tells you first (and personally I would prefer the compiler screaming at me than seeing some Internal Server Error ruin my day).

### Streaming as a First-Class Citizen

This was the one that pushed me toward gRPC for Raven. REST has no native streaming story. You can fake it with chunked responses or long-polling, but it's always a workaround. gRPC has four communication patterns baked in:

- **Unary**: one request, one response - the REST equivalent
- **Server streaming**: one request, stream of responses
- **Client streaming**: stream of requests, one response
- **Bidirectional streaming**: both sides stream simultaneously

For Raven's agents, client streaming is the natural fit. The agent would open a single persistent connection and pushes `MetricBatch` and `LogBatch` messages continuously. The server receives them and routes them accordingly - no polling, no reconnecting on every flush, no overhead of re-establishing context each time.

## The Country Mouse Has Rules: A Rust + Tonic Tutorial

I have written a small tutorial with rust and tonic (a gRPC implementation in Rust) to accomply this blog post, but before we write any code, we need to talk about the `.proto` file. This is what makes gRPC different from the start - you don't write code and hope both sides agree, you write a contract first and both the server and client generate their types from the `.proto` file at compile time. No guessing, no drifting, no runtime surprises.

{{ admonition(type="info", icon="note", title="Note", text="Find the full code here -> [grpc-mouse](https://github.com/bakayu/rust-projects/tree/master/tonic/grpc-mouse)") }}

### The Contract
```protobuf
// mouse.proto
syntax = "proto3";
package mouse;

// A single service that collects mouse preference reports
// and returns a summary once the stream is complete
service MousePreference {
    // Client streaming - the client sends multiple reports,
    // the server responds once at the end
    rpc ReportPreference (stream PreferenceReport) returns (PreferenceSummary);
}

// A single preference report sent by the client
message PreferenceReport {
    string name          = 1;
    bool   is_city_mouse = 2;
}

// The server's response after the stream closes
message PreferenceSummary {
    bool   received = 1;
    string message  = 2;
}
```

We're using **client streaming** here - the client sends multiple `PreferenceReport` messages continuously over a single connection, and the server responds once with a `PreferenceSummary` when the stream closes.

### Project Setup
```bash
cargo new grpc-mouse
cd grpc-mouse
```

Your `Cargo.toml`:
```toml
[package]
name = "grpc-mouse"
version = "0.1.0"
edition = "2024"

[[bin]]
name = "server"
path = "src/server.rs"

[[bin]]
name = "client"
path = "src/client.rs"

[dependencies]
tonic = "*"
prost = "0.14"
tonic-prost = "*"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1"

[build-dependencies]
tonic-prost-build = "*"
```

Then create a `build.rs` at the project root - this tells Tonic to compile your `.proto` file into Rust types at build time:

```rust
// build script - runs before compilation, generates Rust types from the `.proto` file
fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_prost_build::compile_protos("proto/mouse.proto")?;
    Ok(())
}
```

And place your `mouse.proto` under `proto/mouse.proto`. Your project structure should look like this:
```
grpc-mouse/
├── build.rs
├── Cargo.toml
├── proto/
│   └── mouse.proto
└── src/
    ├── server.rs
    └── client.rs
```

### The Server
```rust
// tonic::transport::Server - the gRPC server builder
// MousePreferenceServer - generated wrapper that registers our service with the server
use mouse::mouse_preference_server::{MousePreference, MousePreferenceServer};
use mouse::{PreferenceReport, PreferenceSummary};
use tonic::{Request, Response, Status, Streaming, transport::Server};

// Pulls in the Rust types that tonic-build generated from mouse.proto at build time
pub mod mouse {
    tonic::include_proto!("mouse");
}

#[derive(Default)]
pub struct MousePreferenceService;

#[tonic::async_trait] // required - tonic needs async trait support via this macro
impl MousePreference for MousePreferenceService {
    async fn report_preference(
        &self,
        // Streaming<T> - tonic's type for an incoming client stream of messages
        request: Request<Streaming<PreferenceReport>>,
    ) -> Result<Response<PreferenceSummary>, Status> {
        let mut stream = request.into_inner();
        let mut city_count = 0;
        let mut country_count = 0;

        // .message().await? - pulls the next message off the gRPC stream,
        // returns None when the client closes the stream
        while let Some(report) = stream.message().await? {
            match report.is_city_mouse {
                true => {
                    city_count += 1;
                    println!("{} is a city mouse.", report.name);
                }
                false => {
                    country_count += 1;
                    println!("{} is a country mouse.", report.name);
                }
            }
        }

        // Respond once with the final tally
        Ok(Response::new(PreferenceSummary {
            received: true,
            message: format!("Results: {} city, {} country.", city_count, country_count),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let service = MousePreferenceService::default();

    println!("Server listening on {}", addr);

    // .add_service() - registers our generated service wrapper with the gRPC server
    Server::builder()
        .add_service(MousePreferenceServer::new(service))
        .serve(addr)
        .await?;

    Ok(())
}
```

Notice there's no JSON parsing, no status code wrangling, no guessing what fields the client sent. `PreferenceReport` is a generated Rust struct - if a field is missing or mistyped, it won't compile.

### The Client
```rust
// MousePreferenceClient - generated client stub, handles serialization and the gRPC connection
use mouse::PreferenceReport;
use mouse::mouse_preference_client::MousePreferenceClient;

// Pulls in the Rust types that tonic-build generated from mouse.proto at build time
pub mod mouse {
    tonic::include_proto!("mouse");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Establishes the underlying HTTP/2 connection to the server
    let mut client = MousePreferenceClient::connect("http://[::1]:50051").await?;

    let reports = vec![
        PreferenceReport {
            name: "Reze".into(),
            is_city_mouse: false,
        },
        PreferenceReport {
            name: "Denji".into(),
            is_city_mouse: true,
        },
        PreferenceReport {
            name: "Aki".into(),
            is_city_mouse: false,
        },
    ];

    // tokio_stream::iter - wraps a Vec into an async stream,
    // which is what Tonic expects for client streaming RPCs
    let stream = tokio_stream::iter(reports);

    // Sends the entire stream in a single gRPC connection, awaits the server's response
    let response = client.report_preference(stream).await?;

    println!("Server said: {}", response.into_inner().message);

    Ok(())
}
```

### Running It
```sh
# Terminal 1
cargo run --bin server

# Terminal 2
cargo run --bin client
```

You should see the server printing each preference as it arrives, then the client printing the final summary. One connection, one stream, no repeated handshakes.

We implemented both the server and client in Rust, but with this `.proto` file we could implement either side in any language - Go, Python, TypeScript - and they would still behave exactly the same. The contract is the source of truth, not the language.

## When to Pick Which

Neither is universally better, they solve different problems.

**Stick with REST when:**
- You're building a public-facing API - REST is universally understood, curl-friendly, and easy to explore without any tooling
- Your client is a browser - browsers don't speak raw gRPC without a proxy layer like grpc-web
- You want simplicity - one endpoint, one JSON response, done

**Reach for gRPC when:**
- You need streaming - metrics, logs, events, anything that flows continuously
- You're building internal services - strict contracts mean less debugging across service boundaries
- Performance matters - binary serialization and HTTP/2 multiplexing add up fast at scale
- You have a polyglot system - generate clients in any language from a single `.proto` file

For Raven, the choice was straightforward. The agent is an internal, long-running Rust daemon that stream data continuously, exactly what gRPC is built for. The dashboard talks to the server over REST and WebSockets, because that's what browsers are built for. The right tool for each job.

...

*So, would you prefer to be a city mouse or a country mouse?*

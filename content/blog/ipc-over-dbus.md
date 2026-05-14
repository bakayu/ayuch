+++
title = "The Bus You Never Knew You Were On"
date = 2026-05-14
description = "A quick overview on how D-Bus is used for IPC."

[taxonomies]
tags = ["IPC", "D-Bus", "rust", "zbus", "tutorial"]

[extra]
giscus = true
social_media_card = "/images/cat.jpg"
+++

![banner](/images/cat.jpg)

> *Icarus laughed as he fell, for he knew that to fall meant he had once **soared**.* -- Fiona

## Preface

Recently I started studying about D-Bus, mainly because my work involved working with linux desktop dialogs, which mainly used GLib and Gio runtime. Before I had been working with high level wrappers and years old APIs written in C, but I needed something fast and secure that worked natively on rust and supported tokio right out of the box - that's where I discovered zbus and finally looked into D-Bus in depth, because that's as low as we can get.

## What is D-Bus?

Before we talk about D-Bus, let's briefly talk about Inter-Process Communication - **IPC** for short. If you've spent time in web development, you might think of IPC as one service talking to another over HTTP, a frontend calling an API, two microservices exchanging JSON. That's IPC, sure. But IPC at the operating system level is a different beast entirely.

Think about what's quietly happening on your Linux desktop right now. When an application fires a notification, it isn't drawing a little popup itself - it's asking your notification daemon to do it. When a sandboxed app needs to open a file picker, it can't just spawn a GTK dialog and call it a day - it has to ask the desktop environment to open one on its behalf. When your music player pauses when you plug in headphones, that's because the audio system broadcast a hardware event and the player was listening. When NetworkManager changes your connection state, every app that cares gets told about it simultaneously. None of these processes share memory. None of them have each other's function pointers. They're completely isolated, sandboxed (snaps and flatpaks) - and yet they're coordinating seamlessly.

That coordination needs infrastructure. You could do it with Unix sockets, but then you'd have to implement addressing, service discovery, and message framing yourself for every pair of processes that wants to talk. You could use shared memory, but that's a concurrency nightmare. You could invent your own protocol, but then you're maintaining it forever.

**D-Bus** is the infrastructure Linux settled on. It is an IPC system built specifically for this problem - letting processes on the same machine communicate through a central **message broker** called the **bus daemon**. Under the hood, it runs over Unix domain sockets, with the daemon acting as a router: every process connects to it, registers under an address, and all messages flow through that central point rather than between processes directly. This indirection is what makes service discovery possible - you don't need a hardcoded socket path per service, you just ask the bus for `org.freedesktop.Notifications` and the daemon knows where to route it. It also means the bus can enforce policy, queue messages, and handle the case where a service activates lazily on first contact.

## Tutorial

Let's look at a brief tutorial on D-Bus, and then we will be implementing a **proxy** and a **service** with `zbus`.

### The Two Buses

There are two buses you'll interact with:

1. **System bus:** one per machine, shared across all users. System-level services live here: `NetworkManager`, `systemd`, `UPower`, `BlueZ`. Typically requires elevated permissions to publish to.
2. **Session bus:** one per logged-in user session. This is where your desktop apps live, and where you'll be working most of the time. Example - Sending notifications happens via the session bus.

### The Vocabulary

Before any code, four terms you need to have locked in:

1. **Service name:** a well-known string identifying who you're talking to. Two forms exist: the human-readable well-known name like `org.freedesktop.Notifications`, and the connection-assigned unique name like `:1.42`. Think of the well-known name as a domain and the unique name as an IP address.

2. **Object path:** identifies a specific object exposed by a service, written like a filesystem path: `/org/freedesktop/Notifications`. A service can expose many objects at different paths.

3. **Interface:** a named group of methods, signals, and properties on an object. If you're thinking in Rust terms: it's a trait. `org.freedesktop.Notifications` is the interface name; the object at `/org/freedesktop/Notifications` implements it.

4. **Methods, Signals, and Properties:** the three things you can actually do over D-Bus:

    i. **Method** - call a function on a remote object and get a reply. Like an RPC.
    
    ii. **Signal** - a broadcast emitted by a service that anyone can subscribe to. Fire-and-forget, no reply.
    
    iii. **Property** - a named value on an object that can be read, written, or watched for changes.

A useful mental model: if D-Bus were HTTP, object paths would be URL routes, interfaces would be controllers, methods would be endpoints, and signals would be server-sent events.

### What's Actually on the Bus?

Let's get our hands dirty. Install d-spy (GNOME's graphical D-Bus explorer) or use busctl from the command line:

```sh
# List all services on your session bus
busctl --user list

# Introspect a specific service
busctl --user introspect \
    org.freedesktop.Notifications \
    /org/freedesktop/Notifications
```

Go poke around. The `org.freedesktop.Notifications` service is a good first stop - it's on every desktop, it's simple, and we'll be talking to it shortly.

---

## Enter zbus

Historically, writing D-Bus code in Rust meant wrestling with `dbus-rs`, which wraps the C `libdbus` library. It works, but it's verbose, it requires the native library as a system dependency, and the async story is bolted on rather than native.

zbus takes a different approach entirely. It is:

- **Pure Rust** - no `libdbus`, no C FFI, no system dependency beyond the socket itself
- **Async-first** - supports `tokio` or `async-std`, your choice
- **Macro-driven** - The `#[proxy]` and `#[interface]` traits do most of the heavy lifting (Litterally my favorite feature of zbus)

The two things you'll do with zbus are: **write a proxy** (to talk to an existing service) and **write a service** (to expose your own). Let's do both.

Add zbus to your `Cargo.toml`:

```toml
[dependencies]
zbus = "5"
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
futures-util = "0.3"
```

### Writing a Proxy

A proxy is your local handle to a remote D-Bus object. Instead of manually marshalling arguments and sending raw messages, you define a trait that mirrors the remote interface - and zbus generates the plumbing.

Here's a proxy for `org.freedesktop.Notifications`, the standard desktop notification service: [find the code here](https://github.com/bakayu/rust-projects/blob/master/zbus-examples/zbus-low-level-examples/examples/notification.rs)

```rust
use std::collections::HashMap;
use std::error::Error;

use zbus::{Connection, proxy, zvariant::Value};

#[proxy(
    default_service = "org.freedesktop.Notifications",
    default_path = "/org/freedesktop/Notifications"
)]
trait Notifications {
    /// Call the org.freedesktop.Notifications.Notify D-Bus method
    fn notify(
        &self,
        app_name: &str,
        replaces_id: u32,
        app_icon: &str,
        summary: &str,
        body: &str,
        actions: &[&str],
        hints: HashMap<&str, &Value<'_>>,
        expire_timeout: i32,
    ) -> zbus::Result<u32>;
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let connection = Connection::session().await?;
 
    let proxy = NotificationsProxy::new(&connection).await?;
    let reply = proxy
        .notify(
            "Notification from zbus",
            0,
            "dialog-information",
            "Hello from zbus",
            "Hello from zbus",
            &[],
            HashMap::new(),
            5000,
        )
        .await?;
    dbg!(reply);
 
    Ok(())
}
```

Walk through what's happening here:

`#[proxy(...)]` is applied to a *trait* - not a struct, not an impl block, a trait. zbus reads the `default_service` and `default_path` attributes, looks at every method you declare in the trait body, and generates a concrete `NotificationsProxy` struct that implements all of it. You write the contract; zbus writes the boilerplate.

`Connection::session().await?` connects to the session bus. If you need the system bus instead, that's `Connection::system().await?`.

`NotificationsProxy::new(&connection).await?` instantiates the generated proxy, ready to make calls.

Then it's just a regular async method call. No message construction, no type-casting on the way back - `reply` is already a `u32`. Run this and you should see a notification pop up on your desktop. That's it.

### Writing a Service

Proxies let you *talk to* things. Services let you *be* the thing others talk to. You expose an object on the bus under a well-known name, and other processes can call your methods, read your properties, and subscribe to your signals.

Here is an example: [find the code here](https://github.com/bakayu/rust-projects/blob/master/zbus-examples/greeting-service/src/main.rs)

```rust
use std::{error::Error, future::pending};
use zbus::{connection, interface};
 
struct Greeter {
    count: u64,
}

#[interface(name = "org.zbus.MyGreeter1")]
impl Greeter {
    async fn say_hello(&mut self, name: &str) -> String {
        self.count += 1;
        println!("greeting {}.", name);
        format!("Hello {}! I have been called {} times.", name, self.count)
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let greeter = Greeter { count: 0 };
    let _conn = connection::Builder::session()?
        .name("org.zbus.MyGreeter")?
        .serve_at("/org/zbus/MyGreeter", greeter)?
        .build()
        .await?;
 
    pending::<()>().await;
 
    Ok(())
}
```

A few things worth noting:

`#[interface(name = "org.zbus.MyGreeter1")]` is applied to an `impl` block. Any `pub` async method in that block becomes a callable D-Bus method. The method signature is the interface - argument types and return types are serialized automatically by zbus.

`&mut self` is fine here. zbus handles the interior mutability so you can hold state across calls without any `Arc<Mutex<>>` ceremony at this level.

`connection::Builder::session()?` - the builder pattern handles connecting, claiming the well-known name with `.name()`, and registering your object at a path with `.serve_at()`. One chain, and you're on the bus.

`pending::<()>().await` at the end keeps the async runtime alive indefinitely. Without it, `main` would return, the connection would drop, and your service would vanish from the bus before anyone could call it. In a real application this is where your event loop or shutdown signal would live.

Once this is running, verify it's visible:

```bash
busctl --user list | grep zbus
busctl --user call org.zbus.MyGreeter /org/zbus/MyGreeter org.zbus.MyGreeter1 SayHello s "world"
```

If you see `"Hello world! I have been called 1 times."` come back - congratulations, you have a service on the bus.

## Gotchas and Tips

**Session bus vs system bus.** It seems obvious until it isn't. If your service or proxy targets the session bus but you're running in an environment without a session (a headless CI runner, an SSH session without `--login`, a systemd user service that hasn't inherited `DBUS_SESSION_BUS_ADDRESS`) - it will silently fail or error in confusing ways. Always check which bus you actually need, and in CI, look into `dbus-run-session` to spin up a throwaway session bus for tests.

**Well-known names are not optional.** If you call `.name("org.zbus.MyGreeter")` and something else already owns that name, the build will fail. During development, make sure you don't have a stale instance of your service running. In production, think about name replacement policies if you need hot-restart behavior.

**`pending::<()>().await` is intentional, not a bug.** New Rust async developers sometimes see this and reach for a `loop {}` or a sleep instead. Don't. `pending` is the idiomatic way to park an async task indefinitely without burning CPU. When you're ready to handle graceful shutdown, replace it with a `tokio::signal::ctrl_c()` future or a proper shutdown channel.

**Introspect everything with `d-spy`.** Before writing a proxy for any system service, open `d-spy`, find the service on the session or system bus, browse its interfaces and method signatures. It will save you time deciphering XML introspection output manually.

**`zbus-xmlgen` for existing services.** If a service exposes introspection XML (most do), you can generate a proxy automatically: `zbus-xmlgen` reads the XML and outputs a Rust trait with the `#[proxy]` macro already filled in. Great for wrapping large interfaces like `org.freedesktop.portal.*`.

**The `zvariant::Value` type is D-Bus's `Any`.** It appears in method signatures (like the `hints` parameter in the notification example) when the interface spec uses D-Bus variant types. It's ergonomic enough once you're used to it, but if you see type errors involving `Value`, that's where to look.

{{ admonition(type="tip", icon="tip", title="Tip", text="**Go deeper:** This post covers the fundamentals, but zbus has a lot more to offer - signals, properties, async streams of property changes, `ObjectServer` for multi-object services, and more. The [official zbus book](https://z-galaxy.github.io/zbus/introduction.html) is excellent and covers all of it. Highly recommended reading once you have the basics working.") }}
 
## Closing
 
D-Bus has a reputation for being arcane and intimidating (speaking from my personal experience) - something that exists under the desktop, touched only by GNOME developers and people who read freedesktop.org specs for fun. zbus makes that reputation feel undeserved.

You define a trait, add a macro, connect to the session bus - and you're talking to the notification daemon, the portal interfaces, the power manager. The whole desktop is right there, listening.

...

*Icarus laughed as he fell, for he knew that to fall meant he had once soared. You won't fall here. Connect to the bus and start calling things.*

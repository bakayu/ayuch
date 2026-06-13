+++
title = "iced is cool"
date = 2026-06-11
description = "A look over iced and building a basic system monitor app."

[taxonomies]
tags = ["GUI", "Desktop Programming", "rust", "iced", "tutorial"]

[extra]
giscus = true
mermaid = true
social_media_card = "/images/mgtr.jpg"
+++

![banner](/images/mgtr.jpg)

> *Being a racing driver means you are racing with other people. And if you no longer go for a gap that exists, you are no longer a racing driver.* -- Ayrton Senna

## Preface

If you've spent any time looking at the Rust GUI landscape, you've probably heard of `iced`. It has quickly become one of the most popular libraries for building native user interfaces in Rust, loved for its type-safety and declarative approach. In fact, it has matured enough to power entire desktop environments: System76 is building their next-generation COSMIC desktop environment completely on top of it.

Lately, I've been working on adding a native print dialog to the COSMIC desktop. Working on a project of this scale means getting comfortable with how `iced` manages state, updates, and asynchronous background tasks.

To consolidate my own learning and give back to the community, I wanted to write about how `iced` handles asynchronous background work. In this post, we'll build a very basic system monitor app that tracks CPU usage in real-time. We'll start with how `iced` works at a high level and then build the application iteratively, diving deep into **Subscriptions** - the idiomatic way to handle streaming data in `iced`.

---

## How does iced work?

If you come from the web world, you're probably familiar with React, Vue, or Elm. If not, don't worry. `iced` is built entirely on the principles of **The Elm Architecture (TEA)**.

Instead of managing mutable UI nodes directly (like in GTK or Qt, where you hold references to widgets and call `.set_text()` on them), `iced` is completely declarative. It revolves around a simple, unidirectional loop made of four core concepts:

1. **State:** The data of your application. For example, `cpu_usage: f64`.
2. **View:** A function that describes how your state should be rendered. It takes your state and returns a tree of UI widgets.
3. **Message:** User interactions or background events that happen in your application (e.g., a button click, or a new CPU stat sample arriving).
4. **Update:** A function that takes your current `State` and a `Message`, updates the state accordingly, and tells `iced` if we need to run any commands.

Whenever the state changes in the `update` function, `iced` automatically calls `view` again, computes the difference, and redraws the UI.

{% mermaid() %}
graph TD
    State[State] -->|view| View[View]
    View -->|User Action / Event| Message[Message]
    Message -->|update| Update[Update]
    Update -->|Mutates State| State
    Update -.->|Task / Subscription| Async[Async Task / Stream]
    Async -.->|Yields| Message
{% end %}

This makes UI state management deterministic, testable, and incredibly satisfying.

{{ admonition(type="info", icon="note", title="Note", text="**A cool note:** Since version 0.14, `iced` now supports reactive rendering by default: re-rendering only the elements whose state has been mutated. Instead of redrawing the entire window on every update, it performs selective updates to only redraw what has changed, drastically reducing CPU usage.") }}

---

## The Target App & The CPU Sampler

To demonstrate this, we'll build a simple system monitor that queries CPU stats from `/proc/stat` and shows them using progress bars.

{{ admonition(type="warning", icon="warning", title="Linux Only", text="Since this application reads metrics directly from `/proc/stat`, it will only work on Linux. If you are on Windows or macOS, you will need to adapt the metric-gathering code or run the app in WSL.") }}

But hold on for a second, reading and parsing `/proc/stat` requires some OS-level work. Since this tutorial focuses on `iced` and subscriptions, I won't go deep into the parsing details here. I've written a module `cpu.rs` using the `procfs` crate that handles calculating the delta of CPU time ticks. (Find the code here: [link](https://github.com/bakayu/proc-iced/blob/master/src/cpu.rs))

{{ admonition(type="info", icon="note", title="Note", text="If you want to learn more about how procfs works, I highly recommend checking out the [procfs crate documentation](https://docs.rs/procfs/latest/procfs/). For this tutorial, you can simply copy-paste the [cpu.rs](https://github.com/bakayu/proc-iced/blob/master/src/cpu.rs) module into your project and use the exposed endpoints.") }}

Here is a quick overview of what the `cpu.rs` module exposes:

* `CpuStats`: A struct containing the total CPU usage percentage and a list of per-core percentages:

```rust
  pub struct CpuStats {
      pub total: f64, // 0.0..=100.0%
      pub per_core: Vec<f64>,
  }
```

* `CpuSampler`: A stateful sampler. Its `sample()` async method returns the delta calculated as `CpuStats` compared to the last time it was sampled. Since it needs two data points to compute a delta, the first call to `sample()` returns `None`.

With `cpu.rs` in place, let's build the app!

---

## Tutorial: Step-by-Step System Monitor

Let's initialize our project and build our app iteratively. (Full code here: [GitHub](https://github.com/bakayu/proc-iced/blob/master/src/cpu.rs))

### Step 1: The Static Shell (State & View)

First, we need to define our application's State and describe how to render it. Initially, we won't have any real CPU stats, so we'll start with `cpu_stats` as `None` (which defaults to 0% usage).

Initialize a rust project with `cargo init system-monitor`, add the following dependencies to your `Cargo.toml` file:

```toml
[dependencies]
anyhow = "1.0.102"
iced = { version = "0.14.0", features = ["tokio"] }
"procfs" = "0.18"
tokio = { version = "1.52.3", features = ["full"] }
```

`src/main.rs`:

```rust
mod cpu;

use cpu::CpuStats;
use iced::{
    Element,
    Length::Fill,
    Theme,
    widget::{column, progress_bar, text},
};

struct SystemMonitor {
    cpu_stats: Option<CpuStats>,
}

impl SystemMonitor {
    fn new() -> Self {
        Self { cpu_stats: None }
    }

    fn view(&self) -> Element<'_, Message> {
        // Fallback to empty stats if none have been sampled yet
        let cpu_stats = self.cpu_stats.clone().unwrap_or_default();

        column![
            text("Total CPU Usage"),
            progress_bar(0.0..=100.0, cpu_stats.total as f32)
        ]
        .spacing(10)
        .padding(10)
        .into()
    }
}
```

Wait, what is `Message` here? And how do we actually run this? Let's add them in.

### Step 2: The Update Loop and running the App

To make the code compile and run, we need to define our `Message` enum, implement the `update` logic (which is empty for now), and wire it into the `iced::application` entry point.

```rust
#[derive(Debug, Clone)]
enum Message {
    // We'll receive the sampled stats (or an error string) here
    CpuStatSampled(Result<Option<CpuStats>, String>),
}

fn main() -> iced::Result {
    iced::application(
        SystemMonitor::new,
        SystemMonitor::update,
        SystemMonitor::view,
    )
    .title("System Monitor")
    .run()
}

impl SystemMonitor {
    // ... new and view from Step 1 ...

    fn update(&mut self, message: Message) {
        match message {
            Message::CpuStatSampled(Ok(stats)) => {
                self.cpu_stats = stats;
            }
            Message::CpuStatSampled(Err(e)) => {
                eprintln!("Sampling Error: {e}");
            }
        }
    }
}
```

If you run `cargo run` now, you'll see a window with a static 0% progress bar. It's clean, but it's dead. How do we make it tick every second in the background?

---

### Step 3: Enter Subscriptions (Making it Tick)

This is the core topic. A **Subscription** in `iced` is a way to listen to external, asynchronous event streams. Unlike a `Command` (which is a one-off async task, like fetching a single HTTP request), a `Subscription` stays alive and can yield messages continuously.

We want to poll the CPU stats every second. We can express this as a `stream::unfold` that encapsulates our `CpuSampler` and yields a `Message` on every iteration after sleeping.

Let's implement our subscription logic:

```rust
use std::time::Duration;
use iced::{Subscription, futures::stream};
use cpu::CpuSampler;

fn cpu_subscription() -> Subscription<Message> {
    Subscription::run(cpu_stream)
}

fn cpu_stream() -> impl stream::Stream<Item = Message> {
    stream::unfold(CpuSampler::new(), |mut sampler| async move {
        // Sleep for 1 second before sampling
        tokio::time::sleep(Duration::from_secs(1)).await;

        let result = sampler.sample().await.map_err(|e| e.to_string());

        Some((Message::CpuStatSampled(result), sampler))
    })
}
```

Let's analyze what's going on here:

1. `Subscription::run(...)` takes a function that returns an asynchronous stream of items. Every time the stream produces a value, it is wrapped as a `Message` and sent into the `update` loop.
2. `stream::unfold` is a beautiful functional utility from the `futures` crate. It takes an initial state (our `CpuSampler`) and a closure. The closure performs the async work (`sleep` and `sample`) and returns `Some((item, next_state))` to continue yielding, or `None` to terminate.
3. Because `stream::unfold` threads the `sampler` back to the next iteration, we preserve the internal state of `CpuSampler` (which holds the previous tick durations necessary to compute the delta).

Now, we wire this subscription into our application using the `.subscription()` builder method in `main`:

```rust
fn main() -> iced::Result {
    iced::application(
        SystemMonitor::new,
        SystemMonitor::update,
        SystemMonitor::view,
    )
    .subscription(SystemMonitor::subscription) // Wire the subscription
    .title("System Monitor")
    .run()
}

impl SystemMonitor {
    // ...
    fn subscription(&self) -> Subscription<Message> {
        cpu_subscription()
    }
    // ...
}
```

Now when you launch the application, you'll see the total CPU usage bar updating in real-time every second!

---

### Step 4: Rendering Per-Core Usage (Layout & Styling)

Now let's expand the `view` function to display per-core metrics in a clean grid and color-code the progress bars dynamically depending on the load.

We'll style the progress bars using `iced::Theme`:

* `< 50.0%`: Primary color (usually blue)
* `50.0% - 80.0%`: Warning color (yellow/orange)
* `> 80.0%`: Danger color (red)

```rust
use iced::widget::progress_bar::{danger, primary, warning};
use iced::widget::{Column, row};

impl SystemMonitor {
    // ...

    fn view(&self) -> Element<'_, Message> {
        let cpu_stats = self.cpu_stats.clone().unwrap_or_default();

        // Total CPU Usage Layout
        let total_cpu_usage = column![
            text("Total CPU Usage"),
            progress_bar(0.0..=100.0, cpu_stats.total as f32)
                .style(move |theme| core_bar_style(theme, cpu_stats.total))
        ];

        // Gather per-core metrics
        let per_core_values: Vec<(usize, f64)> = cpu_stats
            .per_core
            .iter()
            .enumerate()
            .map(|(i, &u)| (i, u))
            .collect();

        // Render cores in rows of 4
        let per_core_rows: Vec<Element<Message>> = per_core_values
            .chunks(4)
            .map(|chunk| {
                let bars: Vec<Element<Message>> = chunk
                    .iter()
                    .map(|(i, usage)| {
                        let usage_val = *usage;
                        column![
                            text!("Core {i}"),
                            progress_bar(0.0..=100.0, usage_val as f32)
                                .style(move |theme| core_bar_style(theme, usage_val))
                        ]
                        .width(Fill)
                        .into()
                    })
                    .collect();
                row(bars).spacing(10).into()
            })
            .collect();

        let per_core_grid = Column::with_children(per_core_rows).spacing(10);

        column![total_cpu_usage, per_core_grid]
            .spacing(10)
            .padding(10)
            .into()
    }
}

// Helper function to color the progress bar based on utilization
fn core_bar_style(theme: &Theme, usage: f64) -> progress_bar::Style {
    if usage < 50.0 {
        primary(theme)
    } else if usage < 80.0 {
        warning(theme)
    } else {
        danger(theme)
    }
}
```

We now have a fully functioning, beautiful system monitor running entirely natively in Rust.

---

## Gotchas and Tips

{{ admonition(type="warning", icon="warning", title="Blocking the Runtime", text="In Rust async programming, you must never block the executor. If you check `cpu.rs`, we read from `/proc/stat` which is a blocking file-system operation. If we read it directly in our async stream, it could starve the tokio runtime and cause UI lag. We resolved this by wrapping the call in `tokio::task::spawn_blocking`. Always do this for file system or CPU-intensive tasks.") }}

{{ admonition(type="tip", icon="tip", title="State Persistence in Streams", text="`stream::unfold` is excellent for tracking state (like our `CpuSampler`) across yields. If you need a more advanced subscription (e.g. listening to a D-Bus signal or TCP socket where connections can drop), you can wrap your stream in a loop that reconnects and handles errors gracefully without crashing the subscription.") }}

## Closing

Developing desktop apps in Rust using `iced` feels like a breath of fresh air. The Elm Architecture brings structure to the traditionally chaotic world of GUI programming, and `Subscription` makes handling real-time, asynchronous events incredibly elegant.

### libcosmic and the COSMIC Desktop

This architecture isn't just for small utilities: it is the foundation of a complete desktop environment. System76's COSMIC DE is built entirely on `libcosmic`, which is a custom widget toolkit built on top of `iced`.

`libcosmic` extends `iced` by providing the styling systems, animations, and specialized widgets (like panels, sidebars, and dialog structures) needed for a cohesive desktop. But under the hood, the core remains pure `iced`. The way you manage state, handle updates, and spawn background tasks with subscriptions is exactly the same whether you're writing this basic system monitor or implementing a major system component like the print dialog.

As I continue working on the COSMIC print dialog, I'm constantly surprised by how far the Rust desktop ecosystem has come. If you're looking to build native desktop applications, give `iced` a shot.

If you want to expand this app, I have code for parsing other system metrics (like network, memory, and disk) in one of my other projects - [Raven](https://github.com/rvnhq/raven/tree/master/crates/raven-agent/src) under the `proc_reader` module (btw, the `cpu.rs` module was pulled from there! :P). Feel free to peek at those implementations, pull them into this system monitor, and experiment with building a more full-featured dashboard.

The complete code for this tutorial's CPU monitor is available on my  [GitHub](https://github.com/bakayu/proc-iced). Give it a spin, and let me know what you think!

...

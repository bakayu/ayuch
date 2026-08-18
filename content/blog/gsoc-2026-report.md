+++
title = "GSoC 2026 Submission Report"
date = 2026-08-18
description = "My GSoC 2026 final submission report for project: COSMIC Desktop Print Dialog."

[taxonomies]
tags = ["GSoC", "printing", "rust", "COSMIC", "OpenPrinting"]

[extra]
quick_navigation_buttons = true
giscus = true
mermaid = true
social_media_card = "/images/gsoc-banner.png"
+++

![banner](/images/gsoc-banner.png)

> _"A ship in harbor is safe, but that is not what ships are built for."_ -- Jhon A. Shedd

## Project: [COSMIC Desktop Print Dialog](https://summerofcode.withgoogle.com/programs/2026/projects/vTB6j0HO)

#### _Organization: The Linux Foundation_

<br/>

Hello! This is my final report for my GSoC 2026 project: COSMIC Desktop Print Dialog. The goal of this project was to build a CPDB-based print dialog for the COSMIC Desktop Environment and integrate it with `xdg-desktop-portal-cosmic` (PreparePrint + Print) so desktop and sandboxed apps can print through a native COSMIC UX.

TLDR: My GSoC project focused on bringing native print dialog support to the COSMIC desktop environment through two interconnected efforts: modernizing the Rust CPDB client library and building a fully functional print portal for xdg-desktop-portal-cosmic. The CPDB library work is **done and merged upstream** into [`OpenPrinting/cpdb-rs`](https://github.com/OpenPrinting/cpdb-rs) and published on crates.io as [`v0.1.1`](https://crates.io/crates/cpdb-rs/0.1.1), and the print dialog is **feature-complete and in review** on [`pop-os/xdg-desktop-portal-cosmic#331`](https://github.com/pop-os/xdg-desktop-portal-cosmic/pull/331). The project is complete according to the proposal, all that remains is feedback from the review cycle and the follow-up work that a newer portal API will unlock.

---

Here is a detailed overview of my GSoC project:

#### Table of Content

- [Background: why this project exists](#background-why-this-project-exists)
- [Goals of the project](#goals-of-the-project)
- [Part one: updating `cpdb-rs`](#part-one-updating-cpdb-rs)
- [Part two: The COSMIC Print dialog and portal](#part-two-the-cosmic-print-dialog-and-portal)
- [Current state](#current-state)
- [What's left to do](#what-s-left-to-do)
- [Challenges faced during the program](#challenges-faced-during-the-program)
- [What I learned](#what-i-learned)
- [Thanks](#thanks)
- [Links](#links)

## Background: why this project exists

To explain the goal I need to introduce three things that had to be glued together.

**COSMIC** is System76's new desktop environment, written in Rust on top of [`libcosmic`](https://github.com/pop-os/libcosmic), which itself builds on the [`iced`](https://iced.rs) GUI toolkit. It is a new DE, and until this project it had no print dialog of its own. If you press <kbd>Ctrl</kbd>+<kbd>P</kbd> in an application on COSMIC, you get whatever dialog the application's own toolkit provides, usually the GTK one, which looks and behaves like a different desktop.

**XDG Desktop Portals** are the standard way for applications, especially sandboxed ones, to ask the desktop to do something on their behalf like opening a file, taking a screenshot, or like in our case printing a document. The application never gets direct access to your printers, It talks D-Bus to a portal, and the desktop's portal implementation shows the UI and does the work. `xdg-desktop-portal-cosmic` is COSMIC's implementation, and it had backends for screenshots, screencasting, and file choosing, but the `org.freedesktop.impl.portal.Print` interface was missing entirely.

**CPDB (Common Print Dialog Backends)** is an OpenPrinting project that solves a long-standing duplication problem. Historically every toolkit (GTK, Qt, LibreOffice) implemented its own print dialog and its own CUPS integration. CPDB inverts that: print systems (like CUPS) each expose a **backend** process over D-Bus, and any dialog can be a **frontend** that discovers all the installed backends and talks to them through one common interface. Write your dialog once and it works with every print system that ships a CPDB backend.

So the shape of the project was clear: make COSMIC a good CPDB frontend, and expose that frontend through the print portal.

{% mermaid() %}
graph TD
App["Application<br/>(Flatpak / native)"]
Portal["xdg-desktop-portal"]
Cosmic["xdg-desktop-portal-cosmic<br/><i>the dialog lives here</i>"]
Backend["cpdb-backend-cups,<br/>cpdb-backend-cups, …"]
CUPS["CUPS"]

    App -->|"D-Bus:<br/>org.freedesktop.portal.Print"| Portal
    Portal --> Cosmic
    Cosmic -->|"cpdb-rs<br/>D-Bus: org.openprinting.PrintBackend"| Backend
    Backend --> CUPS

{% end %}

## Goals of the project

As per the proposal:

1. **Modernize `cpdb-rs`** so that Rust GUI applications, specifically async, event-driven ones like `iced`/`libcosmic`, can use CPDB comfortably without depending on GNOME LIB and GIO runtime. I planned to use `zbus` here.
2. **Implement `org.freedesktop.impl.portal.Print`** in `xdg-desktop-portal-cosmic`, covering both the `PreparePrint` and `Print` methods of the portal contract.
3. **Build a production-quality print dialog** with live printer discovery, the full set of print settings, sensible defaults, settings persistence and localization.
4. **Handle the unhappy paths**: no printers, a printer that disappears mid-dialog, a backend that goes away, a job that fails to submit.

## Part one: updating `cpdb-rs`

### The problem with the old bindings

`cpdb-rs` already existed as a set of safe-ish Rust wrappers around `cpdb-libs`, the C frontend library. The approach would have worked, but it had some costs for a consumer like COSMIC:

- **It drags in GLib.** `cpdb-libs` uses GLib's main loop for its D-Bus plumbing and its callbacks. An `iced` application already has its own event loop and its own async runtime. Running a GLib main loop next to it, just to get printer events, means we use an extra CPU thread and an extra dependency.
- **Callbacks with async Rust.** The C API delivers "printer added" and "printer removed" through function pointers invoked from GLib's thread. Getting that into an `iced` `Subscription` means bouncing through channels and `unsafe` at every step.
- **It needs C headers and a build environment.** Anyone building COSMIC's portal would have needed `cpdb-libs` development headers installed, with introduces another layer of friction in development, testing and distribution.

After discussing this with **Michael (@mmstick)** he suggested to use zbus which solves all these problems and was already being used in COSMIC, and so I did.

### What I built

I wrote a completely new, pure-Rust, async CPDB client on top of `zbus`, with **no C dependency at all**. The crate now has two features:

- `zbus-backend` _(default)_: the new native async client.
- `ffi` _(optional)_: the original C bindings, moved into a separate workspace member, `cpdb-sys`, and preserved.

Now anyone can use `cpdb-rs` with just pure async rust, and with tokio as well:

```rust
use cpdb_rs::CpdbClient;

let client = CpdbClient::new().await?;
let printers = client.get_all_printers().await?;

for p in &printers {
    println!("{} [{}] - {}", p.name, p.id, p.make_model);
}

let (options, media) = client
    .get_printer_details(&printer.id, &printer.backend)
    .await?;
```

`CpdbClient::new()` scans D-Bus for services matching the CPDB backend naming convention, connects to each, and holds a proxy per backend. A system may run more than one backend, so every method that identifies a printer takes both a printer ID and a backend name, because IDs are only unique within a backend.

The API covers:

| Capability                                  | Method                                                |
| ------------------------------------------- | ----------------------------------------------------- |
| Discover printers across all backends       | `get_all_printers()`                                  |
| Discover, minus remote/temporary printers   | `get_filtered_printers()`                             |
| Live add/remove/state-change events         | `discovery_stream()`                                  |
| Options, media sizes and margins            | `get_printer_details()`                               |
| Localised option and value names            | `get_translations()`                                  |
| The system default printer                  | `get_default_printer()`                               |
| Submit a job, receive a writable FD         | `print_fd()`                                          |
| Submit a job over a socket                  | `print_socket()`                                      |
| Keep backends alive during a dialog session | `keep_alive_all()`                                    |
| Toggle remote/temporary printer visibility  | `show_remote_printers()`, `show_temporary_printers()` |

### The event stream

This is the most interesting part. Every backend emits `PrinterAdded`, `PrinterRemoved` and `PrinterStateChanged` D-Bus signals whenever a new printer is added, goes offline, or is enabled/disabled to receive print jobs. The client subscribes to all of them across all backends, maps each signal into a typed enum, and merges them into a single stream with `futures_util::stream::SelectAll`:

```rust
pub enum DiscoveryEvent {
    PrinterAdded(PrinterSnapshot),
    PrinterRemoved { id: String, backend: String },
    PrinterStateChanged { id: String, backend: String, state: PrinterState },
}
```

Keeping this shape allows us an easy integration with the GUI. On the COSMIC side, subscribing to the event stream looks something like this:

```rust
Subscription::run_with(PrinterDiscovery, |_| {
    cosmic::iced::stream::channel(100, |mut output| async move {
        let client = CpdbClient::new().await?;
        let mut stream = client.discovery_stream().await?;
        while let Some(event) = stream.next().await {
            let _ = output.send(Msg::DiscoveryEvent(event)).await;
        }
    })
})
```

A printer that comes online while the dialog is open appears in the list. One that goes offline grays out and, if it was selected, the dialog falls back gracefully. No polling, no main loop, no `unsafe`.

### Other things that went into the crate

- **Typed states instead of string as data.** Printer state arrives as a string over D-Bus; the crate parses it into a `PrinterState` enum with an `is_ready()` helper.
- **A structured config type**, `PrinterConfig`, for global and per-printer settings.
- **Translations.** CPDB backends can return localized names for options and their values.
- **Documentation and examples.** Documentation for the whole crate and runnable examples (`discover_printers`, `filter_printers`, `get_translations`, `print_a_document`).

The work landed as [PR #6 on `OpenPrinting/cpdb-rs`](https://github.com/OpenPrinting/cpdb-rs/pull/6) and is published on crates.io as **`cpdb-rs` 0.1.1** and **`cpdb-sys` 0.1.1**.

---

## Part two: the COSMIC print dialog and portal

With the library ready to be used, the second half of the summer went into `xdg-desktop-portal-cosmic` itself: roughly **4,200~** lines of code (at the time of writing this).

### The portal contract

The print portal has two methods, and the split between them is not obvious at first:

- **`PreparePrint`**: the application says requests to print a document and passes some preferred settings. The portal shows the dialog, the user picks a printer and settings, and the portal returns the chosen settings plus a token. **No document is transferred in this step.**
- **`Print`**: the application passes an FD holding the document. If it includes a token from a previous `PreparePrint` call, the portal must print **without showing any UI**, reusing the settings associated with the token (tokens are one time use). Without a token, the portal shows the dialog and then prints.

### Settings translation

There is a problem that I faced when mapping CPDB option values and XDG option values, **the XDG print portal and CPDB do not agree on names.** The portal speaks its own language and CPDB speaks IPP's, some names are consistent but not all. One such example: Duplex is `"horizontal"` to the portal and `"two-sided-long-edge"` to CPDB. Similarly, Color is `use-color: "true"` on one side and a `color-mode` option on the other. And There are many such cases.

The solution I came up with is making **the dialog's own state the single source of truth**, with two translation layers around it:

- `apply_xdg_hints()`: takes the `settings` and `page-setup` vardicts the application sent and seeds the dialog's state from them, so an app's preferences are respected as the starting point.
- `build_xdg_response()`: converts dialog state back into the keys the portal specification expects, for the response.
- `build_cpdb_settings()`: converts the same dialog state into the option names the CPDB backends expect, for actual job submission.

Keeping these three functions separate, with the dialog state in the middle, means neither vocabulary leaks into the other, and adding a setting is a matter of touching one enum and three mapping arms.

### Submitting the job

`print_fd()` submits the job description to the backend and hands back a job ID and a **writable file descriptor**. The document then has to be streamed from the application's FD into that one. A minor hiccup faced here: CPDB backends (CUPS in particular) populate internal lookup tables lazily, so a printer query must happen before submission or the job is rejected for an "unknown" printer that you just listed a second ago. The copy itself runs on `tokio::task::spawn_blocking`, because a large document should not stall the portal's async executor:

```rust
let (job_id, cpdb_writable_fd) =
    client.print_fd(&printer_id, &backend, &settings_ref, &title).await?;

tokio::task::spawn_blocking(move || {
    let mut reader = File::from(document_fd);
    let mut writer = File::from(OwnedFd::from(cpdb_writable_fd));
    std::io::copy(&mut reader, &mut writer)
}).await
```

### The dialog itself

`src/print_dialog.rs` is largest single piece of the project. It follows the standard `iced`/`libcosmic` architecture and covers:

- Printer list with live updates, make/model, and status.
- Copies and collation.
- Color mode, orientation, and duplex, each populated from what the selected printer reports.
- Paper size and tray, queried from the media collection CPDB returns for that printer.
- Margins: default, none, minimum, or custom, with the printer's own hardware margins as bounds.
- Print quality.
- Page ranges: all pages, current page, odd or even only, or a custom range expression.
- Scaling: auto-fit or a custom percentage.
- Pages per sheet with a layout direction picker.
- Print to file: saving the document as a PDF when the "Save as PDF" entry is selected (Save as PDF always appears as the first entry in the printer list).

Everything is driven off the selected printer's queried capabilities.

### Presets

To enable good user experience, A **preset system** was introduced in the design. I implemented it via `cosmic-config` in `cosmic-portal-config`:

```rust
pub struct PrintPreset {
    pub id: String,
    pub name: String,
    pub is_builtin: bool,
    pub color_mode: String,
    pub orientation: String,
    pub duplex_index: Option<usize>,
    pub copies: u32,
    pub collate: bool,
    pub pages_per_sheet_index: Option<usize>,
    pub layout_direction: String,
    pub margins: String,
    pub scaling: String,
    pub custom_scaling_input: u32,
    pub page_selection: String,
    pub custom_range_input: String,
}
```

Three presets are built in (Default, Color, and Black and White), and the user can save their own, edit them, and delete them.

### Localization

Every user visible string in the dialog goes through `fl!`, Fluent-based localization. CPDB provides translations for the printer options, the provided translations are utilized in the dialog, well known IPP values were given fluent macro support as well. I added around **110 new keys** to the translation catalog. Once the PR is merged translations will be accepted as contributions via Weblate.

## Current state

**`cpdb-rs`: complete and merged upstream.** The zbus backend is merged upstream into `OpenPrinting/cpdb-rs`, is the crate's default feature, and is published on crates.io at 0.1.1. The C bindings were preserved behind the `ffi` feature in `cpdb-sys` for anyone who needs them.

**The COSMIC print dialog: feature-complete, in review.** [PR #331](https://github.com/pop-os/xdg-desktop-portal-cosmic/pull/331) implements the full `org.freedesktop.impl.portal.Print` interface. Every item on the PR's TODO list is checked off: the token system, the `Print` execution path, Save as PDF, option presets, localization, and alignment with the design the COSMIC design team specified. It is currently in the review cycle with the COSMIC team and is not yet merged.

It works end to end today. With CUPS and [`cpdb-backend-cups`](https://github.com/OpenPrinting/cpdb-backend-cups/) installed, you can run the portal and either fire a request by hand:

```sh
$ gdbus call --session --timeout 9999 \
  --dest org.freedesktop.impl.portal.desktop.cosmic \
  --object-path /org/freedesktop/portal/desktop \
  --method org.freedesktop.impl.portal.Print.PreparePrint \
  "/org/freedesktop/portal/desktop/request/1" \
  "com.test.App" \
  "" \
  "Test Print Document" \
  "{'gtk-print-backgrounds': <true>, 'gtk-print-header-footer': <false>}" \
  "@a{sv} {}" \
  "{'modal': <true>}"
```

Or, just press <kbd>Ctrl</kbd>+<kbd>P</kbd> in a Flatpak application. It has been tested working with Evince and gedit.

## What's left to do

**Review feedback on PR #331.** The review is active and I will be iterating on it. This is expected for a change of this size touching a shared component.

**Broader real-world printer testing.** The dialog has been exercised against the printers and backends available to me. Printers vary in what options they expose and how, and more hardware coverage may surface edge cases in the capability-driven UI.

**The portal API itself.** While building this, a set of limitations in the current XDG print portal API became clear, and they cap how good **any** implementation of this dialog can be:

- **No live preview:** The portal transfers the document only at the `Print` step, after all settings are chosen. The dialog therefore cannot show you what the page will look like as you change margins, scaling or pages-per-sheet, a feature users reasonably expect from a print dialog today.
- **Applications cannot expose their own settings:** A word processor wanting to offer "print comments" or a browser wanting "print backgrounds" has no well defined way to follow what to declare.
- **Vocabulary mismatch.** The settings dictionaries are informally do not match between CPDB and XDG.

Thanks to **Till Kamppeter** at OpenPrinting, there is an active effort to discuss these limitations and design a better print API at the [xdg-desktop-portal's GitHub discussion](https://github.com/flatpak/xdg-desktop-portal/discussions/2016). The COSMIC dialog deliberately targets the existing portal API for this cycle so it can ship and be useful now. When the improved API is ready, I will update the dialog to adopt it. The architecture, dialog state as the source of truth with mapping functions at the boundaries, was chosen partly so that this migration touches the edges rather than the core.

## Challenges faced during the program

**Learning a desktop stack from the inside.** Building a portal backend meant simultaneously understanding D-Bus service lifetimes, getting familiar with an unfamiliar GUI toolkit's architecture, and a printing protocol. I did a lot of reading (some writing as well, I wrote a short blog on how iced works, you can read it at my blog or find the link at the bottom). What saved me was that `xdg-desktop-portal-cosmic` already had well-built implementations of the screenshot, screencast and file-chooser portals. Having working reference code for "what does a portal request look like in this codebase" turned a from-scratch design problem into a pattern-matching one, and it is a strong argument for the value of a codebase with more than one example of each thing.

**The two-vocabulary problem.** As described above, making sure the XDG portal and CPDB agree on the same option names was the fiddliest part of the project. Not intellectually hard, but full of small asymmetries where a value exists on one side but not the other. It also took me a while to accept that the right answer was three explicit mapping functions rather than one clever bidirectional abstraction.

**The design.** A printing dialog is a GUI at the end of the day, it needs a user interface to allow users to interact with it and a good one at that. Now I am not desginer, and thankfully I didn't need to be one, I got ample support from the cosmic team for the design part of this project.

Two people made a real difference here. **Michael** from the COSMIC team was consistently available whenever I hit a technical wall in `libcosmic` or the portal internals. **Maria** from the COSMIC team gave full support on the design side. The dialog follows the COSMIC design, and any design question I had got answered.

## What I learned

More than I expected going in:

- **FFI, and then how to avoid it.** I had spent a couple weeks reasoning about `cpdb-libs`' C API - bindgen, callback trampolines, ownership rules across the boundary. The most valuable thing that taught me was how to recognize when the FFI layer is not actually load-bearing. This was my first time working with FFI, especially the Rust and C boundary, but taking in account its practicality with the project I ended up using zbus and not this.
- **IPC over D-Bus.** Spent a whole week just going over how D-Bus works, not how it was being used here but how it plainly works. The zbus tutorials were really helpful and then reading the existing implementations helped out the most in the end. Writing the zbus backend for `cpdb-rs` was probably the most fun thing I did this year.
- **Desktop GUI programming with `iced`/`libcosmic`.** Enough that I wrote up a separate blog on how `iced` works, building a small live CPU-usage system monitor as the worked example: **[Getting started with iced](https://ayuch.dev/blog/iced)**.
- **How printing actually works.** IPP attributes, CUPS' role, what "media" and "margins" mean when a printer reports them, and why a print dialog is much harder than the list of widgets on it suggests.
- **Shipping a crate.** `cpdb-rs` is the first crate I have had a major part in shipping to crates.io that will have real users.

## Thanks

To **Till Kamppeter** and OpenPrinting for mentorship, for the CPDB project itself, and for taking the portal API limitations seriously enough to start a conversation about fixing them upstream. To **Michael** and **Maria** from the COSMIC team for technical and design support throughout. And to Google Summer of Code for making a summer of this kind of work possible.

The COSMIC desktop will have a native print dialog, and Rust applications on Linux now have a clean, async, dependency-free way to talk to the printing stack.

---

### Links

- **cpdb-rs**: [GitHub](https://github.com/OpenPrinting/cpdb-rs), [crates.io](https://crates.io/crates/cpdb-rs), [docs.rs](https://docs.rs/cpdb-rs), [PR #6](https://github.com/OpenPrinting/cpdb-rs/pull/6)
- **COSMIC print dialog**: [PR #331](https://github.com/pop-os/xdg-desktop-portal-cosmic/pull/331)
- **CPDB**: [cpdb-libs](https://github.com/OpenPrinting/cpdb-libs), [cpdb-backend-cups](https://github.com/OpenPrinting/cpdb-backend-cups/)
- **XDG Print portal spec**: [flatpak.github.io](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.Print.html)
- **Discussion on Improvements to printing portal**: [github.com/flatpak/xdg-desktop-portal/discussions](https://github.com/flatpak/xdg-desktop-portal/discussions/2016)
- **My blog on iced**: [ayuch.dev/blog/iced](https://ayuch.dev/blog/iced)

...

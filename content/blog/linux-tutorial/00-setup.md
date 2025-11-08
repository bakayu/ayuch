+++
title = "Part 0: Setting Up Your Environment"
date = 2025-11-06
weight = 0
description = "Get your Linux command-line environment ready for the workshop"

[taxonomies]
tags = ["linux", "workshop", "tutorial", "setup", "wsl"]

[extra]
series = "Linux Command-Line Tutorial"
series_part = 0
toc = true
quick_navigation_buttons = true
giscus = true
+++

Before we dive into the workshop, let's get your environment set up! This guide will walk you through installing everything you need, regardless of your operating system.

## Windows Users: Installing WSL (Windows Subsystem for Linux)

WSL lets you run a full Linux environment directly on Windows. It's the best way to learn Linux commands on a Windows machine.

### Prerequisites

- Windows 10 version 2004+ or Windows 11
- Administrator access

### Step 1: Enable WSL

Open **PowerShell** as Administrator (Right-click Start → Windows PowerShell (Admin)) and run:

```powershell
wsl --install ubuntu
```

This command will:

- Enable WSL
- Install the Ubuntu distribution
- Set up the Linux kernel

**Restart your computer** when prompted.

### Step 2: Set Up Ubuntu

After restart, search for and launch ubuntu through windows search. It will ask you to create a new user:

```bash
Enter new UNIX username: yourusername
New password: ********
Retype new password: ********
```

**Important**:

- Choose a simple username (lowercase, no spaces)
- Remember your password! You'll need it for `sudo` commands
- The password won't show while typing (that's normal!)

### Step 3: Update Your System

Once Ubuntu is set up, run these commands:

```bash
sudo apt update
sudo apt upgrade -y
```

This updates all packages to their latest versions.

### Step 4: Verify Installation

Let's install `neofetch` to test everything:

```bash
sudo apt install neofetch -y
neofetch
```

You should see a beautiful display of your system information! 🎉

### Accessing WSL

You can open WSL in several ways:

1. Search for "Ubuntu" in the Start menu
2. Open Windows Terminal and select Ubuntu
3. Type `wsl` in PowerShell or Command Prompt

### WSL Tips

**Access Windows files**: Your Windows drives are mounted at `/mnt/`:

```bash
cd /mnt/c/Users/YourName/Desktop
```

**Access WSL files from Windows**: Type `\\wsl$` in File Explorer

**Copy/Paste**:

- Right-click to paste in terminal
- Or: Ctrl+Shift+C to copy, Ctrl+Shift+V to paste

---

## macOS Users: Installing Homebrew

macOS comes with a Unix-based terminal, so you're already halfway there! We'll install Homebrew, the package manager for macOS.

### Step 1: Install [Homebrew](https://brew.sh/)

Open **Terminal** (⌘+Space, type "Terminal") and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions. When complete, run:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Verify Installation

```bash
brew --version
```

You should see the Homebrew version number.

### Step 3: Test with neofetch

```bash
brew install neofetch
neofetch
```

You should see your Mac system info!

### macOS Tips

**Your shell**: macOS Catalina+ uses `zsh` by default (which is great! We'll customize it later)

**Access your files**: Your home folder is at `~/` or `/Users/YourName/`

---

## Linux Users: Package Managers

If you're already on Linux, you're all set! Here are the common package managers for popular distributions:

### Debian/Ubuntu/Linux Mint

```bash
sudo apt update
sudo apt install package-name
```

### Fedora/RHEL/CentOS

```bash
sudo dnf install package-name
# Or on older versions:
sudo yum install package-name
```

### Arch Linux/Manjaro

```bash
sudo pacman -S package-name
```

### openSUSE

```bash
sudo zypper install package-name
```

### Alpine Linux

```bash
sudo apk add package-name
```

### Check Your Package Manager

Not sure which one you have? Try:

```bash
# Check if apt exists
which apt

# Check if dnf exists
which dnf

# Check if pacman exists
which pacman
```

### Verify Installation

Install neofetch to test:

```bash
# Debian/Ubuntu
sudo apt install neofetch

# Fedora
sudo dnf install neofetch

# Arch
sudo pacman -S neofetch

# Then run it:
neofetch
```

---

## Testing Your Environment

Let's make sure everything works! Run these commands:

```bash
# Check your shell
echo $SHELL

# Check your home directory
cd ~
pwd

# List files
ls -la

# Create a test file
echo "Hello, Linux!" > test.txt
cat test.txt
rm test.txt

# Check for basic tools
which git
which curl
which vim
```

If all these commands work, you're ready to go! 🚀

---

## Troubleshooting

### WSL Issues

**"WSL command not found"**:

- Make sure you're running Windows 10 2004+ or Windows 11
- Run Windows Update

**"This operation requires elevation"**:

- You need to run PowerShell as Administrator

**Ubuntu doesn't launch after restart**:

- Search for "Ubuntu" in Start menu manually
- Or run `wsl` in PowerShell

### Homebrew Issues

**"Command not found" after installing**:

- Make sure you ran the [`echo`](#step-1-install-homebrew) command to add Homebrew to your PATH
- Close and reopen Terminal

**"Permission denied"**:

- Don't use `sudo` with Homebrew commands
- Homebrew should be installed for your user, not root

### Linux Issues

**"E: Could not get lock"**:

- Another package manager is running
- Wait a moment or restart your system

**"Permission denied"**:

- Remember to use `sudo` for system-wide installations

---

## What's Next?

Now that your environment is set up, you're ready to start learning!

**Your checklist**:

- [X] Terminal/WSL installed
- [X] Package manager working (apt/brew/etc.)
- [X] `neofetch` showing system info
- [X] Basic commands tested

**Ready to begin?** Let's dive into the actual command-line skills!

---

## Next Part

**Start learning:** [Part 1: Getting Started - Your First Commands](/blog/linux-tutorial/01-getting-started)

## Series Index

**Back to Workshop:** [Linux Command-Line Tutorial](/blog/linux-tutorial)

---

## Quick Reference

```bash
# WSL (Windows)
wsl --install              # Install WSL
sudo apt update            # Update packages
sudo apt install neofetch  # Install a package

# macOS
brew install neofetch      # Install a package
brew update                # Update Homebrew

# Linux (Debian/Ubuntu)
sudo apt install neofetch  # Install a package
sudo apt update            # Update package list
```

**Having issues?** Drop a comment below or check the [WSL documentation](https://docs.microsoft.com/en-us/windows/wsl/) / [Homebrew documentation](https://docs.brew.sh/).
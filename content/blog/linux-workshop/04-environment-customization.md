+++
title = "Part 4: Environment Mastery - Customizing Your Shell"
date = 2025-11-10
weight = 4
description = "Learn to customize your shell with environment variables, aliases, and the .bashrc file"

[taxonomies]
tags = ["linux", "workshop", "tutorial", "command-line", "bash"]

[extra]
series = "Linux Command-Line Workshop"
series_part = 4
toc = true
quick_navigation_buttons = true
giscus = true
+++

## Navigation

**Continue to Part 5:** [The Final Challenge - Putting It All Together](/blog/linux-workshop/05-final-challenge)

**Back to Part 3:** [Permissions & Processes - System Control](/blog/linux-workshop/03-permissions-processes)

---

Welcome to Part 4! Now we'll make the terminal truly *yours* by customizing your shell environment.

## Understanding Your Shell

Your shell is the program that interprets your commands. Most Linux systems use **Bash** (Bourne Again SHell), but others like Zsh and Fish are popular too.

**Check your shell**:
```bash
echo $SHELL
# Output: /bin/bash (or /bin/zsh, etc.)
```

**Exercise 4.1**:
```bash
echo $SHELL
bash --version
```

---

## Environment Variables

Environment variables are like global settings for your shell. They store information that programs can access.

### Viewing Environment Variables

```bash
env                     # List all environment variables
echo $HOME              # Your home directory
echo $USER              # Your username
echo $PATH              # Where the shell looks for commands
echo $PWD               # Current directory
echo $SHELL             # Your shell program
```

**Exercise 4.2**:
```bash
env | grep USER
echo $HOME
echo $PATH
```

---

### Understanding `$PATH`

`$PATH` is critical. It's a colon-separated list of directories where the shell looks for commands.

```bash
echo $PATH
# Output: /usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
```

When you type `ls`, the shell searches these directories in order:
1. `/usr/local/bin/ls`
2. `/usr/bin/ls` ← Found! (stops searching)
3. `/bin/ls`

**Exercise 4.3**:
```bash
echo $PATH
which ls                # Shows which 'ls' is being used
which python3
```

---

### Setting Environment Variables

**Temporary** (current session only):
```bash
export MY_VAR="Hello"
echo $MY_VAR

export PATH="$PATH:$HOME/bin"    # Add to PATH
```

**Permanent** (edit `.bashrc` or `.bash_profile`):
```bash
# We'll do this in the next section!
```

**Exercise 4.4**:
```bash
export WORKSHOP="Linux CLI"
echo $WORKSHOP
echo "I'm learning $WORKSHOP"

# Try in a new terminal - it's gone! (temporary)
```

---

### Common Environment Variables

```bash
$HOME           # Your home directory
$USER           # Your username
$HOSTNAME       # Computer name
$PWD            # Current directory
$OLDPWD         # Previous directory
$PATH           # Command search path
$SHELL          # Your shell
$EDITOR         # Default text editor
$LANG           # Language settings
$PS1            # Prompt string
```

---

## The `.bashrc` File

The `.bashrc` file is a script that runs every time you open a new terminal. This is where you customize your shell!

**Location**: `~/.bashrc` (hidden file in your home directory)

**Exercise 4.5**:
```bash
cd ~
ls -la | grep bashrc
cat ~/.bashrc | head -20
```

---

### Editing `.bashrc`

**⚠️ Important**: Always backup before editing!

```bash
cp ~/.bashrc ~/.bashrc.backup
nano ~/.bashrc          # or: vim ~/.bashrc, code ~/.bashrc
```

**Apply changes**:
```bash
source ~/.bashrc        # Reload the file
# OR
. ~/.bashrc             # Same thing (. is shorthand for source)
# OR
exec bash               # Restart the shell
```

---

## Aliases - Your Personal Shortcuts

Aliases are shortcuts for long commands. They make you faster and save typing.

### Creating Aliases

**Temporary** (current session):
```bash
alias ll='ls -la'
alias gs='git status'
alias ..='cd ..'
```

**Permanent** (add to `.bashrc`):
```bash
nano ~/.bashrc
# Add at the end:
# alias ll='ls -la'
# alias gs='git status'
# alias ..='cd ..'
source ~/.bashrc
```

**Exercise 4.6**:
```bash
# Create temporary aliases
alias ll='ls -lah'
alias c='clear'
alias h='history'

# Try them
ll
c
h
```

---

### Useful Aliases to Add

Open your `.bashrc` and add these:

```bash
# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'

# Listing
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'

# Safety
alias rm='rm -i'        # Confirm before delete
alias cp='cp -i'        # Confirm before overwrite
alias mv='mv -i'        # Confirm before overwrite

# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# System
alias df='df -h'
alias du='du -h'
alias free='free -h'
alias ports='netstat -tulanp'

# Quick edit
alias bashrc='nano ~/.bashrc'
alias reload='source ~/.bashrc'

# Miscellaneous
alias now='date +"%T"'
alias nowdate='date +"%d-%m-%Y"'
alias weather='curl wttr.in'
```

**Exercise 4.7**:
```bash
# Add these to your .bashrc
nano ~/.bashrc

# Add at the end:
alias ll='ls -lah'
alias ..='cd ..'
alias gs='git status'
alias reload='source ~/.bashrc'

# Save (Ctrl+O, Enter, Ctrl+X in nano)
source ~/.bashrc

# Test
ll
..
reload
```

---

### Viewing and Removing Aliases

```bash
alias                   # List all aliases
alias ll                # Show specific alias
unalias ll              # Remove alias (temporary)
```

---

## Customizing Your Prompt (`$PS1`)

The prompt is the text before your cursor. By default: `user@hostname:~$`

**See your current prompt**:
```bash
echo $PS1
# Output: \u@\h:\w\$
```

**Prompt escape codes**:
- `\u` - Username
- `\h` - Hostname
- `\w` - Full working directory
- `\W` - Current directory name only
- `\$` - `$` for normal user, `#` for root
- `\d` - Date
- `\t` - Time (24-hour)
- `\n` - Newline

**Exercise 4.8** - Simple custom prompt:
```bash
# Try these (temporary)
PS1="\u@\h:\w\$ "               # Default
PS1="[\t] \u:\w\$ "             # Add time
PS1="\w > "                     # Minimalist
PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "  # Colors!
```

**Make it permanent** - add to `.bashrc`:
```bash
# Colorful prompt (green user@host, blue directory)
PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "
```

---

## The berzifetch Project

Now let's do something cool! We'll install and configure **berzifetch** - a system information tool written by a friend.

### What is berzifetch?

berzifetch displays your system information in a beautiful format. Think of it like `neofetch` but customizable!

**Repository**: https://github.com/Spirizeon/berzifetch

---

### Installing berzifetch

**Exercise 4.9**:
```bash
# Clone the repository
cd ~/Downloads
git clone https://github.com/Spirizeon/berzifetch.git
cd berzifetch

# Read the README
cat README.md

# Make it executable
chmod +x berzifetch

# Try it
./berzifetch
```

---

### Adding berzifetch to Your PATH

Option 1: **Copy to a directory already in PATH**:
```bash
sudo cp berzifetch /usr/local/bin/
# Now you can run: berzifetch (from anywhere)
```

Option 2: **Add its directory to PATH** (better for development):
```bash
# Add to ~/.bashrc:
export PATH="$PATH:$HOME/Downloads/berzifetch"

# Reload
source ~/.bashrc

# Test
berzifetch
```

**Exercise 4.10**:
```bash
# Use Option 1
cd ~/Downloads/berzifetch
sudo cp berzifetch /usr/local/bin/

# Verify
which berzifetch
berzifetch
```

---

### Creating a berzifetch Alias

Let's make it run every time you open a terminal!

**Exercise 4.11**:
```bash
nano ~/.bashrc

# Add at the end:
alias fetch='berzifetch'

# OR make it auto-run on terminal startup:
berzifetch

# Save and reload
source ~/.bashrc
```

Now every new terminal shows your system info! 🎉

---

### Customizing berzifetch

Check if berzifetch has a config file:
```bash
ls ~/.config/berzifetch/
# OR
berzifetch --help
```

Explore customization options in the repository README.

---

## Functions in `.bashrc`

Functions are like aliases on steroids - they can accept arguments!

**Exercise 4.12** - Add these functions to `.bashrc`:
```bash
# Create a directory and enter it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extract any archive
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.gz)   tar xzf "$1"    ;;
            *.zip)      unzip "$1"      ;;
            *.rar)      unrar x "$1"    ;;
            *.tar)      tar xf "$1"     ;;
            *)          echo "Unknown archive format" ;;
        esac
    else
        echo "File not found"
    fi
}

# Quick backup
backup() {
    cp "$1" "$1.backup-$(date +%Y%m%d-%H%M%S)"
}

# Find process by name
psgrep() {
    ps aux | grep -v grep | grep -i -e VSZ -e "$1"
}
```

**Usage**:
```bash
source ~/.bashrc

mkcd test_folder        # Creates and enters directory
backup important.txt    # Creates timestamped backup
psgrep firefox          # Find Firefox processes
```

---

## Capstone Exercise 1: Build Your Perfect Shell

Create a personalized `.bashrc` setup:

**Requirements**:
1. Add 5 useful aliases
2. Customize your prompt with colors
3. Install and configure berzifetch to auto-run
4. Add the `mkcd` and `backup` functions
5. Add your `~/bin` directory to PATH (create it if needed)

**Bonus**:
- Add a welcome message with your name and date
- Create an alias that shows your top 10 most-used commands

<details>
<summary>Click to reveal solution</summary>

```bash
# Backup first!
cp ~/.bashrc ~/.bashrc.backup-$(date +%Y%m%d)

# Edit
nano ~/.bashrc

# Add these sections:

# === PROMPT ===
PS1="\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "

# === ALIASES ===
alias ll='ls -lah'
alias ..='cd ..'
alias gs='git status'
alias reload='source ~/.bashrc'
alias h='history'

# === FUNCTIONS ===
mkcd() {
    mkdir -p "$1" && cd "$1"
}

backup() {
    cp "$1" "$1.backup-$(date +%Y%m%d-%H%M%S)"
}

# === PATH ===
export PATH="$PATH:$HOME/bin"

# === STARTUP ===
echo "Welcome, $USER! Today is $(date +%A,\ %B\ %d,\ %Y)"
berzifetch

# Save and reload
source ~/.bashrc
```

**Bonus - Top 10 commands**:
```bash
alias topcommands='history | awk "{print \$2}" | sort | uniq -c | sort -rn | head -10'
```

</details>

---

## Capstone Exercise 2: Environment Detective

Create a script that displays your environment setup.

**Exercise 4.13**: Create `~/bin/myenv`:
```bash
mkdir -p ~/bin
nano ~/bin/myenv
```

**Script content**:
```bash
#!/bin/bash

echo "=== My Shell Environment ==="
echo "User: $USER"
echo "Home: $HOME"
echo "Shell: $SHELL"
echo "Editor: $EDITOR"
echo ""

echo "=== PATH Directories ==="
echo $PATH | tr ':' '\n' | nl
echo ""

echo "=== Custom Aliases ==="
alias | grep -v "^alias ls" | head -10
echo ""

echo "=== Functions ==="
declare -F | cut -d' ' -f3
```

**Make it executable and run**:
```bash
chmod +x ~/bin/myenv
myenv
```

---

## Advanced: Shell Configuration Files

Different files load at different times:

```bash
~/.bash_profile     # Login shells (SSH, first terminal)
~/.bashrc           # Interactive shells (new terminal tabs)
~/.bash_logout      # When you logout
~/.bash_aliases     # Separate file for aliases (sourced by .bashrc)
```

**Best practice**: Put everything in `.bashrc`, then have `.bash_profile` source it:

```bash
# ~/.bash_profile
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
```

---

## Quick Reference Card

```bash
# Environment Variables
export VAR="value"      # Set variable
echo $VAR               # Print variable
env                     # List all variables
echo $PATH              # Command search path

# Configuration
nano ~/.bashrc          # Edit config
source ~/.bashrc        # Reload config
cp ~/.bashrc ~/backup   # Backup

# Aliases
alias ll='ls -la'       # Create alias
alias                   # List aliases
unalias ll              # Remove alias

# Functions
function_name() {       # Define function
    commands
}

# PATH Management
export PATH="$PATH:/new/path"   # Add to PATH
which command                    # Find command location
```

---

## Next Part

**Continue to Part 5:** [The Final Challenge - Putting It All Together](/blog/linux-workshop/05-final-challenge)

## Previous Part

**Back to Part 3:** [Permissions & Processes - System Control](/blog/linux-workshop/03-permissions-processes)

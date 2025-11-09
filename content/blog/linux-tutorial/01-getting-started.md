+++
title = "Part 1: Getting Started - Your First Commands"
date = 2025-11-09
weight = 4
description = "Learn essential navigation and file operation commands in the Linux terminal"

[taxonomies]
tags = ["linux", "workshop", "tutorial", "command-line"]

[extra]
series = "Linux Command-Line Tutorial"
series_part = 1
toc = true
quick_navigation_buttons = true
giscus = true
show_previous_next_article_links = true
invert_previous_next_article_links = true
# social_media_card = "images/linux-tutorial/card1.jpg"
+++

## Navigation

0. [Tutorial Index](/blog/linux-tutorial)
1. [Part-00 : Setup](/blog/linux-tutorial/00-setup)
2. [Part-01 : Getting Started](/blog/linux-tutorial/01-getting-started) ◄ You are here
3. [Part-02 : Reading and Searching](/blog/linux-tutorial/02-reading-searching)
4. [Part-03 : Permissions and Processes](/blog/linux-tutorial/03-permissions-processes)
5. [Part-04 : Environment Customization](/blog/linux-tutorial/04-environment-customization)
6. [Part-05 : Solutions and Next Steps](/blog/linux-tutorial/05-solutions)

---

Welcome to Part 1 of the Linux Command-Line Workshop!

{{admonition(type="warning", text="**Haven't set up your environment yet?** Go back to [Part 0: Setting Up Your Environment](/blog/linux-tutorial/00-setup) first!
")}}

In this post, you'll learn the fundamental commands that every developer needs to navigate and manipulate files in the terminal.

## The Anatomy of a Command

Before we dive in, let's understand what a command looks like:

```bash
command -options arguments
```

- **command**: The program you want to run (e.g., `ls`)
- **options** (flags): Modify how the command behaves (e.g., `-a`, `-l`)
- **arguments**: What the command acts on (e.g., a filename or directory)

Example:

```bash
ls -la /home/user
│  │  └─ argument (directory to list)
│  └─ options (long format + show hidden files)
└─ command (list directory contents)
```

## Navigation Commands

### `pwd` - Print Working Directory

Shows you where you currently are in the filesystem.

```bash
pwd
# Output: /home/bakayu
```

**Exercise 1.1**: Open your terminal and run `pwd`. What directory are you in?

---

### `ls` - List Directory Contents

The most-used command. Shows files and folders in your current location.

**Basic usage:**

```bash
ls              # List current directory
ls /home        # List specific directory
ls Documents    # List relative path
```

**Important flags:**

```bash
ls -a       # Show ALL files (including hidden ones starting with .)
ls -l       # Long format (permissions, owner, size, date)
ls -h       # Human-readable sizes (KB, MB, GB)
ls -la      # Combine flags! Long format + hidden files
```

**Exercise 1.2**:

1. Run `ls` in your home directory
2. Run `ls -a` - do you see any new files? (Hint: look for `.bashrc`, `.profile`)
3. Run `ls -lh` - what's the size of your largest file?

**Pro tip:** You can combine short flags: `ls -lah` is the same as `ls -l -a -h`

---

### `cd` - Change Directory

Move around the filesystem.

**Basic usage:**

```bash
cd Documents        # Go to Documents (relative path)
cd /home/user       # Go to absolute path
cd ..               # Go up one level
cd ~                # Go to home directory
cd -                # Go to previous directory
```

**Important paths:**

- `/` - Root directory (top of filesystem)
- `~` - Your home directory (shortcut for `/home/username`)
- `.` - Current directory
- `..` - Parent directory

**Exercise 1.3**:

1. Go to your home directory: `cd ~`
2. Go to root: `cd /`
3. List what's there: `ls`
4. Go back home: `cd ~`
5. Create this navigation: `cd Documents` (if it exists) then `cd ..` then `cd -`

---

## File Operations

### `mkdir` - Make Directory

Create new folders.

```bash
mkdir myproject             # Create one folder
mkdir -p path/to/deep/dir   # Create nested folders (-p = parents)
mkdir dir1 dir2 dir3        # Create multiple folders
```

**Exercise 1.4**:

```bash
cd ~
mkdir workshop-practice
cd workshop-practice
mkdir -p projects/web/frontend
ls -R       # Recursively list all subdirectories
```

---

### `touch` - Create Empty File

Creates a new empty file or updates timestamp of existing file.

```bash
touch file.txt
touch index.html style.css script.js    # Create multiple files
```

**Exercise 1.5**:

```bash
cd ~/workshop-practice
touch README.md notes.txt
ls -l
```

---

### `cp` - Copy Files

```bash
cp source destination          # Copy file
cp -r folder/ backup/          # Copy directory (-r = recursive)
cp file.txt file_backup.txt    # Copy and rename
```

**Exercise 1.6**:

```bash
cd ~/workshop-practice
cp README.md README_backup.md
mkdir backup
cp -r projects/ backup/
ls backup/
```

---

### `mv` - Move/Rename Files

```bash
mv oldname newname             # Rename
mv file.txt Documents/         # Move to directory
mv file.txt ~/backup/new.txt   # Move and rename
```

**Exercise 1.7**:

```bash
cd ~/workshop-practice
mv notes.txt important_notes.txt
mkdir archive
mv README_backup.md archive/
ls
ls archive/
```

---

### `rm` - Remove Files

**⚠️ Warning**: There's no trash/recycle bin. Deleted = gone forever!

```bash
rm file.txt         # Delete file
rm -r folder/       # Delete directory (recursive)
rm -i file.txt      # Interactive (asks confirmation)
rm -f file.txt      # Force (no confirmation)
```

**Exercise 1.8**:

```bash
cd ~/workshop-practice
touch test_delete.txt
ls
rm -i test_delete.txt       # Type 'y' to confirm
ls                          # Verify it's gone
```

---

## Getting Help

### `man` - Manual Pages

```bash
man ls      # Open the manual for 'ls'
man cp      # Open the manual for 'cp'
```

Navigation in `man`:

- Press `SPACE` to go down one page
- Press `b` to go back one page
- Press `/` to search (type your search term, press Enter)
- Press `q` to quit

**Exercise 1.9**: Run `man ls` and find what the `-R` flag does.

---

### `--help` Flag

Most commands support `--help`:

```bash
ls --help
cp --help
```

---

## Hands-On Challenge

Ready to practice? Complete the hands-on challenge in the workshop repository:

**[Part 1 Challenge on GitHub](https://github.com/bakayu/linux-tutorial/tree/master/01-getting-started)**

**Challenge**: Build a complete web project structure using only the commands you learned.

The challenge includes:

- Exact requirements for the directory structure
- Verification script to check your work
- Progressive hints if you get stuck
- Time goal to challenge yourself

Clone the repository and give it a try:

```bash
git clone https://github.com/bakayu/linux-tutorial.git
cd linux-tutorial/01-getting-started
cat README.md
```

---

## Summary

You've learned:

- Navigation: `pwd`, `ls`, `cd`  
- File operations: `mkdir`, `touch`, `cp`, `mv`, `rm`  
- Getting help: `man`, `--help`  

These are the foundation of everything you'll do in the terminal!

## Next Steps

In [Part 2: Reading & Searching](/blog/linux-tutorial/02-reading-searching), we'll learn how to:

- View file contents (`cat`, `less`, `head`, `tail`)
- Search for text (`grep`)
- Chain commands together with pipes (`|`)

---

## Quick Reference Card

```bash
# Navigation
pwd              # Where am I?
ls -lah          # What's here?
cd ~/Documents   # Go somewhere

# File Operations
mkdir -p path/to/dir    # Create folders
touch file.txt          # Create file
cp -r src/ backup/      # Copy
mv old.txt new.txt      # Rename/move
rm -i file.txt          # Delete (careful!)

# Help
man command      # Full manual
command --help   # Quick help
```

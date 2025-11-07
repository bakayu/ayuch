+++
title = "Part 3: Permissions & Processes - System Control"
date = 2025-11-09
weight = 3
description = "Master file permissions, ownership, and process management on Linux"

[taxonomies]
tags = ["linux", "workshop", "tutorial", "command-line"]

[extra]
series = "Linux Command-Line Workshop"
series_part = 3
toc = true
quick_navigation_buttons = true
giscus = true
+++

## Navigation

**Continue to Part 4:** [Environment Mastery - Customizing Your Shell](/blog/linux-workshop/04-environment-customization)

**Back to Part 2:** [Reading & Searching - Master Text Processing](/blog/linux-workshop/02-reading-searching)

---

Now that you can navigate and search, let's learn to **control** the system: managing permissions and processes.

## Understanding File Permissions

When you run `ls -l`, you see something like:

```bash
-rw-r--r-- 1 bakayu users 1234 Nov 07 10:30 file.txt
│││││││││  │ │      │     │    │          └─ filename
│││││││││  │ │      │     │    └─ timestamp
│││││││││  │ │      │     └─ size
│││││││││  │ │      └─ group
│││││││││  │ └─ owner
│││││││││  └─ number of hard links
└┴┴┴┴┴┴┴┴─ permissions
```

### Permission Breakdown

```
-rw-r--r--
│││ │││ │││
│││ │││ └┴┴─ others: read only
│││ └┴┴──── group: read only
│└┴──────── owner: read + write
└────────── file type (- = file, d = directory, l = link)
```

**Permission meanings**:
- `r` (read) = 4
  - Files: Can view content
  - Directories: Can list contents
- `w` (write) = 2
  - Files: Can modify
  - Directories: Can create/delete files
- `x` (execute) = 1
  - Files: Can run as program
  - Directories: Can enter (cd into)

**Exercise 3.1**:
```bash
cd ~/workshop-practice
ls -l greeting.txt
# Decode what you see!
```

---

## Changing Permissions

### `chmod` - Change Mode

**Symbolic method** (easier to remember):

```bash
chmod u+x file.sh           # Add execute for user
chmod g-w file.txt          # Remove write for group
chmod o+r file.txt          # Add read for others
chmod a+x script.sh         # Add execute for all
chmod u+rw,g+r file.txt     # Multiple changes
```

Legend:
- `u` = user (owner)
- `g` = group
- `o` = others
- `a` = all (ugo)
- `+` = add permission
- `-` = remove permission
- `=` = set exactly

**Numeric method** (faster when you know it):

```bash
chmod 755 script.sh         # rwxr-xr-x
chmod 644 file.txt          # rw-r--r--
chmod 600 secret.txt        # rw-------
chmod 777 public.txt        # rwxrwxrwx (dangerous!)
```

Calculate: `r=4, w=2, x=1`, then add:
- `755` = `rwxr-xr-x` = `(4+2+1)(4+0+1)(4+0+1)`
- `644` = `rw-r--r--` = `(4+2+0)(4+0+0)(4+0+0)`

**Exercise 3.2**:
```bash
cd ~/workshop-practice

# Create a script
cat > hello.sh << 'EOF'
#!/bin/bash
echo "Hello from a script!"
EOF

# Try to run it
./hello.sh                  # Permission denied!

# Make it executable
chmod +x hello.sh
ls -l hello.sh
./hello.sh                  # Now it works!

# Make it read-only
chmod 444 hello.sh
ls -l hello.sh
# Try to edit it - you'll need sudo!
```

**Common permission patterns**:
- `755` - Scripts, executables
- `644` - Regular files (documents, configs)
- `600` - Private files (SSH keys, passwords)
- `700` - Private directories

---

### `chown` - Change Owner

**Requires sudo (root privileges)**:

```bash
sudo chown user file.txt            # Change owner
sudo chown user:group file.txt      # Change owner and group
sudo chown -R user:group folder/    # Recursive
```

**Exercise 3.3**:
```bash
cd ~/workshop-practice
touch myfile.txt
ls -l myfile.txt

# This will likely fail (unless you're root):
# sudo chown root myfile.txt
# sudo chown $USER myfile.txt  # Change back
```

---

### `chgrp` - Change Group

```bash
chgrp groupname file.txt
chgrp -R groupname folder/
```

**See your groups**:
```bash
groups              # Your current groups
id                  # Detailed user info
```

---

## Process Management

A **process** is a running program. Every command you run creates a process.

### `ps` - Process Status

Show running processes:

```bash
ps                  # Your processes in current terminal
ps -u username      # All processes for a user
ps aux              # All processes, detailed
ps aux | grep "firefox"  # Find specific process
```

**Exercise 3.4**:
```bash
ps
ps aux
ps aux | grep "bash"
```

**Understanding ps aux output**:
```
USER  PID  %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND
root  1    0.0  0.1  16832  1234 ?    Ss   10:00   0:01 /sbin/init
│     │    │    │     │     │    │    │    │       │    └─ command
│     │    │    │     │     │    │    │    │       └─ CPU time
│     │    │    │     │     │    │    │    └─ start time
│     │    │    │     │     │    │    └─ state (S=sleeping, R=running)
│     │    │    │     │     │    └─ terminal
│     │    │    │     │     └─ memory (KB)
│     │    │    │     └─ virtual memory
│     │    │    └─ % of RAM
│     │    └─ % of CPU
│     └─ Process ID
└─ User
```

---

### `top` / `htop` - Live Process Viewer

Interactive process monitor:

```bash
top                 # Basic monitor
htop                # Better alternative (may need to install)
```

**Controls in `top`**:
- `q` - Quit
- `k` - Kill process (prompts for PID)
- `M` - Sort by memory
- `P` - Sort by CPU
- `h` - Help

**Exercise 3.5**:
```bash
top
# Press 'M' to sort by memory
# Press 'q' to quit
```

---

### `kill` - Terminate Process

```bash
kill PID                # Polite shutdown (SIGTERM)
kill -9 PID             # Force kill (SIGKILL)
killall process_name    # Kill all instances by name
pkill pattern           # Kill by pattern match
```

**Common signals**:
- `15` (SIGTERM) - Default, graceful shutdown
- `9` (SIGKILL) - Force kill immediately
- `1` (SIGHUP) - Reload config
- `2` (SIGINT) - Interrupt (like Ctrl+C)

**Exercise 3.6**:
```bash
# Start a long-running process in background
sleep 300 &
echo $!                 # Shows the PID

# Find it
ps aux | grep "sleep"

# Kill it (replace 12345 with actual PID)
kill 12345

# Verify it's gone
ps aux | grep "sleep"
```

---

### Background Jobs

```bash
command &               # Run in background
jobs                    # List background jobs
fg                      # Bring to foreground
bg                      # Resume in background
Ctrl+Z                  # Suspend current job
```

**Exercise 3.7**:
```bash
# Start in background
sleep 100 &

# List jobs
jobs

# Start another, then suspend it
sleep 200
# Press Ctrl+Z

# List jobs again
jobs

# Resume in background
bg

# Kill all background jobs
kill $(jobs -p)
```

---

### `nohup` - No Hangup

Keep process running after logout:

```bash
nohup long_script.sh &
# Output goes to nohup.out
```

---

## File Searching (Advanced)

### `locate` - Fast File Search

Uses a database (updated nightly):

```bash
locate filename
locate "*.conf"
sudo updatedb           # Update the database manually
```

---

### `which` - Find Executable Location

```bash
which python
which ls
which code
```

**Exercise 3.8**:
```bash
which bash
which git
which nonexistent       # No output if not found
```

---

### `whereis` - Find Binary, Source, Manual

```bash
whereis python
whereis ls
```

---

## System Information

### `df` - Disk Free

Show disk usage:

```bash
df                      # All filesystems
df -h                   # Human-readable
df -h /home             # Specific mount
```

**Exercise 3.9**:
```bash
df -h
```

---

### `du` - Disk Usage

Show directory sizes:

```bash
du -sh folder/          # Summary of folder
du -h folder/           # All files/folders
du -sh */               # All subdirectories
du -h --max-depth=1     # One level deep
```

**Exercise 3.10**:
```bash
cd ~
du -sh Documents/
du -sh */
du -h --max-depth=1 | sort -h
```

---

### `free` - Memory Usage

```bash
free                    # Memory info
free -h                 # Human-readable
free -m                 # In megabytes
```

---

### `uname` - System Info

```bash
uname -a                # All info
uname -r                # Kernel version
uname -m                # Architecture
```

---

## Capstone Exercise 1: Script Execution

Create and run a system monitoring script.

**Your Task**: Create `sysmon.sh` that shows:
1. Current date/time
2. Disk usage of /home
3. Top 3 memory-consuming processes
4. Number of running processes

<details>
<summary>Click to reveal solution</summary>

```bash
cat > sysmon.sh << 'EOF'
#!/bin/bash

echo "=== System Monitor ==="
echo "Date: $(date)"
echo ""

echo "=== Disk Usage: /home ==="
df -h /home
echo ""

echo "=== Top 3 Memory Users ==="
ps aux --sort=-%mem | head -n 4
echo ""

echo "=== Process Count ==="
echo "Running processes: $(ps aux | wc -l)"
EOF

chmod +x sysmon.sh
./sysmon.sh
```

</details>

---

## Capstone Exercise 2: Permission Puzzle

Setup:
```bash
cd ~/workshop-practice
mkdir secure_project
cd secure_project
touch public.txt private.txt script.sh config.cfg
```

**Requirements**:
1. `public.txt` - Everyone can read, only you can write
2. `private.txt` - Only you can read/write
3. `script.sh` - Only you can read/write/execute
4. `config.cfg` - You can read/write, group can read

<details>
<summary>Click to reveal solution</summary>

```bash
chmod 644 public.txt        # rw-r--r--
chmod 600 private.txt       # rw-------
chmod 700 script.sh         # rwx------
chmod 640 config.cfg        # rw-r-----

# Verify
ls -l
```

</details>

---

## Quick Reference Card

```bash
# Permissions
ls -l                   # View permissions
chmod +x file           # Add execute
chmod 755 script.sh     # rwxr-xr-x
chmod 644 file.txt      # rw-r--r--
chmod 600 secret.txt    # rw-------
sudo chown user file    # Change owner

# Processes
ps aux                  # All processes
top                     # Live monitor
kill PID                # Terminate process
kill -9 PID             # Force kill
killall name            # Kill by name
jobs                    # Background jobs
fg / bg                 # Foreground/background

# System Info
df -h                   # Disk usage
du -sh folder/          # Folder size
free -h                 # Memory usage
which command           # Find executable
uname -a                # System info
```

--

## Next Part

**Continue to Part 4:** [Environment Mastery - Customizing Your Shell](/blog/linux-workshop/04-environment-customization)

## Previous Part

**Back to Part 2:** [Reading & Searching - Master Text Processing](/blog/linux-workshop/02-reading-searching)
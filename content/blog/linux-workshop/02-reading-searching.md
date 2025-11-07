+++
title = "Part 2: Reading & Searching - Master Text Processing"
date = 2025-11-08
weight = 2
description = "Learn to view, search, and process text files using the Linux command line"

[taxonomies]
tags = ["linux", "workshop", "tutorial", "command-line"]

[extra]
series = "Linux Command-Line Workshop"
series_part = 2
toc = true
quick_navigation_buttons = true
giscus = true
+++

## Navigation

**Continue to Part 3:** [Permissions & Processes - System Control](/blog/linux-workshop/03-permissions-processes)

**Back to Part 1:** [Getting Started - Your First Commands](/blog/linux-workshop/01-getting-started)

---

In Part 1, you learned to navigate and create files. Now let's learn to **read** them and **search** through them like a pro.

## Viewing File Contents

### `cat` - Concatenate and Display

The simplest way to view a file. Dumps the entire content to your screen.

```bash
cat file.txt                    # Display file
cat file1.txt file2.txt         # Display multiple files
cat file.txt > newfile.txt      # Redirect output to new file
cat file1.txt file2.txt > combined.txt  # Combine files
```

**Exercise 2.1**:
```bash
cd ~/workshop-practice
echo "Hello, Linux!" > greeting.txt
cat greeting.txt
```

**When to use**: Small files (< 100 lines). For large files, use `less`.

---

### `less` - View Large Files

A "pager" that lets you scroll through files without loading everything into memory.

```bash
less large_file.txt
```

**Navigation inside `less`**:
- `SPACE` or `f` - Next page
- `b` - Previous page
- `/searchterm` - Search forward
- `?searchterm` - Search backward
- `n` - Next search result
- `N` - Previous search result
- `g` - Go to start
- `G` - Go to end
- `q` - Quit

**Exercise 2.2**:
```bash
# Create a large file
seq 1 1000 > numbers.txt
less numbers.txt
# Try: Search for "500" by typing /500
# Press 'q' to quit
```

---

### `head` - First Lines

View the beginning of a file.

```bash
head file.txt           # First 10 lines (default)
head -n 20 file.txt     # First 20 lines
head -5 file.txt        # First 5 lines
```

**Exercise 2.3**:
```bash
head -20 numbers.txt
head -3 numbers.txt
```

---

### `tail` - Last Lines

View the end of a file. **Super useful for log files!**

```bash
tail file.txt           # Last 10 lines (default)
tail -n 50 file.txt     # Last 50 lines
tail -f logfile.log     # Follow mode (live updates!)
```

**Exercise 2.4**:
```bash
tail -20 numbers.txt
tail -5 numbers.txt
```

**Real-world use case**: `tail -f /var/log/nginx/access.log` to watch web server requests in real-time.

---

### `wc` - Word Count

Count lines, words, and characters.

```bash
wc file.txt             # Shows: lines words characters
wc -l file.txt          # Just line count
wc -w file.txt          # Just word count
wc -c file.txt          # Just character count
```

**Exercise 2.5**:
```bash
wc numbers.txt
wc -l numbers.txt
echo "Hello World" | wc -w
```

---

## Searching Through Text

### `grep` - Global Regular Expression Print

**The most powerful search tool.** Find lines matching a pattern.

**Basic usage**:
```bash
grep "search_term" file.txt
grep "error" /var/log/syslog
```

**Important flags**:
```bash
grep -i "error" file.txt        # Case-insensitive
grep -n "error" file.txt        # Show line numbers
grep -v "error" file.txt        # Invert (show NON-matching lines)
grep -r "TODO" .                # Recursive (search in all files)
grep -c "error" file.txt        # Count matches
grep -A 3 "error" file.txt      # Show 3 lines After match
grep -B 3 "error" file.txt      # Show 3 lines Before match
grep -C 3 "error" file.txt      # Show 3 lines of Context
```

**Exercise 2.6**:
```bash
cd ~/workshop-practice

# Create a sample log file
cat > app.log << EOF
2024-01-15 10:23:45 INFO Server started
2024-01-15 10:24:12 ERROR Failed to connect to database
2024-01-15 10:24:15 WARNING Retrying connection
2024-01-15 10:24:20 INFO Connected successfully
2024-01-15 10:25:01 ERROR Timeout on request
2024-01-15 10:25:05 INFO Request completed
EOF

# Now search:
grep "ERROR" app.log
grep -i "error" app.log         # Try different case
grep -n "ERROR" app.log         # With line numbers
grep -v "ERROR" app.log         # Everything except errors
grep -c "INFO" app.log          # Count INFO messages
grep -A 1 "ERROR" app.log       # Show line after each error
```

**Real-world use case**: `grep -r "api_key" .` to find hardcoded secrets in your codebase.

---

### `find` - Find Files

Search for files by name, type, size, etc.

```bash
find . -name "*.txt"            # Find all .txt files
find . -name "*.txt" -type f    # Only files (not directories)
find . -name "test*"            # Files starting with "test"
find . -iname "readme.md"       # Case-insensitive name
find . -type d -name "src"      # Find directories named "src"
find . -size +10M               # Files larger than 10MB
find . -mtime -7                # Modified in last 7 days
```

**Exercise 2.7**:
```bash
cd ~/workshop-practice

# Create some test files
mkdir -p test1 test2 backup
touch test1/notes.txt test2/data.txt backup/old.txt
touch README.md readme.txt

# Now find:
find . -name "*.txt"
find . -iname "readme*"
find . -type d
find . -name "*test*"
```

**Combining find + grep**:
```bash
find . -name "*.py" -exec grep "TODO" {} \;
# Translation: Find all .py files and search for "TODO" in them
```

---

## The Power of Pipes (`|`)

Pipes connect commands. The output of one becomes the input of the next.

```bash
command1 | command2 | command3
```

**Example workflows**:

```bash
# Count how many .txt files exist
find . -name "*.txt" | wc -l

# Find the 5 largest files
ls -lh | sort -k5 -h | tail -5

# Search logs and count errors
cat app.log | grep "ERROR" | wc -l

# Get unique error messages
grep "ERROR" app.log | cut -d' ' -f5- | sort | uniq
```

**Exercise 2.8**:
```bash
cd ~/workshop-practice

# How many lines in numbers.txt contain "5"?
grep "5" numbers.txt | wc -l

# Show me just the ERROR lines from app.log, sorted
grep "ERROR" app.log | sort

# Find all .txt files and show their line counts
find . -name "*.txt" -exec wc -l {} \;
```

---

## Redirection

### Output Redirection

```bash
command > file.txt      # Overwrite file
command >> file.txt     # Append to file
command 2> error.log    # Redirect errors only
command &> all.log      # Redirect stdout AND stderr
```

**Exercise 2.9**:
```bash
cd ~/workshop-practice

# Create a file
echo "First line" > output.txt
cat output.txt

# Append to it
echo "Second line" >> output.txt
cat output.txt

# Redirect command output
ls -la > directory_listing.txt
cat directory_listing.txt
```

### Input Redirection

```bash
command < input.txt     # Use file as input
wc -l < file.txt        # Count lines from file
```

---

## Advanced Text Processing

### `sort` - Sort Lines

```bash
sort file.txt               # Alphabetical sort
sort -r file.txt            # Reverse sort
sort -n file.txt            # Numerical sort
sort -u file.txt            # Unique (remove duplicates)
sort -k2 file.txt           # Sort by 2nd column
```

**Exercise 2.10**:
```bash
cat > fruits.txt << EOF
banana
apple
cherry
apple
banana
EOF

sort fruits.txt
sort -u fruits.txt          # Remove duplicates
sort -r fruits.txt          # Reverse
```

---

### `uniq` - Remove Duplicates

**Note**: File must be sorted first!

```bash
sort file.txt | uniq        # Remove duplicates
sort file.txt | uniq -c     # Count occurrences
sort file.txt | uniq -d     # Show only duplicates
```

**Exercise 2.11**:
```bash
sort fruits.txt | uniq
sort fruits.txt | uniq -c
```

---

### `cut` - Extract Columns

```bash
cut -d' ' -f1 file.txt      # Extract 1st field (space delimiter)
cut -d',' -f2,3 file.txt    # Extract 2nd and 3rd fields (CSV)
cut -c1-10 file.txt         # Extract characters 1-10
```

**Exercise 2.12**:
```bash
cat > data.csv << EOF
John,25,Engineer
Jane,30,Designer
Bob,28,Developer
EOF

cut -d',' -f1 data.csv          # Just names
cut -d',' -f2,3 data.csv        # Age and job
```

---

### `tr` - Translate Characters

```bash
tr 'a-z' 'A-Z'              # Lowercase to uppercase
tr -d ' '                   # Delete spaces
tr -s ' '                   # Squeeze repeated spaces
```

**Exercise 2.13**:
```bash
echo "hello world" | tr 'a-z' 'A-Z'
echo "hello    world" | tr -s ' '
echo "hello world 123" | tr -d '0-9'
```

---

## Capstone Exercise 1: Log Analysis

You have a web server log. Extract useful information!

**Setup**:
```bash
cd ~/workshop-practice
cat > server.log << EOF
192.168.1.1 - - [15/Jan/2024:10:15:23] "GET /home HTTP/1.1" 200 1234
192.168.1.2 - - [15/Jan/2024:10:15:45] "GET /api/users HTTP/1.1" 404 567
192.168.1.1 - - [15/Jan/2024:10:16:12] "POST /login HTTP/1.1" 200 890
192.168.1.3 - - [15/Jan/2024:10:16:34] "GET /home HTTP/1.1" 200 1234
192.168.1.2 - - [15/Jan/2024:10:17:01] "GET /api/posts HTTP/1.1" 500 234
192.168.1.4 - - [15/Jan/2024:10:17:23] "GET /about HTTP/1.1" 200 678
192.168.1.1 - - [15/Jan/2024:10:18:45] "GET /api/users HTTP/1.1" 404 567
EOF
```

**Your Tasks**:
1. How many requests returned 404?
2. Which IP addresses made requests?
3. How many unique IP addresses?
4. Show only the successful requests (status 200)
5. What are the unique URLs requested?

<details>
<summary>Click to reveal solutions</summary>

```bash
# 1. Count 404 errors
grep "404" server.log | wc -l

# 2. Extract all IP addresses
cut -d' ' -f1 server.log

# 3. Count unique IPs
cut -d' ' -f1 server.log | sort | uniq | wc -l

# 4. Show successful requests
grep "200" server.log

# 5. Extract unique URLs
grep -o '"GET [^"]*' server.log | cut -d' ' -f2 | sort | uniq

# Bonus: Which IP made the most requests?
cut -d' ' -f1 server.log | sort | uniq -c | sort -rn | head -1
```

</details>

---

## Capstone Exercise 2: Code Analysis

Find all TODO comments in a project and create a report.

**Setup**:
```bash
cd ~/workshop-practice
mkdir -p project/{src,tests,docs}

cat > project/src/app.py << EOF
def main():
    # TODO: Add error handling
    print("Hello")
    # FIXME: This is slow
    return True
EOF

cat > project/src/utils.py << EOF
# TODO: Document this function
def helper():
    pass
EOF

cat > project/tests/test_app.py << EOF
# TODO: Add more test cases
def test_main():
    assert True
EOF
```

**Your Tasks**:
1. Find all files containing "TODO"
2. Count total number of TODO comments
3. Create a `todos.txt` file with all TODO lines and their file names
4. Which file has the most TODOs?

<details>
<summary>Click to reveal solutions</summary>

```bash
# 1. Find files with TODO
grep -r "TODO" project/

# 2. Count TODOs
grep -r "TODO" project/ | wc -l

# 3. Create report with filenames
grep -rn "TODO" project/ > todos.txt
cat todos.txt

# 4. File with most TODOs
grep -r "TODO" project/ | cut -d':' -f1 | sort | uniq -c | sort -rn | head -1

# Bonus: Pretty format
grep -rn "TODO" project/ | sed 's/:/ (line /' | sed 's/:/) /'
```

</details>

---

## Quick Reference Card

```bash
# View Files
cat file.txt            # Dump entire file
less file.txt           # Page through file
head -20 file.txt       # First 20 lines
tail -20 file.txt       # Last 20 lines
tail -f log.txt         # Follow live updates

# Search
grep "pattern" file     # Find matching lines
grep -i "pattern" file  # Case-insensitive
grep -r "pattern" .     # Recursive search
grep -n "pattern" file  # Show line numbers
find . -name "*.txt"    # Find files by name

# Process Text
wc -l file.txt          # Count lines
sort file.txt           # Sort lines
uniq file.txt           # Remove duplicates
cut -d',' -f1 file.txt  # Extract column
tr 'a-z' 'A-Z'          # Transform characters

# Pipes & Redirection
cmd1 | cmd2             # Pipe output
cmd > file              # Write to file
cmd >> file             # Append to file
cmd < file              # Input from file
```

---

## Next Part

**Continue to Part 3:** [Permissions & Processes - System Control](/blog/linux-workshop/03-permissions-processes)

## Previous Part

**Back to Part 1:** [Getting Started - Your First Commands](/blog/linux-workshop/01-getting-started)
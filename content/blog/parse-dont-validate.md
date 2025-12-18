+++
title = "Parse, Don't Validate: Type Driven Development"
date = 2025-12-17
description = "Why you should parse instead of validating"

[taxonomies]
tags = ["type safety", "rust", "tdd"]

[extra]
featured = true
giscus = true
social_media_card = "images/blue_flowers.jpg"
+++

> *"Our belief is often strongest when it should be weakest. That is the nature of hope." -- Brandon Sanderson; Mistborn*

![banner](/images/blue_flowers.jpg)

...

Recently while reading a very good book on rust, [Zero to Production in Rust](https://www.zero2prod.com/index.html) by Luca Pamieri (highly recommended if you want to learn best programming principles for production level projects), I came across a very interesting software design principle - **"Parse, don't Validate".**

## What exactly is "Parse, don't Validate"?

To understand this design principle let's first go over how "validation" of certain data would work. Let's say we are building a RESTful API which takes a user's email as input and saves the data in our database, we would obviously need to set some checks (or "validation" steps) while taking the input, we wouldn't want invalid/trash data pilling up in our database.

Before validating if an email is valid or not, we ourselves need to understand what defines a valid email. [RFC5322](https://datatracker.ietf.org/doc/html/rfc5322) and [RFC6854](https://datatracker.ietf.org/doc/html/rfc6854) define an expected structure for an email, we could read the material and try to come up with a function to run the checks, but it simply not worth it.
Luckily for us rustaceans the [validator](https://crates.io/crates/validator) crate provides validation functions for emails, urls, etc. We can use that in our API!

The logic would look something like this:

```rust
use validator::ValidateEmail;

/// `add_user` takes a email `String` as input,
/// Validates the email, and calls `insert_email_to_db` if valid.
fn add_user(email: String) -> Result<(), String> {
    // email validation logic.
    if !ValidateEmail::validate_email(&email) {
        return Err("invalid email".to_string());
    }

    insert_email_to_db(email);
    println!("user added to db.");
    Ok(())
}

/// `insert_email_to_db` takes a email `String` as input
/// and inserts it into the db.
fn insert_email_to_db(email: String) {
    // database business logic.
}
```

### The Problem

This function to add the email to the database looks fine; we take a email: `String` as input, run the validation function and add the email to the database. In case of an error, we return an error string.

But there is a major pitfall we might encounter with this approach! Can `insert_email_to_db` safely assume that the email being passed into it as an argument is valid? It cannot, email is a primitive type (i.e., a `String`) and in the example above relies on the `valid_email` check to make sure the email is in fact valid.

In a small codebase this is not such a big problem, but as the codebase grows, we might end up missing the validation step at some point and invalid data will silently pile up in the database. Other parts of our program cannot reuse it effectively - they are forced to perform another point-in-time check leading to a crowded codebase with noisy input checks at every step.

There is another problem: Once the `validate_email` check passes and we add the email to our database, we would continue using the email as a primitive type (i.e., a `String`). If we pass the invariant to another function, say `send_email(email: String)`, the function would have no idea if the email is valid or not.

We have to choices here:

- Ignore and trust blindly: Risky as we might process invalid data.
- Validate again: run the `validate_email` check again, which is redundant and adds unnecessary noise to the codebase.

### The solution: "Parse, don't validate"

We finally get to our point: "Parse, don't validate". In very simple terms - Instead of passing around primitive types for our data and validating them again and again, we create our own custom `Types`, say in our case `UserEmail`, and we **parse** the data into the new Type.

The core idea here is - once an instance of `UserEmail` has been created, it is by definition **impossible** for it to be invalid. Instead of cluttering our codebase with validation logic everywhere, we define clear types that guarantee correctness by leveraging Rust's type system.

The new logic would look something like this:

```rust
use validator::ValidateEmail;

#[derive(Debug)]
struct UserEmail(String);

impl UserEmail {
    /// `parse` takes an email `String` as input,
    /// consumes the `String` and returns an `UserEmail` instance
    /// if `validate_email` check passes.
    pub fn parse(s: String) -> Result<Self, String> {
        if ValidateEmail::validate_email(&s) {
            Ok(Self(s))
        } else {
            Err("invalid email".to_string())
        }
    }
}

/// `add_user` takes an `UserEmail` instance
fn add_user(email: UserEmail) {
    insert_email_to_db(&email);
    println!("user added to db.");
}

fn insert_email_to_db(email: &UserEmail) {
    // database business logic.
}
```

In the above example, `UserEmail::parse` is the only way to get an instance of `UserEmail`, and by definition of the type an instance of `UserEmail` can only exist if the `valid_email` check passes. We also update our function signatures to take our custom types as input (i.e., `UserEmail`) instead of passing primitive types like `String`. This is called the "[new-type pattern](https://doc.rust-lang.org/rust-by-example/generics/new_types.html)" in the rust community.

#### What are all the benefits you get from using this approach?

- **Validate once, enjoy the safety of Types everywhere:** No need to validate the data constantly.
- **Let the compiler worry about the errors:** The compiler prevents you from passing invaliding data.
- **Cleaner Code:** Domain concepts are explicitly represented in Types, and no code is duplicated since we are not validating the code at every turn anymore!

Additionally, we can implement the `AsRef` trait for our type `UserEmail` to get the inner value where we actually need to use the email:

```rust
/// `AsRef` trait to get a reference to the inner value of `UserEmail`
impl AsRef<str> for UserEmail {
    fn as_ref(&self) -> &str {
        &self.0
    }
}
```

This returns a reference string slice containing the actual email address. Yay rust type system and traits!

Things to cover:

- [X] what does it actually mean
- [X] show examples with rust
- [X] why it is good
- [X] validating and parsing "emails", reference RFCs
- [X] difference between validating and parsing
- [ ] reality check
- [ ] Still have to validate!
- [ ] error handling gets complex
- [ ] keep an open approach

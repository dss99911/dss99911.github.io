---
layout: post
title: "Regular Expressions - Groups, Lookahead, and Patterns"
date: 2025-12-28 03:02:00 +0900
categories: [programming, common]
tags: [regex, regular-expression]
image: /assets/images/posts/thumbnails/2025-12-28-regular-expressions.png
---

# Regular Expression Groups

## Group Count

`groupCount` returns the number of groups in the pattern.

## Accessing Groups

- If there is one group, count is 1
- To get the value, use `group(1)`
- `group(0)` returns the entire matched value

## Example
```java
Pattern pattern = Pattern.compile("(\\d+)-(\\w+)");
Matcher matcher = pattern.matcher("123-abc");
if (matcher.find()) {
    matcher.group(0);  // "123-abc" (entire match)
    matcher.group(1);  // "123" (first group)
    matcher.group(2);  // "abc" (second group)
}
```

---

# Lookahead and Lookbehind

## Types

| Syntax | Name | Description |
|--------|------|-------------|
| `(?<!` | Negative Lookbehind | Asserts that what precedes does NOT match |
| `(?<=` | Positive Lookbehind | Asserts that what precedes DOES match |
| `(?!` | Negative Lookahead | Asserts that what follows does NOT match |
| `(?=` | Positive Lookahead | Asserts that what follows DOES match |

## Examples

```regex
(?<=@)\w+      # Match word after @
\w+(?=@)       # Match word before @
(?<!un)happy   # Match "happy" not preceded by "un"
happy(?!ness)  # Match "happy" not followed by "ness"
```

---

# Backreferences (Repeat Groups)

Use `\2` to reuse the second captured group.

## Example
```regex
(\w+)\s+\1     # Match repeated words like "the the"
```

This matches a word, followed by whitespace, followed by the same word.

---

# Password Validation Pattern

## Complex Password Rule

```regex
^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*[^\u0000-\u007F])(?!.*\s).{8,50}$
```

### Requirements
- Contains at least one digit (`(?=.*\d)`)
- Contains at least one lowercase letter (`(?=.*[a-z])`)
- Contains at least one uppercase letter (`(?=.*[A-Z])`)
- Contains at least one special character (`(?=.*\W)`)
- No Unicode characters allowed (`(?!.*[^\u0000-\u007F])`)
- No whitespace allowed (`(?!.*\s)`)
- Length between 8 and 50 characters (`.{8,50}`)

## Breakdown

| Part | Meaning |
|------|---------|
| `^` | Start of string |
| `(?=.*\d)` | Must contain digit |
| `(?=.*[a-z])` | Must contain lowercase |
| `(?=.*[A-Z])` | Must contain uppercase |
| `(?=.*\W)` | Must contain special char |
| `(?!.*[^\u0000-\u007F])` | No non-ASCII chars |
| `(?!.*\s)` | No whitespace |
| `.{8,50}` | 8 to 50 characters |
| `$` | End of string |

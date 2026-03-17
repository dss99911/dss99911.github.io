---
layout: post
title: "Regular Expressions - Groups, Lookahead, and Patterns"
date: 2025-06-02 15:31:00 +0900
categories: [programming, common]
tags: [regex, regular-expression]
image: /assets/images/posts/thumbnails/2025-12-28-regular-expressions.png
redirect_from:
  - "/programming/common/2025/12/28/regular-expressions.html"
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

---

# Common Regex Patterns

Here is a collection of frequently used regex patterns for everyday development tasks:

## Email Validation
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```
Matches standard email addresses. Note that fully RFC-compliant email validation is extremely complex; this pattern covers the vast majority of real-world addresses.

## URL Matching
```regex
https?://[^\s/$.?#].[^\s]*
```
Matches HTTP and HTTPS URLs. Handles most common URL formats.

## Phone Number (Various Formats)
```regex
\+?[\d\s\-().]{7,15}
```
A flexible pattern that matches phone numbers in multiple formats: `+1-234-567-8900`, `(234) 567-8900`, `234.567.8900`, etc.

## IP Address (IPv4)
```regex
\b(?:\d{1,3}\.){3}\d{1,3}\b
```
Matches IPv4 addresses like `192.168.1.1`. Note that this does not validate the range (0-255) of each octet.

## Date (YYYY-MM-DD)
```regex
\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])
```
Matches dates in ISO 8601 format.

---

# Regex Character Classes

| Class | Meaning | Equivalent |
|-------|---------|------------|
| `\d` | Any digit | `[0-9]` |
| `\D` | Any non-digit | `[^0-9]` |
| `\w` | Word character | `[a-zA-Z0-9_]` |
| `\W` | Non-word character | `[^a-zA-Z0-9_]` |
| `\s` | Whitespace | `[ \t\n\r\f]` |
| `\S` | Non-whitespace | `[^ \t\n\r\f]` |
| `.` | Any character (except newline) | |

---

# Quantifiers

| Quantifier | Meaning | Example |
|-----------|---------|---------|
| `*` | 0 or more | `a*` matches "", "a", "aa" |
| `+` | 1 or more | `a+` matches "a", "aa" but not "" |
| `?` | 0 or 1 | `a?` matches "" or "a" |
| `{n}` | Exactly n | `a{3}` matches "aaa" |
| `{n,}` | n or more | `a{2,}` matches "aa", "aaa", etc. |
| `{n,m}` | Between n and m | `a{2,4}` matches "aa", "aaa", "aaaa" |

### Greedy vs Lazy

By default, quantifiers are greedy (match as much as possible). Add `?` after a quantifier to make it lazy (match as little as possible):

```regex
<.*>    # Greedy: matches "<div>content</div>" as one match
<.*?>   # Lazy: matches "<div>" and "</div>" separately
```

---

# Regex Performance Tips

1. **Be specific**: `[a-z]+` is faster than `.+` because the engine has fewer choices at each step.
2. **Avoid catastrophic backtracking**: Patterns like `(a+)+b` can cause exponential backtracking on strings like "aaaaaaaaac". Use atomic groups or possessive quantifiers when available.
3. **Anchor when possible**: Using `^` and `$` tells the engine where to start and stop, reducing unnecessary matching attempts.
4. **Use non-capturing groups**: `(?:...)` instead of `(...)` when you do not need to capture the group content. This saves memory and processing time.
5. **Test with realistic data**: A regex that works on small inputs may be slow on large inputs. Always test with production-like data sizes.

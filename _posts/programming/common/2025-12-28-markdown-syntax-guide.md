---
layout: post
title: "Markdown Syntax Complete Guide"
date: 2025-12-28 03:03:00 +0900
categories: [programming, common]
tags: [markdown]
image: /assets/images/posts/thumbnails/2025-12-28-markdown-syntax-guide.png
---

# Markdown Syntax Guide

## Reference
- [JetBrains Markdown Syntax](https://www.jetbrains.com/help/upsource/markdown-syntax.html)

---

# Headers

Use `#` symbols for headers. More `#` symbols mean smaller headers.

```markdown
# Header one
## Header two
### Header three
#### Header four
##### Header five
###### Header six
```

---

# Text Styling

## Italic
```markdown
_italic_
```
Result: _italic_

## Bold
```markdown
**bold**
```
Result: **bold**

## Bold and Italic
```markdown
**_bold and italic_**
```
Result: **_bold and italic_**

---

# Paragraphs

Add two spaces at the end of a line to create a line break.

Without two spaces, a single line break in markdown will not create a visible line break. Two line breaks will create a paragraph break.

---

# Block Quotes

Add `>` at the beginning of the line.

```markdown
> "Her eyes had called him and his soul had leaped at the call."
```

Result:
> "Her eyes had called him and his soul had leaped at the call."

---

# Code

## Inline Code
Use single backticks for inline code.

## Code Blocks
Wrap code with triple backticks:

````markdown
```
print.out("abc")
```
````

Result:
```
print.out("abc")
```

You can also specify the language for syntax highlighting:
````markdown
```python
print("Hello World")
```
````

---

# Links

## Basic Link
```markdown
[Search for it.](www.google.com)
```
Result: [Search for it.](http://www.google.com/)

## Reference Link
Extract links as variables for reuse:

```markdown
Do you want to [see something fun][a fun place]?

Well, do I have [the website for you][another fun place]!

[a fun place]: www.zombo.com
[another fun place]: www.stumbleupon.com
```

---

# Images

## Basic Image
```markdown
![alt text](http://octodex.github.com/images/octdrey-catburn.jpg)
```

## Reference Image
```markdown
![the first father][First Father]
![The second first father][Second Father]

[First Father]: http://octodex.github.com/images/founding-father.jpg
[Second Father]: http://octodex.github.com/images/foundingfather_v2.png
```

---

# Lists

## Unordered List
Use `*` or `-`:

```markdown
* Calculus
  * A professor
  * Has no hair
  * Often wears green
* Castafiore
  * An opera singer
  * Has white hair
```

Result:
- Calculus
  - A professor
  - Has no hair
  - Often wears green
- Castafiore
  - An opera singer
  - Has white hair

## Ordered List

```markdown
1. Cut the cheese
2. Slice the tomatoes
3. Rub the tomatoes in flour
```

Result:
1. Cut the cheese
2. Slice the tomatoes
3. Rub the tomatoes in flour

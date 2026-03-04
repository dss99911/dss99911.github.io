---
layout: post
title: "UML Diagrams - Types and Relationships"
date: 2025-12-28 03:04:00 +0900
categories: [programming, common]
tags: [uml, design]
image: /assets/images/posts/thumbnails/2025-12-28-uml-diagrams.png
---

# UML (Unified Modeling Language)

## Common Diagram Types

### Sequence Diagram
Shows the interaction between objects over time. Useful for visualizing the order of messages exchanged.

### Activity Diagram
Represents workflows and processes. Shows the flow from one activity to another.

### Class Diagram
Shows the static structure of a system by displaying classes, their attributes, methods, and relationships.

---

# UML Relationships

## Inheritance
Represented by a line with a hollow triangle pointing to the parent class.

## Aggregation
- External creation and usage
- The contained object can exist independently of the container
- Represented by a line with a hollow diamond at the container end

```
Container <>---- Part
```

## Composition
- Internal creation
- Same lifecycle as the container
- The contained object cannot exist without the container
- Represented by a line with a filled diamond at the container end

```
Container <*>---- Part
```

---

# Key Differences

| Relationship | Lifecycle | Creation | Symbol |
|--------------|-----------|----------|--------|
| Aggregation | Independent | External | Hollow diamond |
| Composition | Dependent | Internal | Filled diamond |

---

# References

- [UML for E-commerce (University of Toronto)](http://www.cs.toronto.edu/~matz/instruct/csc407/lectures/uml_for_e-commerce.pdf)
- [UML Basics and Relationship Notation](http://geniusduck.tistory.com/entry/UML-기본편-기본-표기-형식-및-관계표현법)

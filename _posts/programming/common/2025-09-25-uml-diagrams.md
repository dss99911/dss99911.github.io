---
layout: post
title: "UML Diagrams - Types and Relationships"
date: 2025-09-25 19:24:00 +0900
categories: [programming, common]
tags: [uml, design]
image: /assets/images/posts/thumbnails/2025-12-28-uml-diagrams.png
redirect_from:
  - "/programming/common/2025/12/28/uml-diagrams.html"
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

---

# Additional UML Diagram Types

## Use Case Diagram

Use case diagrams capture the functional requirements of a system. They show **actors** (users or external systems) and the **use cases** (actions) they can perform. This is often the first diagram created during the requirements phase.

Key elements:
- **Actor**: A stick figure representing a user role or external system
- **Use Case**: An oval representing a specific action or behavior
- **System Boundary**: A rectangle enclosing all use cases of the system
- **Relationships**: Include (mandatory sub-behavior), Extend (optional behavior), and Generalization

## State Diagram

State diagrams model the different states of an object throughout its lifecycle and the events that trigger transitions between states. They are particularly useful for objects with complex behavior, such as an order in an e-commerce system that transitions through states like `Created → Paid → Shipped → Delivered → Completed`.

## Component Diagram

Component diagrams show the organization and dependencies among software components. They provide a high-level view of the system architecture and help visualize how components like services, libraries, and modules relate to each other.

## Deployment Diagram

Deployment diagrams illustrate the physical deployment of software artifacts on hardware nodes. They are valuable for showing the infrastructure layout — which services run on which servers, how they communicate, and what protocols they use.

---

# UML Relationships (Extended)

## Association

A basic structural relationship that indicates objects of one class are connected to objects of another class. It is represented by a solid line between two classes.

```
Customer ——————— Order
```

An association can have **multiplicity** annotations:
- `1` — exactly one
- `0..1` — zero or one
- `*` or `0..*` — zero or more
- `1..*` — one or more

## Dependency

A weaker relationship indicating that one class uses another temporarily, such as a method parameter or local variable. It is represented by a dashed arrow.

```
Controller - - - -> Service
```

## Realization

Represents the relationship between an interface and a class that implements it. It is shown as a dashed line with a hollow triangle arrowhead.

---

# Practical Tips for UML

## When to Use UML

UML diagrams are most valuable in the following situations:

1. **Communicating architecture** to new team members during onboarding
2. **Designing complex features** before implementation to align the team
3. **Documenting APIs and service interactions** in microservice architectures
4. **Reviewing designs** in pull requests or design reviews

## When Not to Over-Use UML

- For simple CRUD operations, UML can be overkill
- Keep diagrams up to date; outdated diagrams are worse than no diagrams
- Use diagrams as communication tools, not as strict blueprints

## Modern Alternatives

While traditional UML tools (Enterprise Architect, Visual Paradigm) still exist, many teams now prefer lightweight alternatives:

- **Mermaid**: Text-based diagrams that can be embedded in Markdown
- **PlantUML**: Another text-based diagramming tool with wide IDE support
- **draw.io (diagrams.net)**: Free web-based diagramming tool
- **Lucidchart**: Collaborative cloud-based diagramming

These tools allow diagrams to live alongside code in version control, making them easier to maintain and review.

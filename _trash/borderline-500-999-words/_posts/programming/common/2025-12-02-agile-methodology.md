---
layout: post
title: "Agile Methodology - Development Approaches"
date: 2025-12-02 13:44:00 +0900
categories: [programming, common]
tags: [development-methodology, agile]
image: /assets/images/posts/thumbnails/2025-12-28-agile-methodology.png
redirect_from:
  - "/programming/common/2025/12/28/agile-methodology.html"
---

# Agile Methodology

## Definition

A methodology that finds a compromise between development without planning and development with too much planning.

**Agile** = Quick, creating good things quickly and without waste = Maximum efficiency

## Difference from Waterfall and Spiral Models

- Less document-oriented
- Code-oriented

Unlike past methodologies driven by planning, Agile is an **adaptive style** that continuously creates prototypes at **regular intervals** to reflect **changing requirements**.

This adaptability is achieved through object-oriented principles.

---

# Types of Agile (Can be combined)

## 1. Extreme Programming (XP)

### Core Practice: TDD (Test-Driven Development)

### Implementation Methods
- Set plans and create prototypes every 2 weeks
- Periodically confirm with clients or users if going in the right direction
- Simple coding: Follows the KISS principle
- Test before coding
- Pair Programming: One person codes, one does QA, or code together then test

---

## 2. Scrum

- Centered on **Sprint**: Provide working product every 30 days

---

## 3. Crystal Family

- Provides various methodologies based on project size and impact
- **Crystal Clear**: Methodology for the smallest teams

---

## 4. Feature-Driven Development (FDD)

- Closely related to UML-based design techniques
- Iterative development every 2 weeks per feature

---

## 5. Adaptive Software Development

- Development methodology where users or customers participate in design
- Defines software development as chaos itself
- Proposes software development methods that can adapt to chaos

---

## 6. Extreme Modeling

- Modeling-centered methodology using UML
- Continuously create models that can be executed and verified
- Ultimately, automatically generate products from models

---

# Agile Ceremonies

Agile teams follow a set of recurring meetings (ceremonies) that keep the team aligned and productive:

## Daily Stand-up (Daily Scrum)

A short meeting (usually 15 minutes or less) where each team member answers three questions:
1. What did I do yesterday?
2. What will I do today?
3. Are there any blockers?

The goal is to synchronize the team, not to have detailed technical discussions.

## Sprint Planning

At the beginning of each sprint, the team selects work items from the backlog to commit to for the sprint. The team estimates effort using story points or time estimates and discusses the approach for each item.

## Sprint Review (Demo)

At the end of the sprint, the team demonstrates completed work to stakeholders. This provides an opportunity for feedback and helps ensure the product is moving in the right direction.

## Sprint Retrospective

After the review, the team reflects on the sprint process. The focus is on:
- **What went well?** — Practices to continue
- **What didn't go well?** — Problems to address
- **What can we improve?** — Actionable changes for the next sprint

---

# Agile Estimation

## Story Points

Story points measure the relative effort of a task, not the time it takes. A common approach is the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21), where larger numbers indicate higher complexity and uncertainty.

## Planning Poker

A consensus-based estimation technique where each team member independently selects a story point card, and all cards are revealed simultaneously. If estimates differ significantly, the team discusses the reasons and re-estimates.

---

# Agile vs Waterfall: When to Choose What

| Aspect | Agile | Waterfall |
|--------|-------|-----------|
| **Requirements** | Evolving, unclear | Well-defined, stable |
| **Delivery** | Incremental, frequent | Single delivery at end |
| **Feedback** | Continuous | Limited to milestones |
| **Change** | Welcomed | Resisted |
| **Documentation** | Minimal, living | Comprehensive, upfront |
| **Team size** | Small, cross-functional | Can be large, specialized |

Agile is ideal for projects where requirements are expected to change, rapid feedback is available, and the team is experienced with iterative development. Waterfall may still be appropriate for projects with fixed requirements, regulatory constraints, or contractual obligations that demand detailed upfront planning.

---

# Common Agile Anti-Patterns

- **Sprints without retrospectives**: Skipping retros means the team never improves its process
- **Infinite backlog**: An ever-growing backlog that is never groomed becomes meaningless. Regularly remove items that are no longer relevant
- **Story points as deadlines**: Story points measure complexity, not time. Using them as deadlines defeats their purpose
- **Standup theater**: If stand-ups become status reports to a manager rather than team synchronization, they lose their value
- **No working software**: If a sprint ends without demonstrable working software, something is fundamentally wrong with the process

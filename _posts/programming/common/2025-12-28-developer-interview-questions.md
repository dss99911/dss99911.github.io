---
layout: post
title: "Developer Interview Questions - Android and General Topics"
date: 2025-12-28 03:00:00 +0900
categories: [programming, common]
tags: [interview, android]
---

# Interview Process Structure

## Hiring Process

1. **(HR)** Check if resume has sufficient keywords
2. **(Dev)** Resume review
3. **(HR)** Provide coding test
4. **(HR)** Check if coding test score passes threshold
5. **(Dev)** Review coding test results
6. **(HR)** Schedule interview
7. **(Dev)** Interview and evaluation (prepare questions by difficulty per category)
8. **(HR)** Salary negotiation

## Evaluation Categories

- Android Framework
- Communication & Attitude
- Architecture
- Work Management
- Business Understanding
- Direct Coding Test (if required)

---

# General Interview Questions

## About Previous Experience

- Explain the best previous company you worked for
- Explain your best project and the programmatical structure of what you developed
  - Explain modules and how they communicate with each other using a diagram
- What version control tools like Git did you use?
  - How did you manage versions and commits of many coworkers?
- What is your strongest merit?

## Design Pattern Questions

- What is your favorite design pattern?
- Why do you use the Builder pattern?
- What is the difference between Factory pattern and Builder pattern?

## Git Questions

- When developing two versions simultaneously, how do you handle it?
  - Checkout each branch when working on each
- How do you retrieve a specific version's code later?
  - Use tags

---

# Android Interview Topics

## Architecture

### Design Patterns
- Observer pattern
- MVP
- MVVM
  - Merits and demerits
  - How to manage events processed on Activity side

### Modern Android Components
- **LiveData**
  - LifeCycle awareness
  - LiveData vs ObservableField difference
  - Transformations.map or switchMap
  - Repository concept
- **DataBinding**
  - InverseDataBinding
  - BindingAdapter
- **Kotlin**
  - Coroutine
  - What is the best merit?
  - Difference between apply, let, also, etc.

---

## Debugging

- How do you find bugs when an application doesn't work as expected?

---

## Testing

- How do you develop applications that produce no bugs?
- TDD (Test-Driven Development)
- JUnit
- UI Testing

---

## Performance

### Memory Management
- How to find memory leaks
- How to solve memory leaks

### UI Performance
- When launching an activity with data that takes a long time to load, how do you show the frame UI first and then show the data when loading is complete?
  - Loader
  - AsyncTask
  - Coroutines
- GPU overdraw
  - What is redraw?
  - What are the reasons for overdraw?

---

## Android Framework

### Core Concepts
- Difference between thread and process
- LocalBroadcastReceiver
- JobScheduler, WorkManager
- IntentService
- ContentProvider
- Activity Lifecycle
- Launch modes and Activity stack
- Handler, Looper

### UI Components
- ConstraintLayout advantages
- RecyclerView
  - Different layouts
  - Loading images efficiently
- CoordinatorLayout
- How to manage all different screen dimension sizes

### Data & Storage
- Serializable vs Parcelable difference
- Loader
- DataBinding
- MySQL integration
- HashMap vs SparseArray

### Libraries
- **Retrofit**
  - Understanding and advantages
  - How to utilize
  - Interceptors
- **Dagger**
  - Testing with Dagger

---

## Integration

### Authentication
- Session vs Token
- How to save tokens
- JWT tokens
- SignUp process security

---

## Data Structures

- Remove item from List
  - Consider other threads referring to the list
  - If using iterator, and another thread uses iterator, crash occurs

---

## Issue Solving

- Memory leak (Context issues)
- Garbage Collection
- Debugging techniques
- Testing strategies
- Performance optimization

---

## Work Management

### Git
- Cherry-pick
- Git branch management model
- Tagging

### Project Management
- Agile methodology
- Waterfall methodology

### Documentation
- Draw sequence flow for projects you worked on

---

## Communication

- English fluency
- Code Quality vs Deadline balance
- Strength presentation
- Personal applications or projects

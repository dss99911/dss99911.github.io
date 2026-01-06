---
layout: post
title: "Design Patterns - MVC, MVP, MVVM, and More"
date: 2025-12-28 03:01:00 +0900
categories: [programming, common]
tags: [design-pattern, architecture]
image: /assets/images/posts/thumbnails/2025-12-28-design-patterns.png
---

# Design Patterns Overview

## Builder Pattern

### Features
- Set only required parameters
- Readonly functionality after creation

---

## Factory Pattern

Returns different classes based on parameters.

---

# MVC vs MVP vs MVVM

Model View Presenter (MVP) and Model View ViewModel (MVVM) are the two most commonly used alternatives to replace MVC.

## References
- [Realm Article: MVC, MVP, and MVVM on Android](https://news.realm.io/kr/news/eric-maxwell-mvc-mvp-and-mvvm-on-android/)
- [Google Architecture Samples](https://github.com/googlesamples/android-architecture)

---

# MVP (Model View Presenter)

## Components

### View
- Activity: View Presenter
- Changes UI
- Delivers events without view logic

### Presenter
- Receives events
- Processes business logic
- Calls UI methods
  - Calls UI methods with model only, which supports:
    - Multiple views sharing one presenter
    - One view having multiple presenters

### Model
- Model to use for view

## Characteristics
- **Model**: Business logic
- **View**: View and Activity. View should not call presenter actions, only invoke event methods when events occur
- **Presenter**: Takes view interface as parameter, controls view, receives view events and passes to model - connects view and model
- Each component can be tested separately
- Much code accumulates in the presenter
- Requires complex structure to implement MVP

## Testing MVP

### Presenter Testing
1. Create instance of presenter
2. Implement UI interface
3. Call event methods and check if UI method is correctly called
4. Unit test for methods

### View Testing
1. Dependency injection of test presenter (test presenter should be abstract or interface)
2. Start activity
3. Check test presenter gets UI events
4. Call UI methods from test presenter and check if UI is fine

---

# MVVM (Model View ViewModel)

## Advantages over MVP
- Significantly reduces boilerplate code from MVP
- View and data synchronization
  - View changes automatically reflected in data
  - Data changes automatically reflected in view

---

# UDA (Uni-Directional Architecture)

## Concept
Based on functional programming principles.

```
View(Model(Intent()))
```

Data flows in one direction, making the application state predictable and easier to debug.

## Reference
- [Realm Article: Uni-Directional Architecture on Android](https://news.realm.io/news/eric-maxwell-uni-directional-architecture-android-using-realm/)

---

# Activity-Centric Design Pattern

## Goals

- **Planning = Event + Processing**: Define events and processing as basic planning components, making development flexible to planning changes
- Divide planning flows into sequences of events and processing
- Event order is visible through method order for easy flow understanding
- Manage all exceptional events in one place
- Data is automatically synchronized with view, server, and database for automatic load/save
- Each component has a clear role for dependency injection
- Handle transaction integrity

## Component Responsibilities

### Activity
- Loads and connects sub-elements

### Sub-Elements

1. **Event**: Defines what events occur in the activity. Events can access 'Processing', 'Data', and 'Activity'

2. **Processing**: Uses modules. If activity has complex processing, create separate processing module. Processing gets data from 'Data' element, processes with background modules, and reflects results in data. Depends only on 'Data' element and background modules

3. **Data**: Contains all data needed for activity. Data is automatically synchronized with view, database, and server. Events and processing cannot access this directly. On synchronization failure, events are triggered

## Implementation Tools
- Dagger2 (Dependency Injection)
- Kotlin
- Realm (Data - DB, Data - Server)
- Data Binding (Data - View)

## Testing Components
- **View Test**: Check if view changes work correctly on events

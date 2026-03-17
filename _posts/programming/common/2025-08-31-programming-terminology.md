---
layout: post
title: "Programming Terminology and Paradigms"
date: 2025-08-31 15:23:00 +0900
categories: [programming, common]
tags: [terminology]
image: /assets/images/posts/thumbnails/2025-12-28-programming-terminology.png
redirect_from:
  - "/programming/common/2025/12/28/programming-terminology.html"
---

# Code Style Terminology

## LINQ-style
Chained functional operations on collections:

```kotlin
strings.filter { it.length == 5 }
    .sortedBy { it }
    .map { it.toUpperCase() }
```

## Pure Function
A function whose return value is completely dependent on its arguments/parameters with no side effects.

```kotlin
fun square(n: Int): Int {
    return n * n
}
```

## High-Order Function
Functions that take another function as an argument or return a function as result.

```kotlin
fun highOrderFunc(a: Int, validityCheckFunc: (a: Int) -> Boolean) {
    if (validityCheckFunc(a)) {
        println("a $a is Valid")
    } else {
        println("a $a is Invalid")
    }
}

fun main(args: Array<String>) {
    highOrderFunc(12, { a: Int -> a.isEven() })
    highOrderFunc(19, { a: Int -> a.isEven() })
}
```

---

# Programming Paradigms

## Imperative Programming
**Allows side effects**

- Used in contrast to declarative programming
- Uses statements that change a program's state
- Implements algorithms in explicit steps (control flow)

## Declarative Programming
**Does not state the order in which operations execute**

- Express the logic without describing its control flow
- Many languages attempt to minimize or eliminate side effects
- Describes _what_ the program must accomplish rather than _how_ to accomplish it
- Greatly simplifies writing parallel programs
- Examples: SQL, regular expressions, logic programming, functional programming

## Logic Programming
- Languages include Prolog, Answer Set Programming (ASP), and Datalog
- A set of sentences in logical form, expressing facts and rules about some problem domain
- Rules are written in the form of clauses

## Functional Programming
**Disallows side effects**

- Avoids changing state and mutable data (original values are not modified during processing)
- Output value of a function depends only on the arguments passed (pure functions)
- One form of declarative programming
- Allows dependency distribution

## Reactive Programming
- Like Excel, when a value changes, all referencing values update
- Based on Observable and Observer pattern

---

# IT Terminology

## On-Premise
Operating software solutions on your own servers in your own data center, rather than in a cloud or remote environment.

---

# Concurrency

## Semaphore
A method to limit access to shared resources in a multiprogramming environment.

- Prevents more processes from accessing a resource than it can handle
- If there is only 1 resource, only one thread can process at a time
- Other threads must wait

---

# Financial Terminology

## Portfolio
A collection of assets. In investing, a list of diversified investment assets.

## Loan Terms

| Term | Meaning |
|------|---------|
| Repayment | Returning borrowed money |
| Principal | The original loan amount |
| NPA (Non-Performing Asset) | A loan in default |

---

# Design Patterns and Principles

## SOLID Principles

The SOLID principles are five design principles that help developers create more maintainable and flexible software:

- **S - Single Responsibility Principle**: A class should have only one reason to change. Each class handles one specific responsibility.
- **O - Open/Closed Principle**: Software entities should be open for extension but closed for modification. You can add new behavior without changing existing code.
- **L - Liskov Substitution Principle**: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
- **I - Interface Segregation Principle**: Clients should not be forced to depend on interfaces they do not use. Prefer many specific interfaces over one general-purpose interface.
- **D - Dependency Inversion Principle**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

## DRY (Don't Repeat Yourself)

Every piece of knowledge must have a single, unambiguous representation within a system. Duplicated code leads to maintenance headaches because changes must be applied in multiple places.

## KISS (Keep It Simple, Stupid)

Most systems work best if they are kept simple rather than made complex. Avoid unnecessary complexity in your design and implementation.

## YAGNI (You Aren't Gonna Need It)

Do not add functionality until it is actually needed. Premature feature development wastes time and adds maintenance burden for code that may never be used.

---

# Concurrency Concepts (Extended)

## Mutex (Mutual Exclusion)

A mutex is a locking mechanism that ensures only one thread can access a critical section at a time. Unlike a semaphore with a count of 1, a mutex has ownership — only the thread that locked it can unlock it.

```kotlin
val mutex = Mutex()

suspend fun safeIncrement() {
    mutex.withLock {
        counter++
    }
}
```

## Deadlock

A deadlock occurs when two or more threads are each waiting for the other to release a resource, creating a circular dependency where none of them can proceed.

**Prevention strategies:**
- Always acquire locks in a consistent order
- Use timeout-based lock acquisition
- Avoid holding multiple locks simultaneously when possible

## Race Condition

A race condition occurs when the behavior of a program depends on the relative timing of events, such as the order in which threads are scheduled. This leads to unpredictable results when multiple threads access shared data without proper synchronization.

---

# Software Architecture Terms

## Monolith
A single-tiered software application where the user interface, business logic, and data access are combined into a single program. Simple to develop initially but hard to scale and maintain as the codebase grows.

## Microservice
An architectural style that structures an application as a collection of loosely coupled, independently deployable services. Each service runs its own process and communicates through lightweight protocols like HTTP or messaging queues.

## API Gateway
A server that acts as the single entry point for all client requests in a microservice architecture. It handles request routing, composition, and protocol translation.

## Load Balancer
A device or software that distributes network traffic across multiple servers to ensure no single server bears too much load, improving reliability and availability.

---
layout: post
title: "Programming Terminology and Paradigms"
date: 2025-12-28 03:07:00 +0900
categories: programming
tags: [terminology]
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

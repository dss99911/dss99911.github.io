---
layout: post
title: "Testing Methodology for Software Development"
date: 2025-11-26 12:23:00 +0900
categories: [programming, common]
tags: [development-methodology, testing]
image: /assets/images/posts/thumbnails/2025-12-28-testing-methodology.png
redirect_from:
  - "/programming/common/2025/12/28/testing-methodology.html"
---

# Testing Methodology

## Understanding Testing Needs

1. **Want to call actual API**
   - Implement RestClient for testing if server API works correctly
   - Use mock tokens for testing

2. **Want to test with both mock API and real API**
   - Make mock and real switchable

3. **Want to test each case from the specification**
   - Systematically test all specified scenarios

---

# Client Testing

## API Mock Data
- Create mock data for API responses

## ViewModel Testing
- Verify that values from mock repository are correctly set in LiveData according to each event

## View Testing
- Verify that views display correctly based on LiveData values
- Verify that user actions are correctly passed to ViewModel
- Verify that UI actions are correctly executed based on LiveData values

## Integration Testing
- Simulate user behavior across multiple pages

---

# Testing Best Practices

## Core Principles

- **Tight schedule, no compromise**: Even when difficult, strive for good code
- **Test every small code change**: No change is too small to test
- **Unit test all code**: Comprehensive coverage is essential
- **Learn from bugs**: Discover bugs through testing and avoid repeating mistakes
- **Don't criticize other developers**: No programmer can write bug-free code

---

# Code Review Checklist

Self-review helps remove 90% of problems yourself.

## Don'ts to Check

- Bad coding practices
- Not following standards
- Not keeping performance in mind
- History, Indentation, Comments are not appropriate
- Poor readability
- Open files not closed
- Allocated memory not released
- Too many global variables
- Too much hard coding
- Poor error handling
- No modularity
- Repeated code

---

# Coding Standards

- File naming convention
- Function & module naming convention
- Variable naming convention
- History, indentation, comments
- Readability guidelines
- List of do's and don'ts
- Commit description guidelines

---

# Handover Process

When receiving a project handover:

1. **Use the feature**: Experience it as a user
2. **Review the planning documents**: Understand the requirements
3. **Review the design documents**: Understand the architecture
4. **Review the code**: Understand the implementation

---

# Maintenance and Improvement

1. **Fix inappropriate code** with Lint, SonarQube
2. **Fix crash logs**: Monitor and address crashes
3. **Monitor errors and funnels** with Kibana or similar tools
   - Monitor which steps users fail to pass
4. **Improvement work**: Update existing documents while keeping history
   - Add Jira ticket names in comments for traceability

---

# Testing Pyramid

The testing pyramid is a fundamental concept that guides how many tests of each type you should write:

## Unit Tests (Base — Most Tests)

Unit tests verify individual functions or methods in isolation. They are fast, cheap, and should make up the majority of your test suite.

```python
def test_calculate_discount():
    assert calculate_discount(100, 0.1) == 90.0
    assert calculate_discount(100, 0) == 100.0
    assert calculate_discount(0, 0.5) == 0.0
```

**Best practices:**
- Each test should verify one behavior
- Use descriptive test names that explain the expected behavior
- Keep tests independent — no test should depend on another test's result
- Aim for fast execution (milliseconds per test)

## Integration Tests (Middle — Moderate)

Integration tests verify that different modules or services work together correctly. They test interactions with databases, external APIs, and inter-service communication.

```python
def test_order_creation_updates_inventory():
    product = create_test_product(stock=10)
    create_order(product_id=product.id, quantity=3)
    assert get_product(product.id).stock == 7
```

## End-to-End Tests (Top — Fewest)

E2E tests verify complete user workflows from the UI through the backend. They are slow and expensive to maintain, so write them only for critical paths.

---

# Test-Driven Development (TDD)

TDD follows the Red-Green-Refactor cycle:

1. **Red**: Write a failing test for the feature you want to implement
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up the code while keeping all tests passing

TDD forces you to think about the interface before the implementation, resulting in more testable and modular code. It also provides confidence that your code works as expected from the very beginning.

---

# Common Testing Mistakes

- **Testing implementation details**: Tests should verify behavior, not internal structure. If you refactor code without changing behavior, tests should still pass.
- **Flaky tests**: Tests that sometimes pass and sometimes fail erode team confidence in the test suite. Common causes include timing issues, shared state, and external dependencies.
- **Insufficient edge cases**: Always test boundary conditions, null values, empty collections, and error scenarios — not just the happy path.
- **Ignoring test maintenance**: Tests are code too. Keep them clean, refactor them, and remove obsolete tests that no longer add value.

---

# Mocking and Stubbing

Mocks and stubs are essential tools for isolating units under test from their dependencies.

## When to Use Mocks vs. Stubs

| Tool | Purpose | Example |
|------|---------|---------|
| **Stub** | Provide predetermined responses | A fake API that always returns `{"status": "ok"}` |
| **Mock** | Verify interactions | Verify that `sendEmail()` was called exactly once |
| **Spy** | Wrap real objects, record calls | Call the real method but track how many times it was called |
| **Fake** | Simplified working implementation | In-memory database instead of real DB |

## Python Example with unittest.mock

```python
from unittest.mock import Mock, patch

# Using a mock to verify behavior
def test_order_sends_email():
    email_service = Mock()
    order_service = OrderService(email_service=email_service)

    order_service.place_order(product_id=1, quantity=2)

    email_service.send_confirmation.assert_called_once()

# Using patch to stub an external dependency
@patch('myapp.services.requests.get')
def test_fetch_user_data(mock_get):
    mock_get.return_value.json.return_value = {"name": "Alice"}
    mock_get.return_value.status_code = 200

    result = fetch_user_data(user_id=42)

    assert result["name"] == "Alice"
    mock_get.assert_called_once_with("https://api.example.com/users/42")
```

## Java Example with Mockito

```java
@Test
void shouldSendNotificationOnOrderPlaced() {
    NotificationService notificationService = mock(NotificationService.class);
    OrderService orderService = new OrderService(notificationService);

    orderService.placeOrder(new Order("item-1", 2));

    verify(notificationService, times(1)).sendNotification(any(Order.class));
}

@Test
void shouldReturnCachedValue() {
    CacheService cacheService = mock(CacheService.class);
    when(cacheService.get("key")).thenReturn("cached-value");

    String result = myService.getData("key");

    assertEquals("cached-value", result);
}
```

---

# Test Coverage

## What Coverage Tells You (and What It Doesn't)

Code coverage measures the percentage of your code that is executed during tests. While useful, high coverage does not guarantee quality:

- **100% coverage does not mean bug-free**: You might cover every line but miss edge cases
- **Low coverage is a red flag**: If large portions of code are untested, bugs are more likely to slip through
- **Aim for meaningful coverage**: Focus on critical business logic, not just hitting a number

## Coverage Types

| Type | What It Measures | Value |
|------|-----------------|-------|
| **Line coverage** | Lines of code executed | Basic, most common |
| **Branch coverage** | Decision branches taken | More thorough than line |
| **Function coverage** | Functions called | Quick overview |
| **Condition coverage** | Boolean sub-expressions evaluated | Most thorough |

## Practical Coverage Targets

A reasonable target for most projects:
- **Critical business logic**: 90%+
- **Utility/helper code**: 80%+
- **UI/View layer**: 60-70%
- **Overall project**: 80%+

---

# Continuous Integration Testing

## CI Pipeline Testing Strategy

A well-structured CI pipeline runs tests in stages, from fastest to slowest:

1. **Linting and static analysis** (seconds): Code style, type checking
2. **Unit tests** (seconds to minutes): Fast, isolated tests
3. **Integration tests** (minutes): Database, API interactions
4. **E2E tests** (minutes to hours): Full workflow tests
5. **Performance tests** (optional): Load testing on staging

## Key CI Testing Principles

- **Fast feedback loop**: Run the fastest tests first so developers know quickly if something is broken
- **Fail fast**: If unit tests fail, don't waste time running integration or E2E tests
- **Parallel execution**: Run independent test suites in parallel to reduce total pipeline time
- **Reproducible environments**: Use Docker or similar tools to ensure tests run in consistent environments
- **Test data isolation**: Each test should create and clean up its own data. Never depend on shared test data that other tests might modify.

## Flaky Test Management

Flaky tests undermine team confidence in the test suite. Strategies for handling them:

1. **Quarantine**: Move flaky tests to a separate suite so they don't block the main pipeline
2. **Root cause analysis**: Investigate timing issues, shared state, or external dependencies
3. **Retry with limit**: Allow one automatic retry, but track flaky frequency
4. **Fix or remove**: If a test has been flaky for weeks with no fix, remove it and create a ticket to rewrite it

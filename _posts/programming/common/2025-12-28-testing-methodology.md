---
layout: post
title: "Testing Methodology for Software Development"
date: 2025-12-28 02:02:00 +0900
categories: [programming, common]
tags: [development-methodology, testing]
image: /assets/images/posts/thumbnails/2025-12-28-testing-methodology.png
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

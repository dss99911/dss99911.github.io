---
layout: post
title: "Android Development Process and Tips"
date: 2025-08-26 14:04:00 +0900
categories: [programming, common]
tags: [development-methodology, android]
image: /assets/images/posts/thumbnails/2025-12-28-android-development-process.png
redirect_from:
  - "/programming/common/2025/12/28/android-development-process.html"
---

# Android Development Process

## API Development

1. **Design API request/response** (JSON format)
2. **Design database, POC** (Proof of Concept - verify feasibility)
3. **Define API request/response code**
4. **Write API unit test code**
   - Create mock data from defined JSON
   - Test proper parsing
   - Compare with actual API
5. **Implement API**
6. **Test API**

---

## Database Development

1. **Define Room data model code**
2. **Implement Room unit test code**
3. **Implement Room**
4. **Test Room**

---

## ViewModel Development

1. **Define ViewModel UI data and event method interfaces**
2. **Implement ViewModel unit test code**
   - Use created API response mock data
   - Test business logic
   - Test all cases defined in specifications
3. **Implement ViewModel**
4. **Test ViewModel**

---

## UI Development

1. **Define UI component code** (layout, dialog, fragments)
2. **Implement UI unit test code**
   - Verify UI displays correctly for each case
   - Auto-screenshot for UI inspection per case
3. **Implement UI** (data binding)
4. **Test UI**

---

# Development Tips

## General Tips

- **Create your own TODO comments**: Check for missing parts
- **Use Instant Run**: Speed up development iteration
- **Test with virtual devices**: Consistent testing environment
- **Avoid test device interference**:
  - Avoid devices that ask for permission on every install
  - Ensure stable connection

## UI Layout Tips

- **Set Guideline, Barrier, Group first**
- **Then position UI components** according to these guides

This approach creates more maintainable and adaptable layouts.

---

# Collaboration Workflow

## Development Order
1. API discussion
2. Design discussion
3. Development

## Separation of Concerns

### Design
- Verify images are correctly exported
- Verify layout ranges are appropriate

### Logic
- Business logic implementation

### Server
- Test if API is called correctly
- Write API call tests in app code

### Integration
- End-to-end testing

## Task Division Benefits

- Reduce duplicate work
- Reduce knowledge requirements for each individual
- Clear responsibility boundaries

---

# Code Review Process

Code reviews are essential for maintaining code quality in Android development. Here is a structured approach:

## What to Check During Review

### Architecture and Design
- Does the code follow the established architecture (MVVM, Clean Architecture)?
- Are dependencies flowing in the right direction?
- Is business logic in the ViewModel, not in the Activity/Fragment?

### Code Quality
- Are variable and function names descriptive and following naming conventions?
- Is there any duplicated code that should be extracted?
- Are there any memory leaks (especially with context references)?

### Android-Specific Concerns
- Is the lifecycle handled correctly? (e.g., `onDestroy`, configuration changes)
- Are network calls handled on background threads?
- Is the UI thread not blocked by heavy operations?
- Are permissions requested properly?

---

# Testing Strategy

## Test Pyramid for Android

| Level | Tools | Speed | Scope |
|-------|-------|-------|-------|
| Unit Tests | JUnit, Mockito | Fast | Single function/class |
| Integration Tests | Robolectric | Medium | Multiple components |
| UI Tests | Espresso, Appium | Slow | Full user flows |

### Unit Test Coverage Priorities
1. **ViewModel business logic**: This is where most bugs occur
2. **Repository / data layer**: Verify data transformations
3. **Utility functions**: Helper methods used across the app
4. **Edge cases**: Null values, empty lists, boundary conditions

### Test Naming Convention
Use descriptive test names that explain the scenario:
```kotlin
@Test
fun `when user clicks login with empty password then show error message`() {
    // Arrange
    viewModel.setPassword("")

    // Act
    viewModel.onLoginClicked()

    // Assert
    assertEquals(LoginError.EMPTY_PASSWORD, viewModel.error.value)
}
```

---

# Release Checklist

Before each release, go through this checklist:

- [ ] All automated tests passing
- [ ] Manual regression testing complete
- [ ] ProGuard/R8 rules verified with release build
- [ ] Version name and code updated
- [ ] Release notes prepared
- [ ] Crash reporting (Firebase Crashlytics) verified
- [ ] Performance profiling done for key screens
- [ ] APK/AAB size checked (compare with previous release)
- [ ] Deep links tested
- [ ] Backward compatibility verified (minimum SDK version)

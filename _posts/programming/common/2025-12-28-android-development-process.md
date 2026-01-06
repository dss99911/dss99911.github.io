---
layout: post
title: "Android Development Process and Tips"
date: 2025-12-28 02:04:00 +0900
categories: [programming, common]
tags: [development-methodology, android]
image: /assets/images/posts/thumbnails/2025-12-28-android-development-process.png
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

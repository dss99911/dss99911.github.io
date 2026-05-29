---
layout: post
title: "Software Development Documentation and Workflow"
date: 2025-08-02 11:19:00 +0900
categories: [programming, common]
tags: [development-methodology, documentation]
image: /assets/images/posts/thumbnails/2025-12-28-software-development-documentation.png
redirect_from:
  - "/programming/common/2025/12/28/software-development-documentation.html"
---

# Software Development Documentation

## Core Principles

- A single document cannot contain everything; each document should have a clear purpose
- Documents should be systematically categorized for easy access
- Documentation itself should not become the work; documents should naturally emerge from the work process
- All tasks should be tracked in task management systems like Jira
- All documents and code should have automatic version control

---

# Document Types

## 1. Vision Document
- **Problem**: Understand the current problem to solve
- **Analysis**: Analyze the reasons for the problem
- **Solution**: Describe the solution to the problem
  - Competitors and similar companies
  - Key points of the solution
- **Target Users**: User analysis and needs
- **Direction**: Determine direction based on problems and user needs
- **Roadmap**: Planning for each phase
- **Strengths**: Our competitive advantages
- **Weaknesses**: Our problems and plans to solve them

## 2. Strategy Document
- Concept, key flow, purpose, expected effects
- Business viability, contracts, policies

## 3. Planning Document
- Storyboard
- Detailed planning documents

## 4. Communication Document
- Research
- Design discussions
- Meeting notes (categorized by knowledge, actions, decisions)
- Q&A: Always organize answers to questions for future reference

## 5. Schedule Document
- Requirements analysis
- Gantt chart (Confluence Roadmap Planner, Smartsheet)
- Planning based on time, cost, quality, and risk

## 6. Integration Document
- **Flow (Sequence Diagram)**: Communication between nodes (user, client, server, external server)
- **API Specification**:
  - App - Server API: request-response spec
  - App - SDK API: Call-Callback
  - Server - External Server API: request-response spec
- **Policy Matters**:
  - How to handle save/transmission failures
  - How to check status for payment processing delays
  - How to handle timeout when server succeeds but response is not received

## 7. Development Document
- **Existing Code Analysis**: UI organization, API organization
- **Structure Design**:
  - Modularization (App): Define module roles and communication
  - Microservice (Server): Define service roles
  - Dependency reduction
- **Use Cases**: Use case diagrams, method definitions
- **Logic**: Method breakdown and logic design per module
- **Database**: Table, column, index definitions

## 8. Test Document
- Record parts that need testing during design and development

## 9. Operations Document
- Statistics per panel in Kibana
- Error alerts in monitoring tools
- Important metrics notified to Slack via scheduler

## 10. Maintenance Document
- Development maintenance: UI feature class and method locations
- Crash analysis after release
- Error analysis via monitoring tools

---

# Big Picture Approach

## Essential Components (in order)

1. **Main User Scenarios**: Describe the main usage scenarios
2. **Architecture Description**:
   - Component and relationship description
   - Flow between components for each scenario
3. **Domain Model (Data Model)**

## Process
- Architects from each development team gather to review the big picture
- Disseminate to each team
- Collect feedback and propose to architect meeting
- Update the big picture
- Disseminate to each team

**Documentation is a tool to aid communication. Tools should never become the goal.**

---

# Daily Documentation Habits

- Organize today's tasks in the wiki
- Update documentation while working
- Share important matters at the end of the day
- Review shortcomings in the evening diary

---

# Document Format

## Guide Format
- Prerequisite
- Preparation

## Development Format
- **Overview**: What is being developed
- **Background Knowledge**: Knowledge needed before development
- **Model**:
  - Definition: Term definitions
  - Model: Model definition and explanation
  - Table: Table relationship diagram for the model

---

# Documentation Anti-Patterns

Knowing what not to do is just as important as knowing what to do. Here are common documentation pitfalls:

## 1. Writing Documentation Nobody Reads
If documentation is too long, poorly organized, or out of date, people will ignore it. Keep documents focused and concise. If a document exceeds a few pages, consider splitting it into smaller, linked documents.

## 2. Documenting After the Fact
Documentation written weeks after development is often inaccurate or missing key details. Write documentation as part of the development process, not as a separate task afterward.

## 3. Duplicating Information
When the same information exists in multiple documents, they inevitably become inconsistent. Use a single source of truth for each piece of information and link to it from other documents.

## 4. Over-Documenting Obvious Code
```java
// Bad: Comment explains what the code already says
int count = 0; // Initialize count to zero
```
Instead, document *why* decisions were made, not *what* the code does. Focus on business logic explanations and architectural decisions.

## 5. Not Versioning Documents
Documents should be in version control alongside code. This ensures that documentation matches the code version and changes are trackable.

---

# Recommended Tools

| Category | Tool | Best For |
|----------|------|----------|
| Wiki | Confluence, Notion | Team knowledge base |
| Diagrams | Mermaid, Draw.io, Lucidchart | Architecture and flow diagrams |
| API Docs | Swagger/OpenAPI, Postman | API specification and testing |
| Task Tracking | Jira, Linear, GitHub Issues | Task and issue management |
| Code Docs | JSDoc, Javadoc, Sphinx | Auto-generated code documentation |
| Decision Records | ADR (Architecture Decision Records) | Documenting design decisions |

## Architecture Decision Records (ADR)

ADRs are a lightweight way to document important architectural decisions. Each ADR follows a simple format:

1. **Title**: Short descriptive name
2. **Status**: Proposed, Accepted, Deprecated, Superseded
3. **Context**: What is the situation that requires a decision?
4. **Decision**: What was decided?
5. **Consequences**: What are the results of this decision?

ADRs are especially valuable because they capture the *why* behind decisions, which is information that is lost fastest over time.

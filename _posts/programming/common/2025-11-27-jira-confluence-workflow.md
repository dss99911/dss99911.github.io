---
layout: post
title: "Jira and Confluence Workflow"
date: 2025-11-27 11:19:00 +0900
categories: [programming, common]
tags: [development-methodology, jira, confluence]
image: /assets/images/posts/thumbnails/2025-12-28-jira-confluence-workflow.png
redirect_from:
  - "/programming/common/2025/12/28/jira-confluence-workflow.html"
---

# Jira Task Structure

## Development Workflow

1. **Plan**
2. **Design**
3. **Development Planning**
   - Requirement analysis & discussion
   - Create Jira tickets for development
   - Gantt chart
4. **Integration**
   - Sequence diagram
   - API specification
5. **Analyze previous code**
6. **Design structure**
7. **Create separated Jira tickets for each function**

---

# Confluence Document Structure

## Categories

- **Meeting**: Meeting notes and discussions
- **QnA**: Questions and answers
- **Research**: Research documents
- **Gantt chart**: Timeline and scheduling

## Integration
- Flow diagrams
- API specification

## Development
- Structure documentation

---

# Study and Documentation Habits

## Coding Study
- Record in **GitHub**

## Other Topics
- Record in **blog**
- When trying new services, take screenshots and notes, then organize for blog

## Programming Study Approach

1. **Tutorial/Course** -> Sample code
2. **Official Documentation** -> Sample project
3. **Sample project** -> Common library creation

Good resources should be organized in GitHub readme or GitHub wiki.

## Programming Language Study Approach

1. **Development environment setup**
2. **Syntax understanding** -> Sample project creation
3. **Architecture** -> Document organization and base library creation
4. **Framework** -> Learn frameworks needed for architecture
5. **Sample projects**
6. **Study required technologies**

---

# Documentation Tools

## GitBook
- [https://www.gitbook.com/](https://www.gitbook.com/)

## API Specification Auto-generation
- [Swagger](https://swagger.io/)

## Gantt Chart Tools
- [AUI Project](http://www.auiproject.com/)
- Smartsheet

---

# Jira Best Practices

## Ticket Management

Effective Jira ticket management improves team productivity and traceability. Here are practical tips for managing tickets:

### Writing Good Ticket Descriptions

A well-written Jira ticket should contain:
- **Summary**: A clear, concise title that describes the work
- **Description**: Context about why this work is needed
- **Acceptance Criteria**: Specific conditions that must be met for the ticket to be considered done
- **Technical Notes**: Implementation details or constraints the developer should know

### Ticket Types and Hierarchy

| Type | Purpose | Example |
|------|---------|---------|
| **Epic** | A large body of work spanning multiple sprints | "User Authentication System" |
| **Story** | A user-facing feature or functionality | "As a user, I can reset my password" |
| **Task** | A technical work item | "Set up CI/CD pipeline" |
| **Bug** | A defect that needs fixing | "Login button unresponsive on mobile" |
| **Sub-task** | A smaller piece of work under a story or task | "Implement email validation" |

### Workflow States

A typical development workflow in Jira follows these states:

1. **Backlog** → The ticket is created but not yet planned
2. **To Do** → The ticket is planned for the current sprint
3. **In Progress** → A developer is actively working on it
4. **In Review** → The code is submitted for review
5. **QA** → Quality assurance testing is in progress
6. **Done** → The work is complete and deployed

---

# Confluence Best Practices

## Document Organization

A well-organized Confluence space makes information easy to find:

- **Use a consistent page hierarchy**: Group pages by project, team, or topic
- **Create templates**: Standardize meeting notes, design documents, and post-mortems
- **Use labels**: Tag pages with relevant labels for cross-cutting concerns
- **Archive old content**: Move outdated pages to an archive section rather than deleting them

## Effective Technical Documentation

When writing technical documentation in Confluence:

1. **Start with context**: Explain the problem before the solution
2. **Include diagrams**: Use draw.io or Mermaid macros for architecture and flow diagrams
3. **Keep it updated**: Stale documentation is worse than no documentation — assign owners for key documents
4. **Link to related resources**: Connect Confluence pages to Jira tickets, GitHub PRs, and other relevant materials

## Integration Between Jira and Confluence

One of the most powerful features is the integration between Jira and Confluence:

- Embed Jira filters in Confluence pages to show related tickets
- Link design documents in Confluence directly from Jira tickets
- Use Confluence blueprints to create requirement documents that reference Jira epics
- Create retrospective pages that pull sprint data from Jira automatically

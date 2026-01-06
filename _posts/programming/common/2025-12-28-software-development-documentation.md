---
layout: post
title: "Software Development Documentation and Workflow"
date: 2025-12-28 02:00:00 +0900
categories: [programming, common]
tags: [development-methodology, documentation]
image: /assets/images/posts/thumbnails/2025-12-28-software-development-documentation.png
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

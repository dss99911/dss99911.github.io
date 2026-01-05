---
layout: post
title: "Manage Obsidian Tasks with AI - Tasks MCP Plugin Guide"
date: 2026-01-06 21:00:00 +0900
categories: [tools, obsidian]
description: "Learn how to use the Tasks MCP Plugin to let AI assistants like Claude and ChatGPT directly manage your Obsidian tasks - add, update, complete, and query tasks through natural conversation."
tags: [Obsidian, MCP, AI, Tasks, Claude, Productivity]
---

# Manage Obsidian Tasks with AI - Tasks MCP Plugin

## What is MCP?

**MCP (Model Context Protocol)** is a protocol that allows AI assistants to access external tools and data. Developed by Anthropic, it's used in Claude Desktop, Claude Code, and other AI applications.

With MCP, AI can:
- Access file systems
- Query databases
- Make API calls
- **Integrate with apps like Obsidian**

## What is Tasks MCP Plugin?

[Tasks MCP Plugin](https://github.com/dss99911/obsidian-tasks-mcp) exposes the [Obsidian Tasks plugin](https://publish.obsidian.md/tasks/Introduction) API via an MCP server, allowing AI assistants to directly manage your tasks.

### Key Features

| Feature | Description |
|---------|-------------|
| `add_task` | Add new tasks (to Daily Note or specified file) |
| `query_tasks` | Search tasks using Tasks query syntax |
| `update_task` | Modify tasks (description, dates, priority, etc.) |
| `toggle_task` | Toggle complete/incomplete status |
| `remove_task` | Delete tasks |
| `list_tasks` | List all tasks |

## Installation

### 1. Install Obsidian Tasks Plugin

First, install the **Tasks** plugin from Obsidian Community Plugins.

### 2. Install Tasks MCP Plugin

Search for **Tasks MCP Server** in Community Plugins and install it.

> If not yet available in Community Plugins, download `main.js` and `manifest.json` from [GitHub Releases](https://github.com/dss99911/obsidian-tasks-mcp/releases) and place them in `.obsidian/plugins/tasks-mcp/` folder.

### 3. Configure MCP Client

Add the following to your Claude Desktop or other MCP client configuration:

```json
{
  "mcpServers": {
    "obsidian-tasks": {
      "url": "http://localhost:3789/mcp"
    }
  }
}
```

## Use Cases

### 1. Add Tasks with Natural Language

**Example conversation:**
```
User: "I need to finish the report by tomorrow. High priority."

AI: Calls add_task →
    - [ ] Finish the report ⏫ 📅 2026-01-07
```

The AI parses natural language and adds tasks with appropriate dates and priorities.

### 2. Check Today's Tasks

**Example conversation:**
```
User: "What do I need to do today?"

AI: Calls query_tasks (query: "not done\ndue today")
    → Returns incomplete tasks due today
```

### 3. Manage Project Tasks

**Example conversation:**
```
User: "Show me remaining tasks for #project-x"

AI: Calls query_tasks (query: "not done\ntag includes #project-x")
    → Returns incomplete tasks with that tag
```

### 4. Set Up Recurring Tasks

**Example conversation:**
```
User: "Create a task to prepare for weekly meeting every Monday"

AI: Calls add_task →
    - [ ] Prepare for weekly meeting 🔁 every week on Monday
```

### 5. Complete Tasks

**Example conversation:**
```
User: "I finished the report"

AI: Calls toggle_task →
    - [x] Finish the report ⏫ 📅 2026-01-07 ✅ 2026-01-06
```

The Tasks plugin API automatically adds the completion date.

### 6. Reschedule Tasks

**Example conversation:**
```
User: "Move the report deadline to next week"

AI: Calls update_task (dueDate: "2026-01-13")
    → Updates the due date
```

### 7. Analyze Completed Tasks

**Example conversation:**
```
User: "Summarize what I completed this week"

AI: Calls query_tasks (query: "done")
    → Analyzes and summarizes completed tasks
```

## Tasks Query Syntax

Filters available in `query_tasks`:

```
# Status
not done          # Incomplete
done              # Completed
in progress       # In progress

# Dates
due today         # Due today
due before today  # Overdue
due 2026-01-15    # Due on specific date
has due date      # Has a due date
no due date       # No due date

# Tags
tag includes #work
tag does not include #personal

# Path
path includes Projects
path does not include Archive

# Priority
priority is high
priority is medium

# Recurrence
is recurring
is not recurring

# Combinations (AND/OR/NOT)
not done AND due before today
tag includes #work OR tag includes #urgent
```

## Settings

Configure these options in the plugin settings:

| Setting | Default | Description |
|---------|---------|-------------|
| Server port | 3789 | MCP server port |
| Auto-start server | true | Start server when Obsidian launches |

## Example Workflows

### Morning Routine
```
User: "What's on my plate today?"

AI:
📋 Today's Tasks (2026-01-06):

High Priority:
- [ ] Finish the report ⏫ 📅 2026-01-06

Normal:
- [ ] Check emails 📅 2026-01-06
- [ ] Prepare for meeting 📅 2026-01-06

⚠️ Overdue:
- [ ] Code review 📅 2026-01-05
```

### Evening Review
```
User: "Wrap up today - complete what's done and reschedule the rest"

AI:
✅ Completed:
- [x] Finish the report ✅ 2026-01-06
- [x] Check emails ✅ 2026-01-06

📅 Moved to tomorrow:
- [ ] Prepare for meeting 📅 2026-01-07 (updated)
- [ ] Code review 📅 2026-01-07 (updated)
```

## Troubleshooting

### Server Won't Start
1. Verify Tasks plugin is installed
2. Check if another app is using port 3789
3. Change the port number in settings

### AI Can't Find Tasks
1. Ensure tasks use Tasks plugin format (`- [ ]`)
2. Verify files are markdown files (`.md`)

## Conclusion

With Tasks MCP Plugin, your AI assistant becomes more than a conversation partner - it becomes a true productivity assistant that can manage your tasks directly. Just speak naturally, and the AI handles the formatting and saves everything to Obsidian.

## Links

- [Tasks MCP Plugin GitHub](https://github.com/dss99911/obsidian-tasks-mcp)
- [Obsidian Tasks Plugin](https://publish.obsidian.md/tasks/Introduction)
- [MCP Protocol](https://modelcontextprotocol.io/)

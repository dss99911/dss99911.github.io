---
layout: post
title:  "Essential Obsidian Plugins - My Recommended Setup"
date:   2023-12-06 21:05:37 +0900
categories: [tools, obsidian]
description: "A curated list of essential Obsidian plugins for productivity, task management, and note synchronization. Includes Git sync, task management, templates, and more."
tags: [Obsidian, Plugins, Productivity, Note-taking, Task Management]
image: /assets/images/posts/thumbnails/2023-12-06-obsidian-plugins.png
---

Obsidian's plugin ecosystem is one of its greatest strengths. Here's my curated list of essential plugins that transform Obsidian into a powerful productivity system.

## Synchronization & Version Control

### [Obsidian Git](https://github.com/denolehov/obsidian-git)
**Purpose**: Automatic version control and synchronization via Git

- Automatically commits and pushes changes at set intervals
- Syncs notes between laptop and Git repository
- Maintains full version history of all notes
- For syncing between laptop and Android, see [this post]({% post_url 2023-12-03-Free Synchronization of Obsidian Notes Between Desktop and Android Devices %})

### File Diff
**Purpose**: Compare and merge conflicting files

- Essential when using Syncthing for synchronization
- Handles file collision conflicts that create duplicate files
- Visual diff comparison between file versions

## Task & Time Management

### [Tasks](https://publish.obsidian.md/tasks/Introduction)
**Purpose**: Advanced task management within notes

- Create and track tasks with due dates, priorities, and recurrence
- Query tasks across your entire vault
- Filter by date, status, tags, and more
- Reference: [Tasks due today based on daily note](https://forum.obsidian.md/t/tasks-due-today-based-on-daily-note-not-current-date/54707/2)

### Day Planner
**Purpose**: Time-block planning within notes

- Schedule tasks by specific time slots
- Visual timeline of your day
- Integrates with your daily notes

### Calendar
**Purpose**: Visual calendar navigation

- Navigate to daily notes by date
- Overview of notes with tasks or events
- Simple and clean interface

## Templates & Automation

### Templater
**Purpose**: Advanced templating system

- Create dynamic templates for daily notes, meeting notes, etc.
- Use JavaScript for complex template logic
- Auto-insert dates, file names, and custom content

### Dataview
**Purpose**: Query and display data from notes

- Create dynamic tables and lists from your notes
- Show statistics and summaries
- SQL-like query language for notes

## Code & Development

### Editor Syntax Highlight
**Purpose**: Syntax highlighting for code blocks

- Supports multiple programming languages
- Makes code more readable in notes

### Execute Code
**Purpose**: Run code snippets directly in notes

- Execute Python, JavaScript, and other languages
- Great for documentation with live examples

## Navigation & Organization

### Recent Files
**Purpose**: Quick access to recently opened files

- Shows list of recently accessed notes
- Faster navigation than file explorer

### Remember Cursor Position
**Purpose**: Maintain cursor position across sessions

- Returns to exact position when reopening a note
- Helpful for long documents

### Tag Wrangler
**Purpose**: Manage and refactor tags

- Rename tags across entire vault
- Merge similar tags
- Organize tag hierarchy

### [Tag Navigator](https://github.com/alexobenauer/obsidian-tag-navigator)
**Purpose**: Advanced tag browsing

- Navigate using nested tag hierarchies
- Visual tag exploration

## Theme & Appearance

### Minimal Theme Settings
**Purpose**: Customize the Minimal theme

- Fine-tune colors, fonts, and spacing
- Create a clean, distraction-free writing environment

## Installation Tips

1. Go to **Settings > Community plugins**
2. Disable Safe Mode to allow community plugins
3. Click **Browse** to find and install plugins
4. Enable each plugin after installation
5. Configure plugin settings as needed

## Recommended Setup Order

1. **Obsidian Git** - Set up sync first
2. **Templater** - Create your templates
3. **Tasks** - Configure task management
4. **Dataview** - Set up dashboards
5. **Other plugins** - Add as needed
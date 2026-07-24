# Life Log

[![License](https://img.shields.io/github/license/sahilium/obsidian-life-log?style=flat-square)](LICENSE)
[![Obsidian Version](https://img.shields.io/badge/Obsidian-%3E%3D1.7.2-blueviolet?style=flat-square&logo=obsidian)](https://obsidian.md)
[![Release](https://img.shields.io/github/v/release/sahilium/obsidian-life-log?style=flat-square)](https://github.com/sahilium/obsidian-life-log/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/sahilium/obsidian-life-log/release.yml?style=flat-square&label=build)](https://github.com/sahilium/obsidian-life-log/actions/workflows/release.yml)
[![codecov](https://img.shields.io/codecov/c/github/sahilium/obsidian-life-log?style=flat-square&logo=codecov)](https://codecov.io/gh/sahilium/obsidian-life-log)

A fast, minimal Obsidian plugin for recording life events as Markdown files. Not a journal. Not a habit tracker. A timeline of things that happened to you.

---

## What is Life Log?

Life Log lets you capture atomic life events — trivial and significant — as individual Markdown files with YAML frontmatter. Think of it as a personal Git history of your life.

**Examples:**

- Went for a morning walk
- Finished reading a book
- Had a strange dream last night
- Tried a new recipe
- Found a new favorite song
- Finished a book
- Started a new job

Every event is an independent Markdown file. Everything is portable, future-proof, and Git-friendly.

---

<!-- screenshots coming soon -->

---

## Features

- **Instant capture** — Open the command palette, type, press Enter. Event saved in ~3 seconds.
- **Timeline view** — Year → Month → Day grouping, newest first, in the sidebar.
- **Search** — Case-insensitive instant filtering by title.
- **Today in history** — See what happened on this day in past years.
- **Event types** — Health, Dream, Travel, Career, Purchase, Food, Exercise, Book, Movie, Relationship, Other.
- **Markdown-first** — Every event is a `.md` file with YAML frontmatter. No databases, no lock-in.

---

## Installation

### From GitHub Releases (recommended)

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/sahilium/obsidian-life-log/releases/latest).
2. Create a folder `life-log` inside your vault's `.obsidian/plugins/` directory.
3. Copy the three files into that folder.
4. Enable **Life log** in **Settings → Community plugins**.

### Manual

Copy `main.js`, `manifest.json`, and `styles.css` to:

```
<Vault>/.obsidian/plugins/life-log/
```

---

## Usage

### Creating an event

1. Open the **Command Palette** (`Ctrl/Cmd + P`).
2. Run **New event**.
3. Type what happened.
4. Press **Enter**.

That's it. A permanent Markdown file exists in your vault.

### Optional details

Click **Optional details** in the modal to set:

- **Occurred** — When it actually happened (defaults to now).
- **Type** — Category of the event.
- **Tags** — Comma-separated tags.
- **Notes** — Additional context.

### Timeline

The **Life Log Timeline** sidebar shows all events grouped by year, month, and day. Click any event to open its file.

### Today in history

If enabled in settings, the sidebar shows events from this calendar day in past years.

---

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Storage folder** | Where event files are stored | `Life Log` |
| **Default event type** | Type assigned to new events | `Other` |
| **Today in history** | Show historical events in sidebar | `On` |

---

## File structure

Events are stored as:

```
Life Log/
  2026/
    2026-07-22-153501-first-coffee-of-the-day.md
    2026-07-22-190210-went-for-a-morning-walk.md
```

Each file contains YAML frontmatter:

```yaml
---
id: 01HXM7S4C8N9
title: First coffee of the day
occurred: 2026-07-22T08:15:00+05:30
created: 2026-07-22T21:04:13+05:30
type: Travel
tags: []
---
```

---

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/sahilium/obsidian-life-log.git
cd obsidian-life-log
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start watch mode (rebuilds on file changes) |
| `npm run build` | Production build |
| `npm run test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint with ESLint |

### Testing

```bash
npm run test
```

Tests cover utility functions, search logic, and file serialization. Run with coverage:

```bash
npm run test:coverage
```

Coverage reports are uploaded to [Codecov](https://codecov.io/gh/sahilium/obsidian-life-log) on CI.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

## License

[0-BSD](LICENSE)

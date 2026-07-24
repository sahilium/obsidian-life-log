# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-24

### Added

- **Instant capture** — Command palette integration for quick event creation.
- **Create event modal** — Minimal by default, expandable for optional details (occurred date, type, tags, notes).
- **Timeline view** — Sidebar view with year/month/day grouping, newest first.
- **Search** — Case-insensitive instant filtering in the timeline view.
- **Today in history** — Shows events from this calendar day in past years.
- **Event types** — Health, Dream, Travel, Career, Purchase, Food, Exercise, Book, Movie, Relationship, Other.
- **Markdown storage** — All events stored as `.md` files with YAML frontmatter in `Life Log/` folder.
- **In-memory index** — Built on startup, auto-updated on file create/modify/delete/rename.
- **Settings** — Configurable storage folder, default event type, and Today in History toggle.
- **Mobile support** — Works on iOS and Android.
- **Tests** — Vitest test suite covering utilities, search, and serialization.

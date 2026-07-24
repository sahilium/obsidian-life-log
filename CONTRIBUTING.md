# Contributing to Life Log

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Development Workflow

- Create a branch from `main` for your changes.
- Make your changes in `src/`.
- The dev server rebuilds `main.js` automatically on save.
- Reload Obsidian to test your changes.
- Run `npm run test` to verify tests pass.
- Run `npm run lint` to check code style.

## Project Structure

```
src/
  main.ts                    # Plugin entry point
  types/event.ts             # Event interfaces and constants
  utils/date.ts              # Date utilities
  utils/file.ts              # File serialization/parsing
  services/event-service.ts  # Event CRUD and indexing
  services/search-service.ts # Search logic
  commands/create-event.ts   # Command registration
  modals/create-event-modal.ts # Event creation UI
  views/timeline-view.ts     # Timeline sidebar
  settings/settings-tab.ts   # Settings UI
```

## Code Style

- TypeScript with strict mode.
- Small, focused functions.
- Early returns over deep nesting.
- No comments unless the logic is non-obvious.
- Follow existing patterns in the codebase.

## Testing

- Write tests for new utility functions and services.
- Run `npm run test:coverage` to check coverage.
- Aim for meaningful coverage, not 100% line count.

## Pull Requests

- Keep PRs focused on a single change.
- Include a clear description of what changed and why.
- Make sure `npm run build`, `npm run test`, and `npm run lint` all pass.
- Reference any related issues.

## Commits

- Write clear commit messages.
- Use conventional commits if possible (`feat:`, `fix:`, `chore:`, etc.).

## License

By contributing, you agree that your contributions will be licensed under the [0-BSD License](LICENSE).

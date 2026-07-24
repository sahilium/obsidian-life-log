import { describe, it, expect } from 'vitest';
import {
  generateFilePath,
  serializeEvent,
  parseEventFromFile,
} from '../utils/file';
import { LifeEvent } from '../types/event';

function makeEvent(overrides: Partial<LifeEvent> = {}): LifeEvent {
  return {
    id: 'TESTID123',
    title: 'First coffee of the day',
    occurred: '2026-07-22T08:15:00.000Z',
    created: '2026-07-22T15:35:00.000Z',
    type: 'Travel',
    tags: [],
    ...overrides,
  };
}

describe('generateFilePath', () => {
  it('generates correct path structure', () => {
    const path = generateFilePath('Life Log', 'First coffee of the day', '2026-07-22T08:15:00.000Z');
    expect(path).toMatch(/^Life Log\/2026\/2026-07-22/);
    expect(path).toContain('first-coffee-of-the-day');
    expect(path.endsWith('.md')).toBe(true);
  });

  it('uses occurred date for year folder', () => {
    const path = generateFilePath('Events', 'Trip', '2024-06-15T12:00:00.000Z');
    expect(path).toMatch(/^Events\/2024\//);
  });

  it('handles special characters in title', () => {
    const path = generateFilePath('Log', 'Hello! @World #2026', '2026-01-01T00:00:00.000Z');
    expect(path).toContain('hello-world-2026');
  });
});

describe('serializeEvent', () => {
  it('serializes frontmatter correctly', () => {
    const event = makeEvent();
    const result = serializeEvent(event);

    expect(result).toContain('---');
    expect(result).toContain('id: TESTID123');
    expect(result).toContain('title: First coffee of the day');
    expect(result).toContain('occurred: 2026-07-22T08:15:00.000Z');
    expect(result).toContain('created: 2026-07-22T15:35:00.000Z');
    expect(result).toContain('type: Travel');
    expect(result).toContain('tags: []');
  });

  it('serializes tags as inline array', () => {
    const event = makeEvent({ tags: ['bus', 'commute'] });
    const result = serializeEvent(event);
    expect(result).toContain('tags: [bus, commute]');
  });

  it('appends notes as body', () => {
    const event = makeEvent({ notes: 'Had a great time!' });
    const result = serializeEvent(event);
    expect(result).toContain('\n\nHad a great time!');
  });

  it('omits body when no notes', () => {
    const event = makeEvent();
    const result = serializeEvent(event);
    expect(result).not.toContain('\n\n');
  });
});

describe('parseEventFromFile', () => {
  it('parses valid frontmatter', () => {
    const content = `---
id: TESTID123
title: First coffee of the day
occurred: 2026-07-22T08:15:00.000Z
created: 2026-07-22T15:35:00.000Z
type: Travel
tags: []
---

Some notes here.`;

    const event = parseEventFromFile(content);
    expect(event).not.toBeNull();
    expect(event?.id).toBe('TESTID123');
    expect(event?.title).toBe('First coffee of the day');
    expect(event?.type).toBe('Travel');
    expect(event?.notes).toBe('Some notes here.');
  });

  it('parses frontmatter with tags', () => {
    const content = `---
id: ABC
title: Test
occurred: 2026-01-01T00:00:00.000Z
created: 2026-01-01T00:00:00.000Z
type: Other
tags: [work, important]
---`;

    const event = parseEventFromFile(content);
    expect(event?.tags).toEqual(['work', 'important']);
  });

  it('returns null for invalid content', () => {
    expect(parseEventFromFile('no frontmatter here')).toBeNull();
  });

  it('returns null when required fields missing', () => {
    const content = `---
id: ABC
---`;
    expect(parseEventFromFile(content)).toBeNull();
  });

  it('handles empty tags array', () => {
    const content = `---
id: X
title: Y
occurred: 2026-01-01T00:00:00.000Z
created: 2026-01-01T00:00:00.000Z
type: Other
tags: []
---`;

    const event = parseEventFromFile(content);
    expect(event?.tags).toEqual([]);
  });

  it('defaults type to Other when missing', () => {
    const content = `---
id: X
title: Y
occurred: 2026-01-01T00:00:00.000Z
created: 2026-01-01T00:00:00.000Z
---`;

    const event = parseEventFromFile(content);
    expect(event?.type).toBe('Other');
  });

  it('parses notes from body', () => {
    const content = `---
id: X
title: Y
occurred: 2026-01-01T00:00:00.000Z
created: 2026-01-01T00:00:00.000Z
type: Other
tags: []
---

This is a note.
With multiple lines.`;

    const event = parseEventFromFile(content);
    expect(event?.notes).toBe('This is a note.\nWith multiple lines.');
  });
});

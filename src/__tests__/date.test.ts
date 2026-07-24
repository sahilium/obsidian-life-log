import { describe, it, expect } from 'vitest';
import {
  slugify,
  nowISO,
  generateId,
  getMonthName,
  formatTime,
  yearsSince,
  localDatetimeValue,
} from '../utils/date';

describe('slugify', () => {
  it('lowercases text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('first coffee of the day')).toBe('first-coffee-of-the-day');
  });

  it('removes special characters', () => {
    expect(slugify('hello! @world#')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify(' hello ')).toBe('hello');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  b   c')).toBe('a-b-c');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('nowISO', () => {
  it('returns an ISO string', () => {
    const result = nowISO();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('getMonthName', () => {
  it('returns correct month names', () => {
    expect(getMonthName(0)).toBe('January');
    expect(getMonthName(6)).toBe('July');
    expect(getMonthName(11)).toBe('December');
  });

  it('returns empty string for invalid month', () => {
    expect(getMonthName(13)).toBe('');
    expect(getMonthName(-1)).toBe('');
  });
});

describe('formatTime', () => {
  it('formats time correctly', () => {
    const result = formatTime('2026-07-22T08:15:00.000Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('pads single digits', () => {
    const result = formatTime('2026-01-01T01:05:00.000Z');
    const [h, m] = result.split(':');
    expect(h?.length).toBe(2);
    expect(m?.length).toBe(2);
  });
});

describe('yearsSince', () => {
  it('returns 0 for same year event', () => {
    const now = new Date();
    const iso = now.toISOString();
    expect(yearsSince(iso)).toBe(0);
  });

  it('returns correct year difference', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3);
    expect(yearsSince(date.toISOString())).toBe(3);
  });
});

describe('localDatetimeValue', () => {
  it('returns datetime-local format', () => {
    const date = new Date(2026, 6, 22, 14, 30);
    const result = localDatetimeValue(date);
    expect(result).toBe('2026-07-22T14:30');
  });

  it('pads single digits', () => {
    const date = new Date(2026, 0, 5, 9, 5);
    const result = localDatetimeValue(date);
    expect(result).toBe('2026-01-05T09:05');
  });
});

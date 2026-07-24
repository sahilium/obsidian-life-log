import { describe, it, expect } from 'vitest';
import { EVENT_TYPES } from '../types/event';

describe('EVENT_TYPES', () => {
  it('contains all expected types', () => {
    expect(EVENT_TYPES).toContain('Health');
    expect(EVENT_TYPES).toContain('Dream');
    expect(EVENT_TYPES).toContain('Travel');
    expect(EVENT_TYPES).toContain('Career');
    expect(EVENT_TYPES).toContain('Purchase');
    expect(EVENT_TYPES).toContain('Food');
    expect(EVENT_TYPES).toContain('Exercise');
    expect(EVENT_TYPES).toContain('Book');
    expect(EVENT_TYPES).toContain('Movie');
    expect(EVENT_TYPES).toContain('Relationship');
    expect(EVENT_TYPES).toContain('Other');
  });

  it('has 11 types', () => {
    expect(EVENT_TYPES).toHaveLength(11);
  });

  it('ends with Other as default', () => {
    expect(EVENT_TYPES[EVENT_TYPES.length - 1]).toBe('Other');
  });
});

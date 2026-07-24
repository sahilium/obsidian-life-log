import { describe, it, expect } from 'vitest';
import { searchEvents } from '../services/search-service';
import { LifeEvent } from '../types/event';

function makeEvent(overrides: Partial<LifeEvent> = {}): LifeEvent {
  return {
    id: 'ID1',
    title: 'First coffee of the day',
    occurred: '2026-07-22T08:15:00.000Z',
    created: '2026-07-22T15:35:00.000Z',
    type: 'Travel',
    tags: [],
    ...overrides,
  };
}

describe('searchEvents', () => {
  const events = [
    makeEvent({ id: '1', title: 'First coffee of the day' }),
    makeEvent({ id: '2', title: 'Went for a morning walk' }),
    makeEvent({ id: '3', title: 'Had a strange dream last night' }),
    makeEvent({ id: '4', title: 'Tried a new recipe' }),
    makeEvent({ id: '5', title: 'Found a new favorite song' }),
  ];

  it('returns all events for empty query', () => {
    expect(searchEvents(events, '')).toHaveLength(5);
  });

  it('filters by title match', () => {
    const result = searchEvents(events, 'coffee');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('First coffee of the day');
  });

  it('is case insensitive', () => {
    const result = searchEvents(events, 'DREAM');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toContain('dream');
  });

  it('returns empty for no match', () => {
    expect(searchEvents(events, 'pizza')).toHaveLength(0);
  });

  it('matches partial strings', () => {
    const result = searchEvents(events, 'morning');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('Went for a morning walk');
  });

  it('matches multiple events', () => {
    const result = searchEvents(events, 'e');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

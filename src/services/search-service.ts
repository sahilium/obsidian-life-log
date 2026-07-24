import { LifeEvent } from '../types/event';

export function searchEvents(events: LifeEvent[], query: string): LifeEvent[] {
  const q = query.toLowerCase().trim();
  if (!q) return events;
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(q),
  );
}

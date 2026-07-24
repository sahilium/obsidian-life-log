export const EVENT_TYPES = [
  'Health',
  'Dream',
  'Travel',
  'Career',
  'Purchase',
  'Food',
  'Exercise',
  'Book',
  'Movie',
  'Relationship',
  'Other',
] as const;

export type EventType = typeof EVENT_TYPES[number];

export interface LifeEvent {
  id: string;
  title: string;
  occurred: string;
  created: string;
  type: EventType;
  tags: string[];
  notes?: string;
}

export interface CreateEventInput {
  title: string;
  occurred?: string;
  type?: EventType;
  tags?: string[];
  notes?: string;
}

import { LifeEvent } from '../types/event';
import { slugify } from './date';

export function generateFilePath(
  folder: string,
  title: string,
  occurredISO: string,
): string {
  const d = new Date(occurredISO);
  const y = d.getFullYear().toString();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const slug = slugify(title);
  return `${folder}/${y}/${y}-${M}-${day}-${h}${m}${s}-${slug}.md`;
}

export function serializeEvent(event: LifeEvent): string {
  const tags = event.tags.length > 0
    ? `[${event.tags.join(', ')}]`
    : '[]';
  const lines = [
    '---',
    `id: ${event.id}`,
    `title: ${event.title}`,
    `occurred: ${event.occurred}`,
    `created: ${event.created}`,
    `type: ${event.type}`,
    `tags: ${tags}`,
    '---',
  ];
  if (event.notes) {
    lines.push('', event.notes);
  }
  return lines.join('\n');
}

export function parseEventFromFile(
  content: string,
): LifeEvent | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = match[1];
  if (!fm) return null;

  const raw: Record<string, unknown> = {};
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.substring(0, idx).trim();
    let value: string = line.substring(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      raw[key] = inner ? inner.split(',').map(s => s.trim().replace(/['"]/g, '')) : [];
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      raw[key] = value.slice(1, -1);
    } else {
      raw[key] = value;
    }
  }

  const id = raw['id'];
  const title = raw['title'];
  const occurred = raw['occurred'];
  if (typeof id !== 'string' || typeof title !== 'string' || typeof occurred !== 'string') return null;

  const created = typeof raw['created'] === 'string' ? raw['created'] : occurred;
  const rawType = raw['type'];
  const type = (typeof rawType === 'string' ? rawType : 'Other') as LifeEvent['type'];

  const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n?\n?([\s\S]*)$/);
  const notes = bodyMatch && bodyMatch[1] ? bodyMatch[1].trim() || undefined : undefined;

  const ev: LifeEvent = {
    id,
    title,
    occurred,
    created,
    type,
    tags: Array.isArray(raw['tags']) ? (raw['tags'] as string[]).map(String) : [],
    notes,
  };
  return ev;
}

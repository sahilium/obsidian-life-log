import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { EventService } from '../services/event-service';
import { LifeEvent } from '../types/event';
import { searchEvents } from '../services/search-service';
import { getMonthName, formatTime, yearsSince } from '../utils/date';
import { LifeLogPlugin } from '../main';

export const TIMELINE_VIEW_TYPE = 'life-log-timeline';

const TYPE_EMOJI: Record<string, string> = {
  Health: '\u{1F3E5}',
  Dream: '\u{1F634}',
  Travel: '\u{1F68C}',
  Career: '\u{1F4BC}',
  Purchase: '\u{1F6D2}',
  Food: '\u{1F37D}',
  Exercise: '\u{1F3C3}',
  Book: '\u{1F4D6}',
  Movie: '\u{1F3AC}',
  Relationship: '\u{1F495}',
  Other: '\u{1F4CC}',
};

function eventEmoji(event: LifeEvent): string {
  return TYPE_EMOJI[event.type] || '\u{1F4CC}';
}

export class TimelineView extends ItemView {
  private eventService: EventService;
  private plugin: LifeLogPlugin;
  private searchQuery = '';

  constructor(leaf: WorkspaceLeaf, plugin: LifeLogPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.eventService = plugin.eventService;
    this.eventService.onChange(() => this.refresh());
  }

  getViewType(): string {
    return TIMELINE_VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Life log timeline';
  }

  getIcon(): string {
    return 'history';
  }

  async onOpen(): Promise<void> {
    this.refresh();
  }

  refresh(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass('life-log-timeline');

    this.renderSearch();
    this.renderTodayInHistory();
    this.renderTimeline();
  }

  private renderSearch(): void {
    const searchEl = this.containerEl.createDiv({ cls: 'life-log-search' });
    const input = searchEl.createEl('input', {
      type: 'search',
      attr: { placeholder: 'Search events...' },
    });
    input.addEventListener('input', () => {
      this.searchQuery = input.value;
      this.refreshTimelineOnly();
    });
  }

  private refreshTimelineOnly(): void {
    const timelineEl = this.containerEl.querySelector('.life-log-events');
    if (timelineEl instanceof HTMLElement) {
      timelineEl.empty();
      this.renderEventList(timelineEl);
    }
  }

  private renderTodayInHistory(): void {
    const settings = this.plugin.settings;
    if (!settings.showTodayInHistory) return;

    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    const matches = this.eventService.getEventsForMonthDay(month, day);
    if (matches.length === 0) return;

    const byYear = new Map<number, { event: LifeEvent; filePath: string }[]>();
    for (const m of matches) {
      const y = new Date(m.event.occurred).getFullYear();
      const arr = byYear.get(y);
      if (arr) arr.push(m);
      else byYear.set(y, [m]);
    }

    const section = this.containerEl.createDiv({ cls: 'life-log-today' });
    section.createEl('h3', { text: 'Today in history' });

    const sortedYears = [...byYear.keys()].sort((a, b) => b - a);
    for (const year of sortedYears) {
      const items = byYear.get(year);
      if (!items || items.length === 0) continue;
      const firstItem = items[0];
      if (!firstItem) continue;
      const diff = yearsSince(firstItem.event.occurred);
      const label = diff === 0 ? 'Earlier this year' : `${diff} year${diff !== 1 ? 's' : ''} ago`;
      section.createDiv({ cls: 'life-log-years-ago', text: label });

      for (const { event, filePath } of items) {
        this.renderEventItem(section, event, filePath);
      }
    }
  }

  private renderTimeline(): void {
    const container = this.containerEl.createDiv({ cls: 'life-log-events' });
    this.renderEventList(container);
  }

  private renderEventList(container: HTMLElement): void {
    const allEvents = this.eventService.getAllEvents();
    const filtered = this.searchQuery
      ? searchEvents(allEvents, this.searchQuery)
      : allEvents;

    filtered.sort(
      (a, b) => new Date(b.occurred).getTime() - new Date(a.occurred).getTime(),
    );

    const byYear = new Map<number, LifeEvent[]>();
    for (const event of filtered) {
      const y = new Date(event.occurred).getFullYear();
      const arr = byYear.get(y);
      if (arr) arr.push(event);
      else byYear.set(y, [event]);
    }

    const sortedYears = [...byYear.keys()].sort((a, b) => b - a);

    if (sortedYears.length === 0) {
      container.createEl('p', {
        cls: 'life-log-empty',
        text: 'No events yet. Create one with the command palette.',
      });
      return;
    }

    for (const year of sortedYears) {
      const yearEl = container.createDiv({ cls: 'life-log-year' });
      yearEl.createEl('h2', { text: String(year) });

      const events = byYear.get(year)!;
      const byMonth = new Map<number, LifeEvent[]>();
      for (const event of events) {
        const m = new Date(event.occurred).getMonth();
        const arr = byMonth.get(m);
        if (arr) arr.push(event);
        else byMonth.set(m, [event]);
      }

      const sortedMonths = [...byMonth.keys()].sort((a, b) => b - a);
      for (const month of sortedMonths) {
        const monthEl = yearEl.createDiv({ cls: 'life-log-month' });
        monthEl.createEl('h3', { text: getMonthName(month) });

        const monthEvents = byMonth.get(month)!;
        for (const event of monthEvents) {
          const fp = this.eventService.getFilePath(event);
          this.renderEventItem(monthEl, event, fp || '');
        }
      }
    }
  }

  private renderEventItem(
    container: HTMLElement,
    event: LifeEvent,
    filePath: string,
  ): void {
    const d = new Date(event.occurred);
    const dayStr = String(d.getDate()).padStart(2, '0');
    const timeStr = formatTime(event.occurred);

    const item = container.createDiv({ cls: 'life-log-event' });
    item.createSpan({ cls: 'life-log-event-day', text: dayStr });
    item.createSpan({
      cls: 'life-log-event-title',
      text: `${eventEmoji(event)} ${event.title}`,
    });
    item.createSpan({ cls: 'life-log-event-time', text: timeStr });

    item.addEventListener('click', () => {
      if (!filePath) return;
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (file instanceof TFile) {
        void this.app.workspace.getLeaf().openFile(file);
      }
    });
  }
}

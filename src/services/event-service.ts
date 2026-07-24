import { TFile } from 'obsidian';
import { LifeEvent, CreateEventInput } from '../types/event';
import { nowISO, generateId } from '../utils/date';
import { generateFilePath, serializeEvent, parseEventFromFile } from '../utils/file';
import type LifeLogPlugin from '../main';
import type { LifeLogSettings } from '../settings/settings-tab';

type ChangeCallback = () => void;

export class EventService {
  private events = new Map<string, LifeEvent>();
  private callbacks: ChangeCallback[] = [];
  private ready = false;

  constructor(private plugin: LifeLogPlugin) {}

  onChange(cb: ChangeCallback): void {
    this.callbacks.push(cb);
  }

  private notify(): void {
    for (const cb of this.callbacks) cb();
  }

  private get settings(): LifeLogSettings {
    return this.plugin.settings;
  }

  async initialize(): Promise<void> {
    await this.buildIndex();
    this.registerVaultListeners();
    this.ready = true;
  }

  private async buildIndex(): Promise<void> {
    this.events.clear();
    const folder = this.settings.storageFolder;
    const files = this.plugin.app.vault.getMarkdownFiles();
    for (const file of files) {
      if (file.path.startsWith(folder + '/')) {
        await this.indexFile(file);
      }
    }
  }

  private async ensureFolder(path: string): Promise<void> {
    const adapter = this.plugin.app.vault.adapter;
    const parts = path.split('/').filter(Boolean);
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      if (!(await adapter.exists(acc))) {
        await this.plugin.app.vault.createFolder(acc);
      }
    }
  }

  private async indexFile(file: TFile): Promise<void> {
    try {
      const content = await this.plugin.app.vault.read(file);
      const event = parseEventFromFile(content);
      if (event) {
        this.events.set(file.path, event);
      }
    } catch {
      console.debug(`Failed to parse event: ${file.path}`);
    }
  }

  private registerVaultListeners(): void {
    const folder = this.settings.storageFolder;

    this.plugin.registerEvent(
      this.plugin.app.vault.on('create', (file) => {
        if (file instanceof TFile && file.path.startsWith(folder + '/')) {
          void this.indexFile(file).then(() => this.notify());
        }
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.vault.on('modify', (file) => {
        if (file instanceof TFile && file.path.startsWith(folder + '/')) {
          void this.indexFile(file).then(() => this.notify());
        }
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.vault.on('delete', (file) => {
        if (file.path.startsWith(folder + '/')) {
          this.events.delete(file.path);
          this.notify();
        }
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.vault.on('rename', (file, oldPath) => {
        if (oldPath.startsWith(folder + '/')) {
          this.events.delete(oldPath);
          if (file instanceof TFile) {
            void this.indexFile(file).then(() => this.notify());
          }
        }
      }),
    );
  }

  async createEvent(input: CreateEventInput): Promise<LifeEvent> {
    const folder = this.settings.storageFolder;
    const occurred = input.occurred || nowISO();
    const event: LifeEvent = {
      id: generateId(),
      title: input.title,
      occurred,
      created: nowISO(),
      type: input.type || this.settings.defaultType,
      tags: input.tags || [],
      notes: input.notes,
    };

    const filePath = generateFilePath(folder, event.title, event.occurred);
    const content = serializeEvent(event);

    await this.ensureFolder(folder + '/' + new Date(event.occurred).getFullYear());
    await this.plugin.app.vault.create(filePath, content);
    this.events.set(filePath, event);
    this.notify();

    return event;
  }

  getAllEvents(): LifeEvent[] {
    return Array.from(this.events.values());
  }

  getEventsForMonthDay(month: number, day: number): { event: LifeEvent; filePath: string }[] {
    const results: { event: LifeEvent; filePath: string }[] = [];
    for (const [path, event] of this.events) {
      const d = new Date(event.occurred);
      if (d.getMonth() === month && d.getDate() === day) {
        results.push({ event, filePath: path });
      }
    }
    return results;
  }

  getFilePath(event: LifeEvent): string | undefined {
    for (const [path, e] of this.events) {
      if (e.id === event.id) return path;
    }
    return undefined;
  }

  isReady(): boolean {
    return this.ready;
  }
}

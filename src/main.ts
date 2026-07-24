import { Plugin } from 'obsidian';
import { EventService } from './services/event-service';
import { registerCreateEventCommand } from './commands/create-event';
import { CreateEventModal } from './modals/create-event-modal';
import { TimelineView, TIMELINE_VIEW_TYPE } from './views/timeline-view';
import { LifeLogSettingTab, LifeLogSettings, DEFAULT_SETTINGS } from './settings/settings-tab';

export default class LifeLogPlugin extends Plugin {
  settings!: LifeLogSettings;
  eventService!: EventService;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.eventService = new EventService(this);
    await this.eventService.initialize();

    registerCreateEventCommand(this);

    this.registerView(
      TIMELINE_VIEW_TYPE,
      (leaf) => new TimelineView(leaf, this),
    );

    this.addRibbonIcon('history', 'Life log', () => {
      void this.activateTimelineView();
    });

    this.addCommand({
      id: 'open-timeline',
      name: 'Open timeline',
      callback: () => void this.activateTimelineView(),
    });

    this.addSettingTab(new LifeLogSettingTab(this.app, this));

    this.app.workspace.onLayoutReady(() => {
      void this.activateTimelineView();
    });
  }

  onunload(): void {
  }

  async activateTimelineView(): Promise<void> {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(TIMELINE_VIEW_TYPE)[0];
    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        leaf = rightLeaf;
        await leaf.setViewState({ type: TIMELINE_VIEW_TYPE, active: true });
      }
    }
    if (leaf) {
      void workspace.revealLeaf(leaf);
    }
  }

  openCreateModal(): void {
    new CreateEventModal(this.app, this.eventService).open();
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<LifeLogSettings>,
    );
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

export type { LifeLogPlugin };

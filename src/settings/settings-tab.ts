import { App, PluginSettingTab, Setting, PluginSettingTabGetSettingDefinitions } from 'obsidian';
import { EVENT_TYPES, EventType } from '../types/event';
import type { LifeLogPlugin } from '../main';

export interface LifeLogSettings {
  storageFolder: string;
  defaultType: EventType;
  showTodayInHistory: boolean;
}

export const DEFAULT_SETTINGS: LifeLogSettings = {
  storageFolder: 'Life Log',
  defaultType: 'Other',
  showTodayInHistory: true,
};

export class LifeLogSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private plugin: LifeLogPlugin,
  ) {
    super(app, plugin);
  }

  getSettingDefinitions(): PluginSettingTabGetSettingDefinitions {
    return {
      storageFolder: {
        name: 'Storage folder',
        description: 'Folder path for life event files',
      },
      defaultType: {
        name: 'Default event type',
        description: 'Default type for new events',
      },
      showTodayInHistory: {
        name: 'Today in history',
        description: 'Show events from this day in past years',
      },
    };
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // Settings will appear below

    new Setting(containerEl)
      .setName('Storage folder')
      .setDesc('Folder path for life event files')
      .addText((text) =>
        text
          .setPlaceholder('Life log')
          .setValue(this.plugin.settings.storageFolder)
          .onChange(async (v) => {
            this.plugin.settings.storageFolder = v;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Default event type')
      .setDesc('Default type for new events')
      .addDropdown((dropdown) => {
        for (const t of EVENT_TYPES) {
          dropdown.addOption(t, t);
        }
        dropdown.setValue(this.plugin.settings.defaultType);
        dropdown.onChange(async (v) => {
          this.plugin.settings.defaultType = v as EventType;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('Today in history')
      .setDesc('Show events from this day in past years')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showTodayInHistory)
          .onChange(async (v) => {
            this.plugin.settings.showTodayInHistory = v;
            await this.plugin.saveSettings();
          }),
      );
  }
}

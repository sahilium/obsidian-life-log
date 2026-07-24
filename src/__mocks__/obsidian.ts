import { vi } from 'vitest';

class MockModal {
  app: any;
  contentEl: any;
  constructor(app: any) {
    this.app = app;
    this.contentEl = {
      empty: vi.fn(),
      createEl: vi.fn(() => ({})),
      createDiv: vi.fn(() => ({})),
      addClass: vi.fn(),
      querySelector: vi.fn(),
    };
  }
  open() {}
  close() {}
  setTitle(_title: string) {}
}

class MockPlugin {
  app: any;
  addCommand = vi.fn();
  addRibbonIcon = vi.fn();
  addSettingTab = vi.fn();
  registerView = vi.fn();
  registerEvent = vi.fn();
  loadData = vi.fn().mockResolvedValue({});
  saveData = vi.fn().mockResolvedValue(undefined);
}

class MockPluginSettingTab {
  constructor(_app: any, _plugin: any) {}
  display() {}
}

class MockItemView {
  leaf: any;
  contentEl: any;
  containerEl: any;
  constructor(leaf: any) {
    this.leaf = leaf;
    this.contentEl = {
      empty: vi.fn(),
      createEl: vi.fn(() => ({})),
      createDiv: vi.fn(() => ({})),
    };
    this.containerEl = {
      empty: vi.fn(),
      createDiv: vi.fn(() => ({})),
      createEl: vi.fn(() => ({})),
      querySelector: vi.fn(),
      addClass: vi.fn(),
    };
  }
  getViewType() { return ''; }
  getDisplayText() { return ''; }
  getIcon() { return ''; }
  async onOpen() {}
}

class MockSetting {
  setName = vi.fn().mockReturnThis();
  setDesc = vi.fn().mockReturnThis();
  addText = vi.fn().mockReturnThis();
  addDropdown = vi.fn().mockReturnThis();
  addToggle = vi.fn().mockReturnThis();
  addTextArea = vi.fn().mockReturnThis();
  setHeading = vi.fn().mockReturnThis();
  setPlaceholder = vi.fn().mockReturnThis();
  setValue = vi.fn().mockReturnThis();
}

export { MockModal, MockPlugin, MockPluginSettingTab, MockItemView, MockSetting };
export { vi as mock };

export const Plugin = MockPlugin;
export const Modal = MockModal;
export const PluginSettingTab = MockPluginSettingTab;
export const ItemView = MockItemView;
export const Setting = MockSetting;
export const Notice = vi.fn();
export const TFile = class {};
export const WorkspaceLeaf = class {};
export const MarkdownView = class {};
export const MarkdownFileInfo = class {};

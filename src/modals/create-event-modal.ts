import { App, Modal, Setting } from 'obsidian';
import { EventService } from '../services/event-service';
import { EVENT_TYPES, EventType } from '../types/event';
import { localDatetimeValue } from '../utils/date';

export class CreateEventModal extends Modal {
  private title = '';
  private occurred: string;
  private type: EventType = 'Other';
  private tags = '';
  private notes = '';
  private expanded = false;

  constructor(
    app: App,
    private eventService: EventService,
  ) {
    super(app);
    this.occurred = localDatetimeValue(new Date());
    this.setTitle('Life log');
  }

  onOpen(): void {
    this.renderMinimal();
  }

  private renderMinimal(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('life-log-modal');

    contentEl.createEl('h2', { text: 'What happened?' });

    const input = contentEl.createEl('input', {
      type: 'text',
      attr: {
        placeholder: 'E.g. Took a bus ride',
        autofocus: '',
        'data-life-log-title': '',
      },
    });
    input.addEventListener('input', () => {
      this.title = input.value;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.title.trim()) {
        void this.save();
      }
    });
    input.focus();

    const saveBtn = contentEl.createEl('button', {
      text: 'Save',
      cls: 'mod-cta',
    });
    saveBtn.addEventListener('click', () => {
      if (this.title.trim()) void this.save();
    });

    const toggleEl = contentEl.createEl('details');
    const summary = toggleEl.createEl('summary', { text: 'Optional details' });
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      this.expanded = !this.expanded;
      if (this.expanded) {
        toggleEl.setAttr('open', '');
        this.renderExpanded(toggleEl);
      } else {
        toggleEl.removeAttribute('open');
        this.renderMinimal();
      }
    });
  }

  private renderExpanded(container: HTMLElement): void {
    const div = container.createDiv({ cls: 'life-log-details' });

    new Setting(div)
      .setName('Occurred')
      .addText((text) => {
        text.setValue(this.occurred);
        text.inputEl.type = 'datetime-local';
        text.onChange((v) => (this.occurred = v));
      });

    new Setting(div)
      .setName('Type')
      .addDropdown((dropdown) => {
        for (const t of EVENT_TYPES) {
          dropdown.addOption(t, t);
        }
        dropdown.setValue(this.type);
        dropdown.onChange((v) => (this.type = v as EventType));
      });

    new Setting(div)
      .setName('Tags')
      .addText((text) => {
        text.setPlaceholder('Comma separated');
        text.setValue(this.tags);
        text.onChange((v) => (this.tags = v));
      });

    new Setting(div)
      .setName('Notes')
      .addTextArea((text) => {
        text.setValue(this.notes);
        text.onChange((v) => (this.notes = v));
      });
  }

  private async save(): Promise<void> {
    const tags = this.tags
      ? this.tags.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const occurred = this.occurred
      ? new Date(this.occurred).toISOString()
      : undefined;

    await this.eventService.createEvent({
      title: this.title.trim(),
      occurred,
      type: this.type,
      tags,
      notes: this.notes.trim() || undefined,
    });

    this.close();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

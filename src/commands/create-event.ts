import { LifeLogPlugin } from '../main';

export function registerCreateEventCommand(plugin: LifeLogPlugin): void {
  plugin.addCommand({
    id: 'new-event',
    name: 'New event',
    callback: () => plugin.openCreateModal(),
  });
}

import { App, PluginSettingTab, Setting } from 'obsidian';
import SerendipityPlugin from './main';

export class SerendipitySettingTab extends PluginSettingTab {
    plugin: SerendipityPlugin;

    constructor(app: App, plugin: SerendipityPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Source Directory')
            .setDesc('The directory from which to pick a random file from. If specified, "exclude directory" will be ignored')
            .addText(text => text
                // TODO: Implement autocomplete for directories
                .setPlaceholder('Enter the directory name. e.g. Journal, or Books')
                .setValue(this.plugin.settings.sourceDirectory)
                .onChange(async (value) => {
                    this.plugin.settings.sourceDirectory = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
        .setName('Exclude Directory')
        .setDesc('The directory to exclude from the random file picker. This will be ignored if "source directory" is specified')
        .addText(text => text
            // TODO: Implement autocomplete for directories
            .setPlaceholder('Enter the directory name e.g. Work, Drafts')
            .setValue(this.plugin.settings.excludeDirectory)
            .onChange(async (value) => {
                this.plugin.settings.excludeDirectory = value;
                await this.plugin.saveSettings();
            }));
    }
}
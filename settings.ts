import { App, PluginSettingTab, Setting } from 'obsidian';
import SerendipityPlugin from './main';

export class SerentipitySettingTab extends PluginSettingTab {
    plugin: SerendipityPlugin;

    constructor(app: App, plugin: SerendipityPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Random Journal Settings' });

        new Setting(containerEl)
            .setName('Source Directory')
            .setDesc('The directory from which to pick a random file from at start-up')
            .addText(text => text
                .setPlaceholder('Enter the directory path')
                .setValue(this.plugin.settings.sourceDirectory)
                .onChange(async (value) => {
                    this.plugin.settings.sourceDirectory = value;
                    await this.plugin.saveSettings();
                }));
    }
}
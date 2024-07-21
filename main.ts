import { App, ButtonComponent, Editor, MarkdownRenderer, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, TFolder } from 'obsidian';
import { SerentipitySettingTab } from './settings';

interface SerendipityPluginSettings {
    sourceDirectory: string;
}

const DEFAULT_SETTINGS: SerendipityPluginSettings = {
    sourceDirectory: ''
}

export default class SerendipityPlugin extends Plugin {
	settings: SerendipityPluginSettings;

	async onload() {
		await this.loadSettings();

        this.app.workspace.on('layout-ready', this.onAppOpen);
        // this.app.workspace.on('layout-change', this.onAppOpen);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SerentipitySettingTab(this.app, this));
	}

	onunload() {

	}

    onAppOpen = async () => {
        console.log('App is open');

        const randomMdFile = await this.getRandomEntry();
        if (randomMdFile) {
            new SerendipityModal(this.app, randomMdFile).open();
        }
    }

    async getRandomEntry() {
        // TODO: parameterize this so that it only gets files from the specified directory
        const sourceDirectory = this.app.vault.getAbstractFileByPath(this.settings.sourceDirectory);
        let mdFilesInVault: TFile[] = this.app.vault.getMarkdownFiles();
        
        console.log('source directory, instance of TFolder?', sourceDirectory, sourceDirectory instanceof TFolder);

        if (!sourceDirectory || !(sourceDirectory instanceof TFolder)) {
            new Notice('Invalid source directory. Resetting it to the vault root');
        } else {
            mdFilesInVault = sourceDirectory
                .children
                .filter((file) => file instanceof TFile && file.extension === 'md') as TFile[];
        }

        if (mdFilesInVault.length === 0) {
            return null;
        }

        console.log('Getting random entry');
        const randomIndex = Math.floor(Math.random() * mdFilesInVault.length);
        return mdFilesInVault[randomIndex];
    }    
    

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SerendipityModal extends Modal {
    private file: TFile;

	constructor(app: App, file: TFile) {
		super(app);
        this.file = file;
	}

    async onOpen() {
        const { contentEl } = this;
        const fileContents = await this.app.vault.read(this.file);

        contentEl.createEl('h2', { text: this.file.name });
        const contentContainer = contentEl.createDiv({ cls: 'markdown-preview' });
        // MarkdownRenderer.renderMarkdown(fileContents, contentContainer, this.file.path, this);
        MarkdownRenderer.render(this.app, fileContents, contentContainer, this.file.path, this);

        const footerEl = contentEl.createDiv({ cls: 'modal-footer' });
        // MarkdownRenderer.render(this.app, `[[${this.file.name}]]`, footerEl, this.file.path, this);

        new ButtonComponent(footerEl)
            .setButtonText('Open in vault')
            .onClick(() => {
                this.app.workspace.getLeaf('tab').openFile(this.file);
                this.close();
            });

        new ButtonComponent(footerEl)
            .setButtonText('Close')
            .onClick(() => {
                this.close();
            });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// class SerentipitySettingTab extends PluginSettingTab {
// 	plugin: SerendipityPlugin;

// 	constructor(app: App, plugin: SerendipityPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }

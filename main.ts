import { 
    App, 
    ButtonComponent, 
    MarkdownRenderer, 
    Modal, 
    Notice, 
    Plugin, 
    TFile, 
    TFolder } from 'obsidian';
import { SerendipitySettingTab } from './settings';

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SerendipitySettingTab(this.app, this));
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
        let mdFilesInVault: TFile[];
        const sourceDirectory = this.app.vault.getAbstractFileByPath(this.settings.sourceDirectory);
        
        if (!sourceDirectory || !(sourceDirectory instanceof TFolder)) {
            new Notice('Invalid source directory. Resetting it to the vault root');
            mdFilesInVault = this.app.vault.getMarkdownFiles();
        } else {
            mdFilesInVault = sourceDirectory
                .children
                .filter((file) => file instanceof TFile && file.extension === 'md') as TFile[];
        }

        if (mdFilesInVault.length === 0) {
            return null;
        }

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

        // TODO: Add 'components" as expected as the last argument. app console warns about potential memory issues of using "this"
        MarkdownRenderer.render(this.app, fileContents, contentContainer, this.file.path, this);

        const footerEl = contentEl.createDiv({ cls: 'modal-footer' });

        // TODO: Beautify the buttons. They currently sit awkwardly next to each other in the footer
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

import { 
    App, 
    ButtonComponent, 
    Component, 
    MarkdownRenderer, 
    Modal, 
    Notice, 
    Plugin, 
    TAbstractFile, 
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

        this.app.workspace.onLayoutReady(this.onAppOpen);

		this.addSettingTab(new SerendipitySettingTab(this.app, this));
	}

	onunload() {

	}

    onAppOpen = async () => {
        const randomMdFile = await this.getRandomEntry();

        if (randomMdFile) {
            new SerendipityModal(this.app, randomMdFile).open();
        }
    }

    async getRandomEntry() {
        let mdFilesInVault: TAbstractFile[];
        const sourceDirectory = this.app.vault.getAbstractFileByPath(this.settings.sourceDirectory);
            

        if (!sourceDirectory || !(sourceDirectory instanceof TFolder)) {
            new Notice('Invalid source directory. Resetting it to the vault root');

            mdFilesInVault = this.app.vault.getMarkdownFiles();
        } else {
            mdFilesInVault = sourceDirectory
                .children
                .filter((file) => file instanceof TFile && file.extension === 'md');
        }

        if (mdFilesInVault.length === 0) {
            new Notice('No markdown files found in the specified directory');
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
    private file: TAbstractFile;

	constructor(app: App, file: TAbstractFile) {
		super(app);
        this.file = file;
	}

    async onOpen() {
        const { contentEl } = this;
        const fileContents = this.file instanceof TFile ? await this.app.vault.read(this.file): '';

        const header = contentEl.createDiv({ cls: 'modal-header' });

        // TODO: Beautify the buttons. They currently sit awkwardly next to each other in the footer
        const openCta = new ButtonComponent(header)    
        openCta.setButtonText('Open in vault')
            .onClick(() => {
                this.file instanceof TFile && this.app.workspace.getLeaf('tab').openFile(this.file);
                this.close();
            });
        
        const closeCta = new ButtonComponent(header)
        closeCta.setButtonText('Close')
            .onClick(() => {
                this.close();
            });
        
        const contentContainer = contentEl.createDiv({ cls: 'markdown-preview' });
        const component = new Component();
        // TODO: Add 'components" as expected as the last argument. app console warns about potential memory issues of using "this"
        MarkdownRenderer.render(this.app, fileContents, contentContainer, this.file.path, component);

        const footerEl = contentEl.createDiv({ cls: 'modal-footer' });
        // TODO: Beautify the buttons. They currently sit awkwardly next to each other in the footer
        // const buttonComponent = new ButtonComponent(footerEl)
            
        // buttonComponent.setButtonText('Open in vault')
        //     .onClick(() => {
        //         this.app.workspace.getLeaf('tab').openFile(this.file);
        //         this.close();
        //     });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    onLoad() {

    }

    onUnload() {
    
    }
}

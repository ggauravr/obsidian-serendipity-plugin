# obsidian-serendipity-plugin

### Description
Serendipity plugin was born out of my need to revisit my past notes. It might invoke nostalgia by surfacing old journal entries, allowing you to reflect on your past thoughts and experiences, or a way to trigger interesting ideas and insights from on your past learnings, whether from books, articles, or personal observations.

In short, it helps force serendipitous discoveries by displaying random notes from your vault each time you open Obsidian. It's your personal time machine, and idea generator, rolled into one.

### Features
- Displays a random note from our vault in a modal when Obsidian is opened
- Customizable settings to specify journal file locations to choose a random note from
- Themed UI that adapts to your Obsidian theme
- Direct link to open the source file of the displayed entry in a new tab

### Installation
1. Open Obsidian and go to Settings
2. Navigate to Community Plugins and disable Safe Mode
3. Click on Browse and search for "Serendipity"
3. Install the plugin and enable it
4. Restart Obsidian and open the vault in which the plugin is installed

### Usage
Once installed and enabled, Serendipity will automatically display a random note each time you open Obsidian

### Configuration/Settings
To configure the plugin settings - 
1. Go to Settings > Community Plugins
2. Find Serendipity in the list and click on the gear icon
3. Set the path to the directory you want the plugin to pick random notes from(Enter the path relative to the root of the vault)

### Development/Contribution
If you want to contribute to Serendipity, or use it as a base for your own plugin -

1. Clone the repository
2. Run `npm run install` to install dependencies
3. Run `npm run dev` to start compilation in watch mode
4. To contribute, open a PR with your changes

### Reporing Issues
If you encounter any issues or have suggestions for improvements, please file an issue on the GitHub repository

### Upcoming Features
- [ ] Add support to invoke the plugin based on a command, rather than merely on start-up
- [ ] Add a scroll to top button at the bottom of the modal to display when the user has scrolled
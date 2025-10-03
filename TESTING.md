# Testing Your Extension

## Quick Start

1. **Compile the extension:**
   ```bash
   pnpm run compile
   # or for watching changes:
   pnpm run watch
   ```

2. **Test in VSCode:**
   - Press `F5` in VSCode
   - A new VSCode window will open with your extension loaded
   - Open the `test.nhell` file or any file in `examples/` folder

3. **What to check:**

   ✅ **Syntax Highlighting:**
   - Events headers (=== event ===) should be colored
   - Choices (* [...]) should be bold
   - Effects (~ family +5) should be highlighted
   - Comments should be grayed out

   ✅ **Validation (Problems panel):**
   - Try breaking a link: `-> nonexistent_event`
   - Create an unreachable event (no links to it)
   - Create a dead end (event with no choices)

   ✅ **Hover Information:**
   - Hover over effects (~ family +10) to see descriptions
   - Hover over transitions (-> event_name) to see where they go

   ✅ **Commands:**
   - Open Command Palette (Ctrl+Shift+P)
   - Try "Narrative Hell: Validate Story Flow"
   - Try "Narrative Hell: Show Story Graph"

   ✅ **CodeLens:**
   - Look for "▶ Simulate from here" above events

## Troubleshooting

If syntax highlighting doesn't work:

1. Make sure file has `.nhell` or `.nh` extension
2. Check language mode in bottom-right corner (should say "Narrative Hell")
3. Try "Developer: Reload Window" command

If validation doesn't show:

1. Check "Problems" panel (Ctrl+Shift+M)
2. Make sure you have actual issues in the file
3. Save the file to trigger validation

## Next Steps

Once basic features work, you can add:

1. **Graph Visualization:**
   - Use D3.js or vis.js in the webview
   - Parse events and show connections

2. **Simulation Mode:**
   - Track state changes through choices
   - Show path through story

3. **Export to Unity:**
   - Command to export as JSON
   - Compatible with your game format

4. **Publishing:**
   ```bash
   npm install -g vsce
   vsce package
   # Creates .vsix file for distribution
   ```

## File Structure Created

```
narrative-hell/
├── syntaxes/
│   └── nhell.tmLanguage.json      ✅ Syntax highlighting rules
├── src/
│   └── extension.ts                ✅ Main extension logic
├── examples/
│   ├── simple.nhell                ✅ Simple example
│   └── complete_story.nhell        ✅ Complex example  
├── test.nhell                      ✅ Test file
├── package.json                    ✅ Extension manifest
├── language-configuration.json     ✅ Language config
└── README.md                       ✅ Documentation
```

## Features Implemented

- ✅ Syntax highlighting with multiple scopes
- ✅ Validation (dead ends, unreachable, missing events)
- ✅ Hover providers for effects and transitions
- ✅ CodeLens for quick actions
- ✅ Commands in command palette
- ✅ Editor title buttons
- ✅ Diagnostic messages in Problems panel
- ⏳ Graph visualization (placeholder ready)
- ⏳ Simulation mode (command registered)

Enjoy your new narrative design tool! 🚀

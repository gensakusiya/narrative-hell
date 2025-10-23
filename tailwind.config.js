/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/view/webview/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // VS Code colors
        'vscode-bg': 'var(--vscode-editor-background)',
        'vscode-fg': 'var(--vscode-editor-foreground)',
        'vscode-line': 'var(--vscode-editorLineNumber-foreground)',
      },
    },
  },
  plugins: [],
};

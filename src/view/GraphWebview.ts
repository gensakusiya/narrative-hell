import * as vscode from 'vscode';

export function getGraphWebviewContent(): string {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: var(--vscode-titleBar-activeForeground);
        }
        .info {
            background: var(--vscode-textBlockQuote-background);
            padding: 15px;
            border-left: 3px solid var(--vscode-textLink-foreground);
            margin: 20px 0;
        }
        .graph-placeholder {
            background: var(--vscode-editor-background);
            border: 2px dashed var(--vscode-panel-border);
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Story Flow Graph</h1>
        <div class="info">
            <strong>🚧 Coming Soon!</strong><br>
            This will show an interactive graph of your story flow.
        </div>
        <div class="graph-placeholder">
            <div>
                <p>Graph visualization will appear here</p>
                <p>Showing connections between events and choices</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

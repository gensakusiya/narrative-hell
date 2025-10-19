import * as vscode from 'vscode';
import { Beat } from '../types/beat';

export class GraphPanel {
  public static currentPanel: GraphPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    beats: Map<string, Beat>
  ) {
    const column = vscode.ViewColumn.Beside;

    if (GraphPanel.currentPanel) {
      GraphPanel.currentPanel._panel.reveal(column);
      GraphPanel.currentPanel.updateGraph(beats);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'narrativeGraph',
      'Story Graph',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: false,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
      }
    );

    GraphPanel.currentPanel = new GraphPanel(panel, extensionUri, beats);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    beats: Map<string, Beat>
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._panel.webview.html = this._getWebviewContent();

    this._panel.webview.onDidReceiveMessage(
      (message) => this._handleMessage(message),
      null,
      this._disposables
    );

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this.updateGraph(beats);
  }

  private _handleMessage(message: any) {
    switch (message.type) {
      case 'nodeClicked':
        this._jumpToBeat(message.beatId);
        break;
    }
  }

  private async _jumpToBeat(beatName: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // const document = editor.document;
    // const text = document.getText();
    // const lines = text.split('\n');

    console.log(`Jumping to beat: ${beatName}`);
  }

  private _getWebviewContent(): string {
    const scriptUri = this._panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
    );

    const reactFlowCss =
      'https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${reactFlowCss}">
    <title>Story Graph</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body, #root { 
        width: 100%; 
        height: 100vh; 
        overflow: hidden;
        background: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
      }
    </style>
    <script>
      window.messageQueue = [];
      window.addEventListener('message', (event) => {
        window.messageQueue.push(event.data);
      });
    </script>
</head>
<body>
    <div id="root"></div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
  }

  public dispose() {
    GraphPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  public updateGraph(beats: Map<string, Beat>) {
    const graphData = this._beatsToGraphData(beats);
    this._panel.webview.postMessage({
      type: 'updateGraph',
      data: graphData,
    });
  }

  private _beatsToGraphData(beats: Map<string, Beat>) {
    const nodes = Array.from(beats.values()).map((beat) => ({
      id: beat.name,
      label: beat.name,
      data: { label: beat.name },
    }));

    const edges = Array.from(beats.values()).flatMap((beat) =>
      beat.transitions.map((t) => ({
        id: `${beat.name}-${t.target}`,
        source: beat.name,
        target: t.target,
      }))
    );

    return { nodes, edges };
  }
}

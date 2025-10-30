import * as vscode from 'vscode';
import { Beat } from 'shared';

import { convertToGraphData } from './convert-to-graph';
import { getNonce, getUri } from './utils';

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

    console.log('[GraphPanel] ✅ Creating or showing graph panel', beats);

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

    console.log(`Jumping to beat: ${beatName}`);
  }

  private _getWebviewContent(): string {
    const scriptUri = getUri(this._panel.webview, this._extensionUri, [
      'dist',
      'webview',
      'webview.js',
    ]);

    const stylesUri = getUri(this._panel.webview, this._extensionUri, [
      'dist',
      'webview',
      'webview.css',
    ]);

    const nonce = getNonce();

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this._panel.webview.cspSource}; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>Todo</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
    `;
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
    const data = convertToGraphData(beats, new Map());

    this._panel.webview.postMessage({
      type: 'updateGraph',
      data,
    });
  }
}

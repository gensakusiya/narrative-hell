import * as vscode from 'vscode';
import { getGraphWebviewContent } from './view/GraphWebview';
import { validateDocument } from './diagnostics';

export function activate(context: vscode.ExtensionContext) {
  console.log('Narrative Hell extension is now active!');

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('nhell');

  if (vscode.window.activeTextEditor) {
    updateDiagnostics(
      vscode.window.activeTextEditor.document,
      diagnosticCollection
    );
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === 'nhell') {
        updateDiagnostics(editor.document, diagnosticCollection);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'nhell') {
        updateDiagnostics(event.document, diagnosticCollection);
      }
    })
  );

  const showGraphCommand = vscode.commands.registerCommand(
    'narrative-hell.showGraph',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'narrativeGraph',
        'Story Flow Graph',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getGraphWebviewContent();
    }
  );

  const validateCommand = vscode.commands.registerCommand(
    'narrative-hell.validate',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== 'nhell') {
        vscode.window.showWarningMessage('Please open a .nhell file first');
        return;
      }

      const issues = validateDocument(editor.document);
      if (issues.length === 0) {
        vscode.window.showInformationMessage('✅ No issues found!');
      } else {
        vscode.window.showWarningMessage(
          `Found ${issues.length} issues. Check Problems panel.`
        );
      }
    }
  );

  context.subscriptions.push(
    showGraphCommand,
    validateCommand,
    diagnosticCollection
  );

  vscode.languages.registerCodeLensProvider('nhell', {
    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
      const lenses: vscode.CodeLens[] = [];
      const text = document.getText();
      const eventRegex = /^===\s+(\w+)\s+===/gm;

      let match;
      while ((match = eventRegex.exec(text)) !== null) {
        const line = document.positionAt(match.index).line;
        const range = new vscode.Range(line, 0, line, match[0].length);

        if (match[1] !== 'metadata' && match[1] !== 'state') {
          lenses.push(
            new vscode.CodeLens(range, {
              title: '▶ Simulate from here',
              command: 'narrative-hell.simulate',
              arguments: [match[1]],
            })
          );
        }
      }

      return lenses;
    },
  });

  vscode.languages.registerHoverProvider('nhell', {
    provideHover(
      document: vscode.TextDocument,
      position: vscode.Position
    ): vscode.Hover | null {
      const line = document.lineAt(position).text;

      // Hover для эффектов
      const effectMatch = /~\s+(\w+)\s+([+-]?\d+)/.exec(line);
      if (effectMatch) {
        const [, stat, value] = effectMatch;
        const change = parseInt(value);
        const emoji = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
        return new vscode.Hover(
          `${emoji} **${stat}** will change by **${
            change > 0 ? '+' : ''
          }${change}**`
        );
      }

      // Hover для переходов
      const gotoMatch = /->\s+(\w+)/.exec(line);
      if (gotoMatch) {
        return new vscode.Hover(`🔀 Goes to event: **${gotoMatch[1]}**`);
      }

      return null;
    },
  });
}

function updateDiagnostics(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection
): void {
  if (document.languageId !== 'nhell') {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const issues = validateDocument(document);

  for (const issue of issues) {
    const diagnostic = new vscode.Diagnostic(
      issue.range,
      issue.message,
      issue.severity
    );
    diagnostics.push(diagnostic);
  }

  collection.set(document.uri, diagnostics);
}

export function deactivate() {
  console.log('Narrative Hell extension deactivated');
}

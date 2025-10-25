import * as vscode from 'vscode';
import { validateDocument } from './diagnostics';
import { DocumentStateManager } from './state/document-state-manager';
import { GraphPanel } from './panel';
import { Beat } from './types/beat';

const stateManager = new DocumentStateManager();

export function activate(context: vscode.ExtensionContext) {
  console.log('Narrative Hell extension is now active!');

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection('nhell');

  if (vscode.window.activeTextEditor) {
    updateDiagnostics(
      vscode.window.activeTextEditor.document,
      diagnosticCollection,
      stateManager.getBeats(vscode.window.activeTextEditor.document)
    );
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === 'nhell') {
        stateManager.updateBeats(editor.document);

        const beats = stateManager.getBeats(editor.document);

        updateDiagnostics(editor.document, diagnosticCollection, beats);

        GraphPanel.currentPanel?.updateGraph(beats);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'nhell') {
        stateManager.updateBeats(event.document);

        const beats = stateManager.getBeats(event.document);

        updateDiagnostics(event.document, diagnosticCollection, beats);

        if (GraphPanel.currentPanel) {
          GraphPanel.currentPanel.updateGraph(beats);
        } else {
          console.log('[Extension] GraphPanel not open, skipping update');
        }
      }
    })
  );

  const showGraphCommand = vscode.commands.registerCommand(
    'narrative-hell.showGraph',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const beats = stateManager.getBeats(editor.document);

      GraphPanel.createOrShow(context.extensionUri, beats);
    }
  );

  const validateCommand = vscode.commands.registerCommand(
    'narrative-hell.validate',
    () => {
      // todo: Implement manual validation trigger if needed
    }
  );

  context.subscriptions.push(
    showGraphCommand,
    validateCommand,
    diagnosticCollection
  );

  vscode.languages.registerCodeLensProvider('nhell', {
    provideCodeLenses(_document: vscode.TextDocument): vscode.CodeLens[] {
      const lenses: vscode.CodeLens[] = [];

      // todo: Add CodeLenses based on document content

      return lenses;
    },
  });

  vscode.languages.registerHoverProvider('nhell', {
    provideHover(
      _document: vscode.TextDocument,
      _position: vscode.Position
    ): vscode.Hover | null {
      // todo: Provide hover information based on line content

      return null;
    },
  });
}

function updateDiagnostics(
  document: vscode.TextDocument,
  collection: vscode.DiagnosticCollection,
  beats: Map<string, Beat>
): void {
  if (document.languageId !== 'nhell') {
    return;
  }

  const diagnostics: vscode.Diagnostic[] = [];
  const issues = validateDocument(beats, document.getText());

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

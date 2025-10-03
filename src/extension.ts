import * as vscode from 'vscode';

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

interface ValidationIssue {
  range: vscode.Range;
  message: string;
  severity: vscode.DiagnosticSeverity;
}

function validateDocument(document: vscode.TextDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const text = document.getText();
  const lines = text.split('\n');

  // Собираем все события и переходы
  const events = new Set<string>();
  const references = new Map<string, number[]>(); // event -> lines where it's referenced
  const eventLines = new Map<string, number>(); // event -> line number

  // Первый проход: собираем события
  const eventRegex = /^===\s+(\w+)\s+===/;
  lines.forEach((line, lineNum) => {
    const match = eventRegex.exec(line);
    if (match && match[1] !== 'metadata' && match[1] !== 'state') {
      events.add(match[1]);
      eventLines.set(match[1], lineNum);
    }
  });

  // Второй проход: собираем ссылки
  lines.forEach((line, lineNum) => {
    const gotoMatch = /->\s+(\w+)/.exec(line);
    if (gotoMatch) {
      const target = gotoMatch[1];
      if (!references.has(target)) {
        references.set(target, []);
      }
      references.get(target)!.push(lineNum);
    }
  });

  // Проверка: несуществующие переходы
  for (const [target, referenceLines] of references.entries()) {
    if (target !== 'END' && !events.has(target)) {
      for (const lineNum of referenceLines) {
        issues.push({
          range: new vscode.Range(lineNum, 0, lineNum, lines[lineNum].length),
          message: `Event '${target}' does not exist`,
          severity: vscode.DiagnosticSeverity.Error,
        });
      }
    }
  }

  // Проверка: недостижимые события
  for (const [event, lineNum] of eventLines.entries()) {
    if (event !== 'start' && event !== 'END' && !references.has(event)) {
      issues.push({
        range: new vscode.Range(lineNum, 0, lineNum, lines[lineNum].length),
        message: `Event '${event}' is never referenced (unreachable)`,
        severity: vscode.DiagnosticSeverity.Warning,
      });
    }
  }

  // Проверка: события без выборов (мертвые концы)
  let currentEvent: string | null = null;
  let hasChoices = false;
  let eventStartLine = 0;

  lines.forEach((line, lineNum) => {
    const eventMatch = eventRegex.exec(line);
    if (eventMatch) {
      // Проверяем предыдущее событие
      if (
        currentEvent &&
        !hasChoices &&
        currentEvent !== 'END' &&
        currentEvent !== 'metadata' &&
        currentEvent !== 'state'
      ) {
        issues.push({
          range: new vscode.Range(
            eventStartLine,
            0,
            eventStartLine,
            lines[eventStartLine].length
          ),
          message: `Event '${currentEvent}' has no choices (dead end)`,
          severity: vscode.DiagnosticSeverity.Warning,
        });
      }

      currentEvent = eventMatch[1];
      eventStartLine = lineNum;
      hasChoices = false;
    }

    if (/^\*\s+\[/.test(line) || /->/.test(line)) {
      hasChoices = true;
    }
  });

  return issues;
}

function getGraphWebviewContent(): string {
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

export function deactivate() {
  console.log('Narrative Hell extension deactivated');
}

import * as vscode from 'vscode';
import { Beat } from 'shared';

export function validateDeadEnds(
  beats: Map<string, Beat>,
  onError: (diagnostic: vscode.Diagnostic) => void
) {
  for (const [name, value] of beats.entries()) {
    if (Object.keys(value.goto).length === 0) {
      const range = new vscode.Range(
        new vscode.Position(value.startLine, 0),
        new vscode.Position(value.startLine, value.lines[0].length)
      );

      const diagnostic = new vscode.Diagnostic(
        range,
        `Dead-end detected: Beat "${name}" has no transitions or outgoing paths.`,
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.code = 'dead-end';
      onError(diagnostic);
    }
  }
}

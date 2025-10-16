import * as vscode from 'vscode';
import { Beat } from '../types/beat';
import { END_BEAT, START_BEAT } from '../consts';

export function validateUnreachableBeats(
  beats: Map<string, Beat>,
  onError: (diagnostic: vscode.Diagnostic) => void
) {
  let referencedBeats = new Set<string>();

  for (const [_, beat] of beats.entries()) {
    referencedBeats = new Set([...referencedBeats, ...Object.keys(beat.goto)]);
  }

  for (const [name, value] of beats.entries()) {
    if (name === START_BEAT || name === END_BEAT || referencedBeats.has(name)) {
      continue;
    }

    const range = new vscode.Range(
      new vscode.Position(value.startLine, 0),
      new vscode.Position(value.startLine, value.lines[0].length)
    );

    const diagnostic = new vscode.Diagnostic(
      range,
      `Beat '${name}' is never referenced (unreachable)`,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostic.code = 'unreachable-beat';

    onError(diagnostic);
  }
}

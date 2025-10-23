import * as vscode from 'vscode';
import { BeatPartial } from '../types/beat';

export function validateDuplicateBeats(
  beats: BeatPartial[],
  onError: (diagnostic: vscode.Diagnostic) => void
) {
  const seenBeats = new Set<string>();
  for (const beat of beats) {
    if (seenBeats.has(beat.name)) {
      const range = new vscode.Range(
        new vscode.Position(beat.lineIndex, 0),
        new vscode.Position(beat.lineIndex, beat.line.length)
      );

      const diagnostic = new vscode.Diagnostic(
        range,
        `Beat '${beat.name}' is defined more than once (duplicate)`,
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.code = 'duplicate-beat';

      onError(diagnostic);
    } else {
      seenBeats.add(beat.name);
    }
  }
}

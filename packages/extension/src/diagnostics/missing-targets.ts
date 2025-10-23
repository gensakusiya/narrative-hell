import * as vscode from 'vscode';

import { END_BEAT, GOTO_SYMBOL, gotoRegex } from '../consts';
import { Beat } from '../types/beat';

export function validateMissingTargets(
  beats: Map<string, Beat>,
  onError: (diagnostic: vscode.Diagnostic) => void
) {
  for (const [name, value] of beats.entries()) {
    const allGoto = Object.keys(value.goto);

    for (const target of allGoto) {
      if (target !== END_BEAT && !beats.has(target)) {
        const indexInBeat = value.goto[target].lineIndex;
        const line = value.lines[indexInBeat];

        const lineNum = value.startLine + indexInBeat;
        const gotoMatch = gotoRegex.exec(line);
        const range = new vscode.Range(
          new vscode.Position(lineNum, gotoMatch ? gotoMatch.index : 0),
          new vscode.Position(
            lineNum,
            gotoMatch ? gotoMatch.index + gotoMatch[0].length : 0
          )
        );

        const diagnostic = new vscode.Diagnostic(
          range,
          `Beat '${target}' does not exist`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.code = 'missing-target';

        onError(diagnostic);
      }
    }
  }
}

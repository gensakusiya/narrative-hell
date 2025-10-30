import * as vscode from 'vscode';
import { Beat } from 'shared';

import { validateMissingTargets } from './missing-targets';
import { validateUnreachableBeats } from './unreachable-beats';
import { getBeatsInOrder } from '../parser/collect-beats';
import { validateDeadEnds } from './dead-ends';
import { validateDuplicateBeats } from './duplicates';

export function validateDocument(
  beats: Map<string, Beat>,
  documentText: string
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const lines = documentText.split(/\n/);

  const beatsInOrder = getBeatsInOrder(lines);

  // ❌ CHECK 1: MISSING_TARGET
  validateMissingTargets(beats, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ❌ CHECK 2: DEAD_ENDS
  validateDeadEnds(beats, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ❌ CHECK 3: DUPLICATE_BEATS
  validateDuplicateBeats(beatsInOrder, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ⚠️ CHECK 3: Unreachable beats
  validateUnreachableBeats(beats, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  return diagnostics;
}

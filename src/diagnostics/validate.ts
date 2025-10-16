import * as vscode from 'vscode';
import { validateMissingTargets } from './missing-targets';
import { validateUnreachableBeats } from './unreachable-beats';
import { collectBeats, getBeatsInOrder } from '../parser/collect-beats';
import { validateDeadEnds } from './dead-ends';
import { validateDuplicateBeats } from './duplicates';

export function validateDocument(
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split(/\n/);

  const beatsMap = collectBeats(lines);
  const beatsInOrder = getBeatsInOrder(lines);

  // ❌ CHECK 1: MISSING_TARGET
  validateMissingTargets(beatsMap, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ❌ CHECK 2: DEAD_ENDS
  validateDeadEnds(beatsMap, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ❌ CHECK 3: DUPLICATE_BEATS
  validateDuplicateBeats(beatsInOrder, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  // ⚠️ CHECK 3: Unreachable beats
  validateUnreachableBeats(beatsMap, (diagnosticError: vscode.Diagnostic) =>
    diagnostics.push(diagnosticError)
  );

  return diagnostics;
}

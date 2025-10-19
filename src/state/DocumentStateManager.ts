import * as vscode from 'vscode';
import { Beat } from '../types/beat';
import { collectBeats } from '../parser/collect-beats';

export class DocumentStateManager {
  private states = new Map<string, Map<string, Beat>>();

  updateBeats(document: vscode.TextDocument): void {
    const uri = document.uri.toString();
    const lines = document.getText().split(/\r?\n/);
    const beats = collectBeats(lines);
    this.states.set(uri, beats);
  }

  getBeats(document: vscode.TextDocument): Map<string, Beat> {
    const uri = document.uri.toString();
    return this.states.get(uri) || new Map();
  }

  clearBeats(document: vscode.TextDocument): void {
    const uri = document.uri.toString();
    this.states.delete(uri);
  }

  getAllDocuments(): Map<string, Map<string, Beat>> {
    return this.states;
  }

  clear(): void {
    this.states.clear();
  }
}

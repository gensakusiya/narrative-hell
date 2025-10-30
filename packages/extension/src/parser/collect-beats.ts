import { Beat, Transition, Effect, Goto, BeatPartial } from 'shared';
import {
  beatRegex,
  transitionRegex,
  gotoRegex,
  effectRegex,
  metadataRegex,
  EFFECT_SYMBOL,
  COMMENT_END_SYMBOL,
  COMMENT_START_SYMBOL,
} from '../consts';

export function collectBeats(lines: string[]): Map<string, Beat> {
  const beats = new Map<string, Beat>();
  let currentBeat: Beat | null = null;

  for (const [lineNum, line] of lines.entries()) {
    const beatMatch = beatRegex.exec(line);

    if (beatMatch) {
      if (currentBeat) {
        currentBeat.endLine = lineNum - 1;
        parseBeatContent(currentBeat);
        beats.set(currentBeat.name, currentBeat);
      }

      const beatName = beatMatch[1];

      if (beats.has(beatName)) {
        // Duplicate beat name found, skip adding this beat
        currentBeat = null;
        continue;
      }

      currentBeat = {
        name: beatName,
        startLine: lineNum,
        endLine: lineNum,
        lines: [line],
        transitions: [],
        effects: [],
        metadata: {},
        goto: {},
      };
    } else if (currentBeat) {
      currentBeat.lines.push(line);
      currentBeat.endLine = lineNum;
    }
  }

  if (currentBeat) {
    currentBeat.endLine = lines.length - 1;
    parseBeatContent(currentBeat);
    beats.set(currentBeat.name, currentBeat);
  }

  return beats;
}

/**
 * return Beats in the order they appear in the document
 */
export function getBeatsInOrder(lines: string[]): BeatPartial[] {
  const beats: BeatPartial[] = [];

  for (const [lineNum, line] of lines.entries()) {
    const beatMatch = beatRegex.exec(line);

    if (beatMatch) {
      const beatName = beatMatch[1];
      beats.push({
        name: beatName,
        lineIndex: lineNum,
        line,
      });
    }
  }

  return beats;
}

function parseBeatContent(beat: Beat): void {
  let currentTransition: Transition | null = null;

  // Skip first line (<<< >>>)
  for (let i = 1; i < beat.lines.length; i++) {
    const line = beat.lines[i];
    const trimmed = line.trim();

    // Empty or comment line
    if (
      !trimmed ||
      trimmed.startsWith(COMMENT_START_SYMBOL) ||
      trimmed.startsWith(COMMENT_END_SYMBOL)
    ) {
      continue;
    }

    // Metadata: @ key: value
    const metadataMatch = metadataRegex.exec(line);
    if (metadataMatch) {
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmed.slice(1, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();
        beat.metadata[key] = value;
      }

      continue;
    }

    // Transition: *[label]
    const transitionMatch = transitionRegex.exec(line);
    if (transitionMatch) {
      if (currentTransition) {
        beat.transitions.push(currentTransition);
      }

      // get Transition name *[label]
      const labelMatch = /\*\s*\[(.*?)\]/.exec(line);
      const label = labelMatch ? labelMatch[1] : '';

      // get Goto target if exists
      const gotoMatch = gotoRegex.exec(line);
      const target: Goto | null = gotoMatch
        ? { beat: gotoMatch[1], lineIndex: i }
        : null;

      if (target) {
        beat.goto[target.beat] = target;
      }

      currentTransition = {
        label,
        lineIndex: i,
        effects: [],
        target,
      };

      continue;
    }

    // Effect: ~ variable value
    const effectMatch = effectRegex.exec(line);
    if (effectMatch) {
      const effect = parseEffect(line, i);
      if (effect) {
        if (currentTransition) {
          currentTransition.effects.push(effect);
        } else {
          beat.effects.push(effect);
        }
      }
      continue;
    }

    // Goto: -> target
    const gotoMatch = gotoRegex.exec(line);
    if (gotoMatch) {
      const target = {
        beat: gotoMatch[1],
        lineIndex: i,
      };

      beat.goto[target.beat] = target;

      continue;
    }

    if (trimmed) {
      if (currentTransition) {
        beat.transitions.push(currentTransition);
        currentTransition = null;
      }
    }
  }

  if (currentTransition) {
    beat.transitions.push(currentTransition);
  }
}

function parseEffect(line: string, lineIndex: number): Effect | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith(EFFECT_SYMBOL)) {
    return null;
  }

  const content = trimmed.slice(1).trim();

  // ~ variable +10 or ~ variable -5
  const match = /^(\w+)\s*([+\-]?)(.+)$/.exec(content);
  if (match) {
    const [, variable, operator, valueStr] = match;

    return {
      variable,
      operator: operator || undefined,
      value: parseValue(valueStr.trim()),
      lineIndex,
    };
  }

  return null;
}

function parseValue(str: string): string | number | boolean {
  // Boolean
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }

  // Number
  const num = Number(str);
  if (!isNaN(num)) {
    return num;
  }

  // String
  return str;
}

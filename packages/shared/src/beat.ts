interface Partial {
  lineIndex: number;
}

export interface Effect extends Partial {
  variable: string;
  operator?: string; // '+' | '-' | ':'
  value: string | number | boolean;
}

export interface Transition extends Partial {
  label: string;
  target: Goto | null;
  effects: Effect[];
}

export interface Goto extends Partial {
  beat: string;
}

export interface Beat {
  name: string;
  startLine: number;
  endLine: number;
  lines: string[];

  metadata: Record<string, string>;
  transitions: Transition[];
  effects: Effect[];
  goto: Record<string, Goto>;
}

export interface BeatPartial extends Partial {
  name: string;
  line: string;
}

export interface BeatWithValidation extends Beat, Record<string, unknown> {
  isStart: boolean;
  isEnd: boolean;

  isUnreachable: boolean;
  hasError: boolean;
}

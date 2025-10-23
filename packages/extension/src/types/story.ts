export type NHellEventType = 'start' | 'event' | 'end';

export type NHellEffectType = 'stat' | 'flag' | 'promise';

export interface NHellEvent {
  id: string;
  label: string;
  lineNumber: number;
  transitions: string[];
  type: NHellEventType;
  hasDialogue: boolean;

  choices: NHellChoice[];
  effects: NHellEffect[];
}

export interface NHellChoice {
  text: string;
  target: string;
  effects: NHellEffect[];
}

export interface NHellEffect {
  type: NHellEffectType;
  variable: string;
  value?: number;
}

export interface StoryMetadata {
  id?: string;
  author?: string;
  version?: string;
  tags?: string[];
}

export interface StoryData {
  metadata: StoryMetadata;
  events: Map<string, NHellEvent>;
  state: Record<string, number | boolean>; // todo: think about complex state types
}

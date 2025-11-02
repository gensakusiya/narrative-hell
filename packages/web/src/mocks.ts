import type { BeatWithValidation, Transition } from 'shared';

export const mockGraphData = {
  nodes: [
    {
      id: 'start',
      type: 'beat',
      position: { x: 0, y: 0 },
      data: {
        name: 'Start Node',
        transitions: [] as Transition[],
        goto: {},
        isStart: true,
      } as BeatWithValidation,
    },
    {
      id: '1',
      type: 'beat',
      position: { x: 250, y: 0 },
      data: {
        name: 'Sample Beat Node',
        transitions: [] as Transition[],
        goto: {},
      } as BeatWithValidation,
    },
    {
      id: '2',
      type: 'beat',
      position: { x: 100, y: 200 },
      data: {
        name: 'Another Beat Node',
        transitions: [] as Transition[],
        goto: {},
      } as BeatWithValidation,
    },
    {
      id: '3',
      type: 'beat',
      position: { x: 0, y: 100 },
      data: {
        name: 'Third Beat Node',
        isUnreachable: true,
        transitions: [] as Transition[],
        goto: {},
      } as BeatWithValidation,
    },
    {
      id: '4',
      type: 'beat',
      position: { x: 600, y: 100 },
      data: {
        name: 'Fourth Beat Node',
        hasError: true,
        transitions: [] as Transition[],
        goto: {},
      } as BeatWithValidation,
    },
    {
      id: 'end',
      type: 'beat',
      position: { x: 800, y: 100 },
      data: {
        name: 'End Node',
        isEnd: true,
        transitions: [] as Transition[],
        goto: {},
      } as BeatWithValidation,
    },
  ],
  edges: [
    {
      id: 'e-start-1',
      source: 'start',
      target: '1',
    },
    {
      id: 'e-1-2',
      source: '1',
      target: '2',
    },
    {
      id: 'e-1-3',
      source: '1',
      target: '3',
    },
    {
      id: 'e-3-2',
      source: '3',
      target: '2',
    },
  ],
};

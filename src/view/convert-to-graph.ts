import { Beat } from '../types/beat';
import { GraphData, Node } from './view';

function convertBeatToNode(beat: Beat): Node {
  return {
    id: beat.name,
    type: 'beatNode',
    data: {
      ...beat,
    },
    position: { x: Math.random() * 800, y: Math.random() * 600 },
  };
}

export function convertToGraphData(
  beats: Map<string, Beat>,
  _validation: Map<string, object>
): GraphData {
  const nodes = Array.from(beats.values()).map(convertBeatToNode);

  return {
    nodes,
  };
}

import { Beat, GraphData, GraphNode } from 'shared';

function convertBeatToNode(beat: Beat): GraphNode<Beat> {
  const nodeData: Beat = {
    ...beat,
  };

  return {
    id: beat.name,
    type: 'beatNode',
    data: nodeData,
    position: { x: Math.random() * 800, y: Math.random() * 600 },
  };
}

export function convertToGraphData(
  beats: Map<string, Beat>,
  _validation: Map<string, object>
): GraphData<Beat> {
  const nodes = Array.from(beats.values()).map(convertBeatToNode);

  return {
    nodes,
    edges: [],
  };
}

import {
  ReactFlow,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Edge,
  type Node,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { BeatNode } from './node';
import type { BeatWithValidation } from 'shared';

const nodeType = {
  beat: BeatNode,
};

export interface GraphProps {
  nodes: Node<BeatWithValidation>[];
  edges: Edge<BeatWithValidation>[];

  onNodesChange?: (changes: NodeChange<Node<BeatWithValidation>>[]) => void;
  onEdgesChange?: (changes: EdgeChange<Edge<BeatWithValidation>>[]) => void;
  onConnect?: (connection: Connection) => void;
}

export default function Graph({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: GraphProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeType}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

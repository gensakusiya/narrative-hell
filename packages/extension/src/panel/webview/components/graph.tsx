import React, { useCallback, useState } from 'react';

import {
  Background,
  Controls,
  ReactFlow,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import { BeatNode } from './node';

interface GraphProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const nodeType = {
  beatNode: BeatNode,
};

export function Graph({
  initialNodes,
  initialEdges,
}: GraphProps): React.ReactElement<GraphProps> {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const handleNodeChange = useCallback((changedNodes: NodeChange[]) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changedNodes, nodesSnapshot));
  }, []);

  const handleEdgeChange = useCallback((changedEdges: EdgeChange[]) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changedEdges, edgesSnapshot));
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);

  return (
    <ReactFlow
      colorMode="system"
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeType}
      onNodesChange={handleNodeChange}
      onEdgesChange={handleEdgeChange}
      onConnect={handleConnect}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
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
import type { GraphNode, BeatWithValidation } from 'shared';

import { BeatNode } from './node';

const nodeType = {
  beat: BeatNode,
};

export default function Graph() {
  const [nodes, setNodes] = useState<GraphNode<BeatWithValidation>[]>([
    {
      id: 'start',
      type: 'beat',
      position: { x: 0, y: 0 },
      data: { name: 'Start Node', isStart: true } as BeatWithValidation,
    },
    {
      id: '1',
      type: 'beat',
      position: { x: 250, y: 0 },
      data: { name: 'Sample Beat Node' } as BeatWithValidation,
    },
    {
      id: '2',
      type: 'beat',
      position: { x: 100, y: 200 },
      data: { name: 'Another Beat Node' } as BeatWithValidation,
    },
    {
      id: '3',
      type: 'beat',
      position: { x: 0, y: 100 },
      data: {
        name: 'Third Beat Node',
        isUnreachable: true,
      } as BeatWithValidation,
    },
    {
      id: '4',
      type: 'beat',
      position: { x: 600, y: 100 },
      data: {
        name: 'Fourth Beat Node',
        hasError: true,
      } as BeatWithValidation,
    },
    {
      id: 'end',
      type: 'beat',
      position: { x: 800, y: 100 },
      data: { name: 'End Node', isEnd: true } as BeatWithValidation,
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === 'updateGraph' && message.data) {
        const graphData = message.data;

        console.log('[Graph] Received graph data:', graphData);

        if (graphData.nodes) {
          setNodes(graphData.nodes);
        }

        if (graphData.edges) {
          setEdges(graphData.edges);
        }

        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#ffffff',
        }}
      >
        <p style={{ fontSize: '18px' }}>⏳ Loading story graph...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        colorMode="dark"
        nodes={nodes as unknown as Node[]}
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

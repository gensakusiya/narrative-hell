import { useCallback, useEffect, useState } from 'react';
import {
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import type { BeatWithValidation, GraphData } from 'shared';

import { mockGraphData } from './mocks';
import Graph from './graph';

const initNodes = import.meta.env.PROD
  ? ([] as Node<BeatWithValidation>[])
  : (mockGraphData.nodes as unknown as Node<BeatWithValidation>[]);
const initEdges = import.meta.env.PROD
  ? ([] as Edge<BeatWithValidation>[])
  : (mockGraphData.edges as unknown as Edge<BeatWithValidation>[]);

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<BeatWithValidation>>(initNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge<BeatWithValidation>>(initEdges);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === 'updateGraph' && message.data) {
        const graphData = message.data as GraphData<BeatWithValidation>;

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
  }, [setEdges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
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
    <Graph
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    />
  );
}

export default App;

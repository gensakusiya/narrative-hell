import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Graph } from './components/graph';
import { Window } from './graph';
import { Node, Edge, GraphData } from '../view';

import './globals.css';

const GraphApp = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queue = (window as unknown as Window).messageQueue || [];
    for (const message of queue) {
      if (message.type === 'updateGraph') {
        console.log('[Webview] ✅ Init graph data from queue', message.data);
        setNodes(message.data.nodes);
        setEdges([]);
        setIsLoading(false);
      }
    }

    const handleMessage = (event: any) => {
      const message = event.data;

      if (message.type === 'updateGraph') {
        console.log('[Webview] ✅ Received graph update');
        handleGraphUpdate(message.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGraphUpdate = useCallback((graphData: GraphData) => {
    setNodes(graphData.nodes);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <p>⏳ Loading graph...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Graph initialNodes={nodes} initialEdges={edges} />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<GraphApp />);
}

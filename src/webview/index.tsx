import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const GraphApp = () => {
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    const queue = (window as any).messageQueue || [];
    for (const message of queue) {
      if (message.type === 'updateGraph') {
        setGraphData(message.data);
      }
    }

    const handleMessage = (event: any) => {
      const message = event.data;

      if (message.type === 'updateGraph') {
        setGraphData(message.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!graphData) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>📊 Narrative Graph</h1>
        <p>⏳ Waiting for graph data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Narrative Graph</h1>
      <div>
        <h2>Nodes: {graphData.nodes?.length || 0}</h2>
        {graphData.nodes && graphData.nodes.length > 0 ? (
          <ul>
            {graphData.nodes.map((node: any, index: number) => (
              <li key={`node-${index}-${node.id}`}>
                <strong>{node.label || node.id}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No nodes</p>
        )}

        <h2>Edges: {graphData.edges?.length || 0}</h2>
        {graphData.edges && graphData.edges.length > 0 ? (
          <ul>
            {graphData.edges.map((edge: any, index: number) => (
              <li key={`edge-${index}-${edge.source}-${edge.target}`}>
                <code>{edge.source}</code> → <code>{edge.target}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p>No edges</p>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<GraphApp />);
}

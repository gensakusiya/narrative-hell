export interface GraphXYPosition {
  x: number;
  y: number;
}

export interface GraphNode<T extends object> {
  id: string;
  type: string;

  position: GraphXYPosition;

  data: T;

  hidden?: boolean;
  selected?: boolean;
}

export interface GraphEdge<T extends object> {
  id: string;

  source: string;
  target: string;

  data?: T;
  type?: string;
  hidden?: boolean;
  selected?: boolean;
  animated?: boolean;
}

export interface GraphData<T extends object> {
  nodes: GraphNode<T>[];
  edges: GraphEdge<T>[];
}

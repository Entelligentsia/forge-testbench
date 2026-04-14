export interface Node {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Edge {
  from: string;
  to: string;
  label?: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

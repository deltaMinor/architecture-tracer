import { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
  Background,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import {
  CommandBox,
} from "./components/ui/commandBox";
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } },
];
 
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];
 
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};
 
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};
 
const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('drag event', node.data);
};
 
export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
 
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
 
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <Background />
        <Panel
          className="flex w-full gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
          position="bottom-center"
        >
          <CommandBox />
        </Panel>
    </ReactFlow>
  );
}
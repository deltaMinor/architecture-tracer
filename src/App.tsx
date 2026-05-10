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
import CustomNode from "./components/ui/customNode";
import '@xyflow/react/dist/style.css';

const nodeTypes = { customNode: CustomNode };

const initialNodes: Node[] = [
  { id: 'n#1', type: 'customNode', data: { label: 'Node 1', sourceCount: 1}, position: { x: 5, y: 5 } },
  { id: 'n#2', type: 'customNode', data: { label: 'Node 2', targetCount: 1 }, position: { x: 5, y: 100 } },
];
 
const initialEdges: Edge[] = [{ id: 'e#1', source: 'n#1', target: 'n#2' }];
 
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
      nodeTypes={nodeTypes}
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
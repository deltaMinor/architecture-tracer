import { useState, useCallback } from "react";
import {
  ReactFlow,
  useReactFlow,
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
} from "@xyflow/react";
import { Command } from "./components/command/command";
import { parseCommand } from "./components/command/commandParser";
import { CommandBox } from "./components/ui/commandBox";
import {
  ResponseBox,
  VALID_INPUT,
  INVALID_INPUT,
} from "./components/ui/responseBox";
import { TraceSidebar } from "#components/ui/traceSidebar";
import CustomNode from "./components/ui/customNode";
import "@xyflow/react/dist/style.css";
import { traceStep, ArchitectureState } from "#components/architectureState";

const nodeTypes = { customNode: CustomNode };

const initialNodes: Node[] = [
  {
    id: "n#1",
    type: "customNode",
    data: { label: "Node 1", sourceCount: 1, isHighlighted: true },
    position: { x: 5, y: 5 },
  },
  {
    id: "n#2",
    type: "customNode",
    data: { label: "Node 2", targetCount: 1 },
    position: { x: 5, y: 100 },
  },
];

const initialEdges: Edge[] = [{ id: "e#1", source: "n#1", target: "n#2" }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

/* Inner component of App where useReactFlow() can be called */
function AppInner() {
  const [responseText, setResponseText] = useState<string>("");
  const [responseStyle, setResponseStyle] = useState<string>("");

  const [traceSteps, setTraceSteps] = useState<traceStep[]>([]);
  const [currentlyTracing, setCurrentlyTracing] = useState<boolean>(false);

  const reactFlow = useReactFlow();
  const architectureState = new ArchitectureState(
    reactFlow,
    traceSteps,
    setTraceSteps,
    currentlyTracing,
    setCurrentlyTracing,
  );

  const handleCommand = useCallback((commandString: string) => {
    try {
      var newCommand: Command = parseCommand(commandString);
      setResponseText(newCommand.execute(architectureState));
      setResponseStyle(VALID_INPUT);
    } catch (error) {
      let errorMessage = "Invalid command.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setResponseText(errorMessage);
      setResponseStyle(INVALID_INPUT);
    }
  }, []);

  return (
    <>
      <Panel
        className="flex w-full gap-1 rounded-md bg-primary-foreground p-1 text-foreground"
        position="bottom-center"
      >
        <div className="flex flex-col w-full gap-2">
          <CommandBox handleInput={handleCommand} />
          <ResponseBox text={responseText} style={responseStyle} />
        </div>
      </Panel>
      <TraceSidebar architectureState={architectureState} />
    </>
  );
}

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
      <AppInner />
    </ReactFlow>
  );
}

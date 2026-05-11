import { ArchitectureState, traceStep } from "#components/architectureState";
import { Node, Edge } from "@xyflow/react";

export function makeNode(id: string, label: string, x = 0, y = 0): Node {
  return {
    id,
    type: "customNode",
    position: { x, y },
    data: { label, sourceCount: NaN, targetCount: NaN, isHighlighted: false },
  };
}

export function mockState({
  nodes = [] as Node[],
  edges = [] as Edge[],
  traceSteps = [] as traceStep[],
  currentlyTracing = false,
} = {}) {
  let internalNodes = [...nodes];
  let internalEdges = [...edges];

  const setNodes = vi.fn((fn: (prev: Node[]) => Node[]) => {
    internalNodes = fn(internalNodes);
  });
  const setEdges = vi.fn((fn: (prev: Edge[]) => Edge[]) => {
    internalEdges = fn(internalEdges);
  });
  const setSteps = vi.fn();
  const setCurrentStep = vi.fn();
  const setCurrentlyTracing = vi.fn();

  const reactFlow = {
    getNodes: () => internalNodes,
    getEdges: () => internalEdges,
    setNodes,
    setEdges,
  } as any;

  return new ArchitectureState(
    reactFlow,
    traceSteps,
    setSteps,
    setCurrentStep,
    currentlyTracing,
    setCurrentlyTracing,
  );
}
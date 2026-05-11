import { Edge, addEdge, Node, ReactFlowInstance } from "@xyflow/react";

export type traceStep = {
  nodeId: string;
  nodeName: string;
  description: string;
};

export class ArchitectureState {
  private reactFlow: ReactFlowInstance;
  private steps: traceStep[];
  private setSteps: React.Dispatch<React.SetStateAction<traceStep[]>>;
  private currentStep: number;
  private setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  private currentlyTracing: boolean;
  private setCurrentlyTracing: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    reactFlow: ReactFlowInstance,
    steps: traceStep[],
    setSteps: React.Dispatch<React.SetStateAction<traceStep[]>>,
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
    currentlyTracing: boolean,
    setCurrentlyTracing: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.reactFlow = reactFlow;
    this.steps = steps;
    this.setSteps = setSteps;
    this.currentStep = steps.length - 1;
    this.setCurrentStep = setCurrentStep;
    this.currentlyTracing = currentlyTracing;
    this.setCurrentlyTracing = setCurrentlyTracing;
  }

  isCurrentlyTracing() {
    return this.currentlyTracing;
  }

  hasNodeWithId(id: string) {
    return this.reactFlow.getNodes().filter((node) => node.id == id).length > 0;
  }

  getNodeWithId(id: string) {
    return this.reactFlow.getNodes().find((node) => node.id == id);
  }

  removeNodeWithId(id: string) {
    const toRemoveNode = this.getNodeWithId(id);
    if (toRemoveNode == undefined) {
      throw Error(`Node with id ${id} does not exist.`);
    }
    const index = this.reactFlow.getNodes().indexOf(toRemoveNode, 0);
    this.reactFlow.getNodes().splice(index, 1);
  }

  addNode(label: string) {
    if (this.currentlyTracing) {
      throw Error("Unable to add node during simulation trace.");
    }
    var newId = 1;
    var position = { x: 0, y: 0 };
    for (var node of this.reactFlow.getNodes()) {
      if (node.id == "n#" + newId.toString()) {
        newId += 1;
      }
      position.x += node.position.x;
      position.y += node.position.y;
    }
    var nodeCount = this.reactFlow.getNodes().length;
    const newNode = {
      id: "n#" + newId.toString(),
      type: "customNode",
      position: { x: position.x / nodeCount, y: position.y / nodeCount },
      data: { label: label },
    };
    this.reactFlow.setNodes((prev) => [...prev, newNode]);
    return newNode;
  }

  replaceNodeWithId(id: string, replacement: Node) {
    this.reactFlow.setNodes((nds) =>
      nds.map((node) => {
        if (node.id == id) {
          return replacement;
        }
        return node;
      }),
    );
  }

  editNodeWithId(id: string, map: (node: Node) => Node) {
    const toReplaceNode = this.getNodeWithId(id);
    if (toReplaceNode == undefined) {
      throw Error(`Node with id ${id} does not exist.`);
    }
    const newNode = map(toReplaceNode);
    this.replaceNodeWithId(id, newNode);
  }

  setHighlightOfNodeWithId(id: string, toHighlight: boolean) {
    const setHighlightMap = (node: Node) => ({
      id: node.id,
      type: "customNode",
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: node.data.label,
        sourceCount: node.data.sourceCount,
        targetCount: node.data.targetCount,
        isHighlighted: toHighlight,
      },
    });
    this.editNodeWithId(id, setHighlightMap);
  }

  incrementSourceCountOfNodeWithId(id: string, change: number) {
    const setHighlightMap = (node: Node) => ({
      id: node.id,
      type: "customNode",
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: node.data.label,
        sourceCount: isNaN(node.data.sourceCount as number)
          ? change
          : (node.data.sourceCount as number) + change,
        targetCount: node.data.targetCount,
        isHighlighted: node.data.isHighlighted,
      },
    });
    this.editNodeWithId(id, setHighlightMap);
  }

  incrementTargetCountOfNodeWithId(id: string, change: number) {
    const setHighlightMap = (node: Node) => ({
      id: node.id,
      type: "customNode",
      position: { x: node.position.x, y: node.position.y },
      data: {
        label: node.data.label,
        sourceCount: node.data.sourceCount,
        targetCount: isNaN(node.data.targetCount as number)
          ? change
          : (node.data.targetCount as number) + change,
        isHighlighted: node.data.isHighlighted,
      },
    });
    this.editNodeWithId(id, setHighlightMap);
  }

  hasEdgeWithId(id: string) {
    return this.reactFlow.getEdges().filter((edge) => edge.id == id).length > 0;
  }

  getEdgeWithId(id: string) {
    return this.reactFlow.getEdges().find((edge) => edge.id == id);
  }

  removeEdgeWithId(id: string) {
    const toRemoveEdge = this.getEdgeWithId(id);
    if (toRemoveEdge == undefined) {
      throw Error(`Node with id ${id} does not exist.`);
    }
    const index = this.reactFlow.getEdges().indexOf(toRemoveEdge, 0);
    this.reactFlow.getEdges().splice(index, 1);
  }

  addEdge(source: string, target: string) {
    const similarEdges = this.getEdgesWithNodeIds(source, target);
    if (similarEdges.length > 0) {
      throw Error(edgeToString(similarEdges[0], this) + " already exists!");
    }
    var newId = 1;
    for (var edge of this.reactFlow.getEdges()) {
      if (edge.id == "e#" + newId.toString()) {
        newId += 1;
      }
    }
    const newEdge = {
      id: "e#" + newId.toString(),
      source: source,
      target: target,
    };
    this.reactFlow.setEdges((prev) => addEdge(newEdge, prev));
    this.incrementSourceCountOfNodeWithId(source, 1);
    this.incrementTargetCountOfNodeWithId(target, 1);
    return newEdge;
  }

  getEdgesWithNodeId(id: string) {
    return this.reactFlow
      .getEdges()
      .filter((edge) => edge.source == id || edge.target == id);
  }

  getEdgesWithNodeIds(source: string, target: string) {
    return this.reactFlow
      .getEdges()
      .filter((edge) => edge.source == source && edge.target == target);
  }

  getCurrentStepNumber() {
    return this.currentStep;
  }

  getCurrentStep() {
    if (this.currentlyTracing) {
      return this.steps[this.currentStep];
    }
    return undefined;
  }

  beginTrace() {
    this.clearSteps();
    this.currentlyTracing = true;
    this.setCurrentlyTracing(true);
  }

  addStep(nodeId: string, description: string) {
    const node = this.getNodeWithId(nodeId);
    if (node == undefined) {
      throw Error(`Node with id ${nodeId} does not exist.`);
    }
    const nodeName = node.data.label as string;
    if (!this.currentlyTracing) {
      this.beginTrace();
    } else {
      const thisNodeId = (this.getCurrentStep() as traceStep).nodeId;
      if (thisNodeId == nodeId) {
        throw Error("Unable to trace to same node.");
      }
      if (
        this.getEdgesWithNodeId(thisNodeId).filter(
          (edge) => edge.source == nodeId || edge.target == nodeId,
        ).length == 0
      ) {
        throw Error(
          `Node ${this.getNodeWithId(thisNodeId)?.data.label}(id: ${thisNodeId}) is not connected to Node ${this.getNodeWithId(nodeId)?.data.label}(id: ${nodeId}).`,
        );
      }
      this.setHighlightOfNodeWithId(this.steps[this.currentStep].nodeId, false);
    }
    this.steps = [...this.steps, { nodeId, nodeName, description }];
    this.setSteps(this.steps);
    this.currentStep += 1;
    this.setCurrentStep(this.currentStep);
    this.setHighlightOfNodeWithId(this.steps[this.currentStep].nodeId, true);
  }

  clearSteps() {
    this.steps = [];
    this.setSteps([]);
    this.currentStep = -1;
    this.setCurrentStep(this.currentStep);
  }

  endTrace() {
    this.setHighlightOfNodeWithId(this.steps[this.currentStep].nodeId, false);
    this.currentlyTracing = false;
    this.setCurrentlyTracing(false);
  }
}

export function nodeToString(node: Node | undefined) {
  if (node == undefined) {
    return "";
  }
  return `Node ${node.id}(${node.data.label})`;
}

export function edgeToString(edge: Edge, architectureState: ArchitectureState) {
  var sourceNode: string;
  var targetNode: string;
  if (architectureState.hasNodeWithId(edge.source)) {
    sourceNode = nodeToString(architectureState.getNodeWithId(edge.source));
  } else {
    sourceNode = "Node " + edge.source;
  }
  if (architectureState.hasNodeWithId(edge.target)) {
    targetNode = nodeToString(architectureState.getNodeWithId(edge.target));
  } else {
    targetNode = "Node " + edge.target;
  }
  return `Edge connecting ${sourceNode} to ${targetNode}`;
}

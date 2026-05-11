import { useState } from "react";
import { Node, ReactFlowInstance } from "@xyflow/react";

export type traceStep = {
  nodeId: string;
  description: string;
};

export class ArchitectureState {
  private reactFlow: ReactFlowInstance;
  private steps: traceStep[];
  private setSteps: React.Dispatch<React.SetStateAction<traceStep[]>>;
  private currentStep: number;
  private currentlyTracing: boolean;
  private setCurrentlyTracing: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    reactFlow: ReactFlowInstance,
    steps: traceStep[],
    setSteps: React.Dispatch<React.SetStateAction<traceStep[]>>,
    currentlyTracing: boolean,
    setCurrentlyTracing: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.reactFlow = reactFlow;
    this.steps = steps;
    this.setSteps = setSteps;
    this.currentStep = steps.length - 1;
    this.currentlyTracing = currentlyTracing;
    this.setCurrentlyTracing = setCurrentlyTracing;
  }

  getTraceSteps() {
    return this.steps;
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

  setHighlightOfNodeWithId(id: string, toHighlight: boolean) {
    const toReplaceNode = this.getNodeWithId(id);
    if (toReplaceNode == undefined) {
      throw Error(`Node with id ${id} does not exist.`);
    }
    const newNode = {
      id: toReplaceNode.id,
      type: "customNode",
      position: { x: toReplaceNode.position.x, y: toReplaceNode.position.y },
      data: {
        label: toReplaceNode.data.label,
        sourceCount: toReplaceNode.data.sourceCount,
        targetCount: toReplaceNode.data.targetCount,
        isHighlighted: toHighlight,
      },
    };
    this.replaceNodeWithId(id, newNode);
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

  getEdgesWithNodeId(id: string) {
    return this.reactFlow
      .getEdges()
      .filter((edge) => edge.source == id || edge.target == id);
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
    if (!this.hasNodeWithId(nodeId)) {
      throw Error(`Node with id ${nodeId} does not exist.`);
    }
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
    this.steps = [...this.steps, { nodeId, description }];
    this.setSteps(this.steps);
    this.currentStep += 1;
    this.setHighlightOfNodeWithId(this.steps[this.currentStep].nodeId, true);
  }

  clearSteps() {
    this.steps = [];
    this.setSteps([]);
    this.currentStep = -1;
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
  return `Node ${node.data.label}(id: ${node.id})`;
}

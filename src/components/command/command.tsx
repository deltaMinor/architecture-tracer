import { BuiltInEdge, useReactFlow, type Node } from "@xyflow/react";

import { ArchitectureState, nodeToString } from "#components/architectureState";

abstract class Command {
  abstract execute(architectureState: ArchitectureState): string;
}

function addNode(node: Node) {
  const { setNodes } = useReactFlow<Node, BuiltInEdge>();

  setNodes((prev) => [...prev, node]);
}

class AddNodeCommand extends Command {
  private newNodeLabel: string;

  constructor(label: string) {
    super();
    this.newNodeLabel = label;
  }

  execute(architectureState: ArchitectureState) {
    const newNode = architectureState.addNode(this.newNodeLabel);
    return nodeToString(newNode) + " added.";
  }
}

class TraceCommand extends Command {
  private nodeId: string;
  private description: string;

  constructor(id: string, description: string) {
    super();
    this.nodeId = id;
    this.description = description;
  }

  execute(architectureState: ArchitectureState) {
    const tracedNode = architectureState.getNodeWithId(this.nodeId);
    if(!architectureState.hasNodeWithId(this.nodeId) || tracedNode == undefined) {
      throw Error(`Node with id ${this.nodeId} does not exist.`);
    }
    const newTrace = !architectureState.isCurrentlyTracing();
    architectureState.addStep(this.nodeId, this.description);
    return newTrace
      ? `Beginning new simulation trace at ${nodeToString(tracedNode)}: ${this.description}`
      : `Moved to nodeToString(tracedNode): ${this.description}`;
  }
}

export { Command, AddNodeCommand, TraceCommand };

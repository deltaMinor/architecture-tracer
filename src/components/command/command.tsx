import { BuiltInEdge, useReactFlow, type Node } from "@xyflow/react";

import { ArchitectureState } from "#components/architectureState";

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
    return `Node ${this.newNodeLabel} added(id: ${newNode.id}).`;
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
    const newTrace = !architectureState.isCurrentlyTracing();
    architectureState.addStep(this.nodeId, this.description);
    return newTrace
      ? `Beginning new simulation trace at Node ${architectureState.getNodeWithId(this.nodeId)?.data.label}(id: ${this.nodeId}): ${this.description}`
      : `Moved to at Node ${architectureState.getNodeWithId(this.nodeId)?.data.label}(id: ${this.nodeId}): ${this.description}`;
  }
}

export { Command, AddNodeCommand, TraceCommand };

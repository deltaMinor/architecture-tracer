import { BuiltInEdge, useReactFlow, type Node } from "@xyflow/react";

import {
  ArchitectureState,
  edgeToString,
  nodeToString,
} from "#components/architectureState";

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

class AddEdgeCommand extends Command {
  private sourceNodeId: string;
  private targetNodeId: string;

  constructor(source: string, target: string) {
    super();
    this.sourceNodeId = source;
    this.targetNodeId = target;
  }

  execute(architectureState: ArchitectureState) {
    if (!architectureState.hasNodeWithId(this.sourceNodeId)) {
      throw Error(`Node with id ${this.sourceNodeId} does not exist.`);
    }
    if (!architectureState.hasNodeWithId(this.targetNodeId)) {
      throw Error(`Node with id ${this.targetNodeId} does not exist.`);
    }
    const newEdge = architectureState.addEdge(
      this.sourceNodeId,
      this.targetNodeId,
    );
    return edgeToString(newEdge, architectureState) + " added.";
  }
}

class DeleteNodeCommand extends Command {
  private nodeId: string;

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }

  execute(architectureState: ArchitectureState) {
    const toDeleteNode = architectureState.getNodeWithId(this.nodeId);
    if (toDeleteNode == undefined) {
      throw Error(`Node with id ${this.nodeId} does not exist.`);
    }
    const toDeleteNodeString = nodeToString(toDeleteNode);
    architectureState.removeNodeWithId(this.nodeId);
    return toDeleteNodeString + " deleted.";
  }
}

class DeleteEdgeCommand extends Command {
  private edgeId: string;

  constructor(edgeId: string) {
    super();
    this.edgeId = edgeId;
  }

  execute(architectureState: ArchitectureState) {
    const toDeleteEdge = architectureState.getEdgeWithId(this.edgeId);
    if (toDeleteEdge == undefined) {
      throw Error(`Edge with id ${this.edgeId} does not exist.`);
    }
    const toDeleteEdgeString = edgeToString(toDeleteEdge, architectureState);
    architectureState.removeEdgeWithId(this.edgeId);
    return toDeleteEdgeString + " deleted.";
  }
}

class ClearCommand extends Command {
  constructor() {
    super();
  }

  execute(architectureState: ArchitectureState) {
    if (architectureState.getNodeCount() == 0) {
      throw Error(`The architecture is already empty.`);
    }
    architectureState.removeAllNodes();
    return "All nodes deleted.";
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
    if (
      !architectureState.hasNodeWithId(this.nodeId) ||
      tracedNode == undefined
    ) {
      throw Error(`Node with id ${this.nodeId} does not exist.`);
    }
    const newTrace = !architectureState.isCurrentlyTracing();
    architectureState.addStep(this.nodeId, this.description);
    return newTrace
      ? `Beginning new simulation trace at ${nodeToString(tracedNode)}. Description: ${this.description}`
      : `Moved to ${nodeToString(tracedNode)}. Description: ${this.description}`;
  }
}

class EndTraceCommand extends Command {
  constructor() {
    super();
  }

  execute(architectureState: ArchitectureState) {
    if (!architectureState.isCurrentlyTracing) {
      throw new Error(
        "There is no simulation trace that are currently in progress",
      );
    }
    architectureState.endTrace();
    return `Trace ended at step ${architectureState.getCurrentStepNumber()}`;
  }
}

export {
  Command,
  AddNodeCommand,
  AddEdgeCommand,
  DeleteNodeCommand,
  DeleteEdgeCommand,
  ClearCommand,
  TraceCommand,
  EndTraceCommand,
};

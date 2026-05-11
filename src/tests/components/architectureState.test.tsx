import { describe, it, expect, vi } from "vitest";
import {
  nodeToString,
  edgeToString,
} from "#components/architectureState";
import { Edge } from "@xyflow/react";
import { mockState, makeNode } from "../utils/constructors";

describe("nodeToString", () => {
  it("returns empty string for undefined", () => {
    expect(nodeToString(undefined)).toBe("");
  });

  it("returns formatted string for a node", () => {
    const node = makeNode("n#1", "Foo");
    expect(nodeToString(node)).toBe("Node n#1(Foo)");
  });
});

describe("edgeToString", () => {
  it("uses node labels when both nodes exist", () => {
    const state = mockState({
      nodes: [makeNode("n#1", "Foo"), makeNode("n#2", "Bar")],
    });
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    expect(edgeToString(edge, state)).toBe(
      "Edge connecting Node n#1(Foo) to Node n#2(Bar)",
    );
  });

  it("falls back to raw id when source node is missing", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    const edge: Edge = { id: "e#1", source: "n#2", target: "n#1" };
    const result = edgeToString(edge, state);
    expect(edgeToString(edge, state)).toBe(
      "Edge connecting Node n#2 to Node n#1(Foo)"
    )
  });

  it("falls back to raw id when target node is missing", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const result = edgeToString(edge, state);
    expect(edgeToString(edge, state)).toBe(
      "Edge connecting Node n#1(Foo) to Node n#2",)
  });
});

describe("ArchitectureState node methods:", () => {
  it("hasNodeWithId returns true when node exists", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    expect(state.hasNodeWithId("n#1")).toBe(true);
  });

  it("hasNodeWithId returns false when node does not exist", () => {
    const state = mockState();
    expect(state.hasNodeWithId("n#1")).toBe(false);
  });

  it("getNodeWithId returns the correct node if it exists", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node] });
    expect(state.getNodeWithId("n#1")?.data.label).toBe("Foo");
  });

  it("getNodeWithId returns undefined for missing node", () => {
    const state = mockState();
    expect(state.getNodeWithId("n#1")).toBeUndefined();
  });

  it("addNode creates a node with the correct label", () => {
    const state = mockState();
    const newNode = state.addNode("Foo");
    expect(newNode.data.label).toBe("Foo");
    expect(newNode.id).toBe("n#1");
  });

  it("addNode increments id such that every node has a unique id", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    const newNode = state.addNode("Bar");
    expect(newNode.id).toBe("n#2");
  });

  it("addNode uses first available id", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo"), makeNode("n#3", "Bar")] });
    const newNode = state.addNode("Baz");
    expect(newNode.id).toBe("n#2");
  });

  it("addNode positions new node at centroid of existing nodes", () => {
    const state = mockState({
      nodes: [makeNode("n#1", "Foo", 0, 0), makeNode("n#2", "Bar", 100, 50)],
    });
    const newNode = state.addNode("Baz");
    expect(newNode.position.x).toBe(50);
    expect(newNode.position.y).toBe(25);
  });

  it("addNode throws error when simulation trace is in progress", () => {
    const state = mockState({ currentlyTracing: true });
    expect(() => state.addNode("NewNode")).toThrow(
      "Unable to add node while simulation trace in progress.",
    );
  });

  it("removeNodeWithId throws error when node with given id does not exist", () => {
    const state = mockState();
    expect(() => state.removeNodeWithId("n#99")).toThrow(
      "Node with id n#99 does not exist.",
    );
  });

  it("editNodeWithId throws when node with given id does not exist", () => {
    const state = mockState();
    expect(() => state.editNodeWithId("n#99", (x) => x)).toThrow(
      "Node with id n#99 does not exist.",
    );
  });
})

describe("ArchitectureState edge methods:", () => {
  it("hasEdgeWithId returns true when edge exists", () => {
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({ edges: [edge] });
    expect(state.hasEdgeWithId("e#1")).toBe(true);
  });

  it("hasEdgeWithId returns false when edge does not exist", () => {
    const state = mockState();
    expect(state.hasEdgeWithId("e#1")).toBe(false);
  });

  it("getEdgeWithId returns undefined for missing edge", () => {
    const state = mockState();
    expect(state.getEdgeWithId("e#1")).toBeUndefined();
  });

  it("addEdge creates edge and returns it", () => {
    const state = mockState({
      nodes: [makeNode("n#1", "Foo"), makeNode("n#2", "Bar")],
    });
    const newEdge = state.addEdge("n#1", "n#2");
    expect(newEdge.source).toBe("n#1");
    expect(newEdge.target).toBe("n#2");
  });

  it("addEdge throws error if duplicate edge exists", () => {
    const existingEdge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({
      nodes: [makeNode("n#1", "Foo"), makeNode("n#2", "Bar")],
      edges: [existingEdge],
    });
    expect(() => state.addEdge("n#1", "n#2")).toThrow(edgeToString(existingEdge, state) + " already exists!");
  });

  it("removeEdgeWithId throws when edge does not exist", () => {
    const state = mockState();
    expect(() => state.removeEdgeWithId("e#1")).toThrow(
      "Edge with id e#1 does not exist.",
    );
  });

  it("getEdgesWithNodeId returns edges connected to a node", () => {
    const edge1: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const edge2: Edge = { id: "e#2", source: "n#1", target: "n#3" };
    const edge3: Edge = { id: "e#2", source: "n#2", target: "n#3" };
    const state = mockState({ edges: [edge1, edge2, edge3] });
    const found = state.getEdgesWithNodeId("n#1");
    expect(found).toHaveLength(2);
    expect(found[0].id).toBe("e#1");
    expect(found[1].id).toBe("e#2");
  });

  it("getEdgesWithNodeIds returns edges connecting two nodes", () => {
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({ edges: [edge] });
    const found = state.getEdgesWithNodeIds("n#1", "n#2");
    expect(found).toHaveLength(1);
  });
});

describe("ArchitectureState tracing methods:", () => {
  it("isCurrentlyTracing returns value correctly", () => {
    const state = mockState({ currentlyTracing: false });
    expect(state.isCurrentlyTracing()).toBe(false);
    const state2 = mockState({ currentlyTracing: true });
    expect(state2.isCurrentlyTracing()).toBe(true);
  });

  it("getCurrentStep returns undefined when not tracing", () => {
    const state = mockState();
    expect(state.getCurrentStep()).toBeUndefined();
  });

  it("addStep throws error when node does not exist", () => {
    const state = mockState();
    expect(() => state.addStep("n#1", "Not exist")).toThrow(
      "Node with id n#1 does not exist.",
    );
  });

  it("addStep throws error when tracing to the same node", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node] });
    state.addStep("n#1", "start");
    expect(() => state.addStep("n#1", "Again")).toThrow(
      "Unable to trace to same node.",
    );
  });

  it("addStep throws when nodes are not connected", () => {
    const n1 = makeNode("n#1", "Foo");
    const n2 = makeNode("n#2", "Bar");
    // No edges
    const state = mockState({ nodes: [n1, n2] });
    state.addStep("n#1", "Begin");
    expect(() => state.addStep("n#2", "Step")).toThrow(
      "Node n#1(Foo) is not connected to Node n#2(Bar).",
    );
  });

  it("addStep moves between connected nodes without throwing", () => {
    const n1 = makeNode("n#1", "Foo");
    const n2 = makeNode("n#2", "Bar");
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({ nodes: [n1, n2], edges: [edge] });
    state.addStep("n#1", "start");
    expect(() => state.addStep("n#2", "moved")).not.toThrow();
  });

  it("endTrace sets currentlyTracing to false", () => {
    const n1 = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [n1] });
    state.addStep("n#1", "Begin");
    state.endTrace();
    expect(state.isCurrentlyTracing()).toBe(false);
  });
});

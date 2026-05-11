import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AddNodeCommand,
  AddEdgeCommand,
  TraceCommand,
  DeleteNodeCommand,
  DeleteEdgeCommand,
} from "#components/command/command";
import { Edge } from "@xyflow/react";
import { mockState, makeNode } from "../../utils/constructors";

describe("AddNodeCommand", () => {
  it("executes and returns a formatted string", () => {
    const state = mockState();
    const cmd = new AddNodeCommand("Foo Bar");
    const result = cmd.execute(state);
    expect(result).toMatch("Node n#1(Foo Bar) added.");
  });

  it("throws error when tracing is in progress", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node], currentlyTracing: true });
    const cmd = new AddNodeCommand("NewService");
    expect(() => cmd.execute(state)).toThrow(
      "Unable to add node while simulation trace in progress.",
    );
  });
});

describe("DeleteNodeCommand", () => {
  it("deletes an existing node successfully", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node] });
    const cmd = new DeleteNodeCommand("n#1");
    const result = cmd.execute(state);
    expect(result).toMatch("Node n#1(Foo) deleted.");
  });

  it("throws error when node does not exist", () => {
    const state = mockState();
    const cmd = new DeleteNodeCommand("n#1");
    expect(() => cmd.execute(state)).toThrow(
      "Node with id n#1 does not exist.",
    );
  });

  it("throws error when tracing is in progress", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node], currentlyTracing: true });
    const cmd = new DeleteNodeCommand("n#1");
    expect(() => cmd.execute(state)).toThrow(
      "Unable to delete node while simulation trace in progress.",
    );
  });
});

describe("AddEdgeCommand", () => {
  it("throws when source node does not exist", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    const cmd = new AddEdgeCommand("n#2", "n#1");
    expect(() => cmd.execute(state)).toThrow(
      "Node with id n#2 does not exist.",
    );
  });

  it("throws when target node does not exist", () => {
    const state = mockState({ nodes: [makeNode("n#1", "Foo")] });
    const cmd = new AddEdgeCommand("n#1", "n#2");
    expect(() => cmd.execute(state)).toThrow(
      "Node with id n#2 does not exist.",
    );
  });

  it("executes successfully with a valid inputand returns a formatted string", () => {
    const state = mockState({
      nodes: [makeNode("n#1", "Foo"), makeNode("n#2", "Bar")],
    });
    const cmd = new AddEdgeCommand("n#1", "n#2");
    const result = cmd.execute(state);
    expect(result).toMatch(
      /Edge connecting Node n#1\(Foo\) to Node n#2\(Bar\) added\./,
    );
  });
});

describe("DeleteEdgeCommand", () => {
  it("deletes an existing edge successfully", () => {
    const n1 = makeNode("n#1", "Foo");
    const n2 = makeNode("n#2", "Bar");
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({
      nodes: [n1, n2],
      edges: [edge],
    });
    const cmd = new DeleteEdgeCommand("e#1");
    const result = cmd.execute(state);
    expect(result).toMatch("Edge connecting Node n#1(Foo) to Node n#2(Bar) deleted.");
  });

  it("throws error when edge does not exist", () => {
    const state = mockState();
    const cmd = new DeleteEdgeCommand("e#1");
    expect(() => cmd.execute(state)).toThrow(
      "Edge with id e#1 does not exist.",
    );
  });

  it("throws error when tracing is in progress", () => {
    const n1 = makeNode("n#1", "Foo");
    const n2 = makeNode("n#2", "Bar");
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({
      nodes: [n1, n2],
      edges: [edge],
      currentlyTracing: true
    });
    const cmd = new DeleteEdgeCommand("e#1");
    expect(() => cmd.execute(state)).toThrow(
      "Unable to delete edge while simulation trace in progress.",
    );
  });
});

describe("TraceCommand", () => {
  it("throws when node does not exist", () => {
    const state = mockState();
    const cmd = new TraceCommand("n#1", "Begin");
    expect(() => cmd.execute(state)).toThrow(
      "Node with id n#1 does not exist.",
    );
  });

  it("begins a new trace and returns the beginning message", () => {
    const node = makeNode("n#1", "Foo");
    const state = mockState({ nodes: [node] });
    const cmd = new TraceCommand("n#1", "Begin");
    const result = cmd.execute(state);
    expect(result).toMatch(
      "Beginning new simulation trace at Node n#1\(Foo\). Description: Begin",
    );
  });

  it("moves to the next node and returns move message", () => {
    const n1 = makeNode("n#1", "Foo");
    const n2 = makeNode("n#2", "Bar");
    const edge: Edge = { id: "e#1", source: "n#1", target: "n#2" };
    const state = mockState({
      nodes: [n1, n2],
      edges: [edge],
    });
    // First trace step
    new TraceCommand("n#1", "start").execute(state);
    // Second trace step
    const result = new TraceCommand("n#2", "next").execute(state);
    expect(result).toMatch("Moved to Node n#2\(Bar\). Description: next");
  });
});

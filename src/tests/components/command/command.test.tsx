import { describe, it, expect } from "vitest";
import { AddNodeCommand } from "#components/command/command";

describe("AddNodeCommand.execute", () => {
  function makeReactFlowStub(existingNodes: { id: string; position: { x: number; y: number } }[]) {
    const nodes = existingNodes;
    return {
      getNodes: () => nodes,
      setNodes: (updater: (prev: typeof nodes) => typeof nodes) => {
        updater(nodes);
      },
    };
  }
 
  it("adds a node to an empty architecture id n#1", () => {
    const stub = makeReactFlowStub([]);
    const cmd = new AddNodeCommand("Foo");
 
    const result = cmd.execute(stub as any);
    expect(result).toEqual("Node Foo added(id: n#1).");
  });
 
  it("increments the id when id '1' is already taken", () => {
    const stub = makeReactFlowStub([
      { id: "n#1", position: { x: 0, y: 0 } },
    ]);
    const cmd = new AddNodeCommand("Bar");
    const result = cmd.execute(stub as any);
 
    // id 'n#1' is taken, so the new node should receive id 'n#2'
    expect(result).toEqual("Node Bar added(id: n#2).");
  });
 
  it("increments the id to the smallest available id", () => {
    const stub = makeReactFlowStub([
      { id: "n#1", position: { x: 0, y: 0 } },
      { id: "n#2", position: { x: 0, y: 0 } },
      { id: "n#4", position: { x: 0, y: 0 } },
    ]);
    const cmd = new AddNodeCommand("Baz");
    const result = cmd.execute(stub as any);
 
    // id 'n#1' and 'n#2' are taken, but 'n#3' is not
    expect(result).toEqual("Node Baz added(id: n#3).");
  });
});

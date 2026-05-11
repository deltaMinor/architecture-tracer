import { describe, it, expect } from "vitest";
import { AddNodeCommand, AddEdgeCommand, TraceCommand, EndTraceCommand } from "#components/command/command";
import { parseCommand } from "../../../components/command/commandParser";

describe("parseCommand", () => {
  it("throws for an unknown command keyword", () => {
    expect(() => parseCommand("foo")).toThrow("Invalid command.");
  });

  it("returns an AddNodeCommand for a valid add command", () => {
    const cmd = parseCommand("add n/Server");
    expect(cmd).toBeInstanceOf(AddNodeCommand);
  });
 
  it("throws when the add command has no label argument", () => {
    expect(() => parseCommand("add")).toThrow(
      "Insufficient parameters for add command."
    );
  });
 
  it("throws when the label is not a valid node label", () => {
    expect(() => parseCommand("add foo")).toThrow(
      "Invalid parameter for add command: foo"
    );
  });
  
  it("returns an AddEdgeCommand for a valid edge constructor", () => {
    const cmd = parseCommand("add e/n#1 n#2");
    expect(cmd).toBeInstanceOf(AddEdgeCommand);
  });

  it("throws for an invalid edge constructor format", () => {
    expect(() => parseCommand("add e/foo")).toThrow(
      "Invalid parameter for add command: e/foo",
    );
  });

  it("returns a TraceCommand successfully for valid input", () => {
    const cmd = parseCommand("trace n#1 Description");
    expect(cmd).toBeInstanceOf(TraceCommand);
  });

  it("throws when trace command has no description", () => {
    expect(() => parseCommand("trace n#1")).toThrow(
      "Insufficient parameters for trace command.",
    );
    expect(() => parseCommand("trace n#1   ")).toThrow(
      "Description cannot be blank.",
    );
  });

  it("throws when node id is invalid", () => {
    expect(() => parseCommand("trace foo bar")).toThrow(
      "Invalid parameter for trace command: foo",
    );
  });

  it("accepts multi-word descriptions", () => {
    const cmd = parseCommand("trace n#5 Attacker enters from the Internet.");
    expect(cmd).toBeInstanceOf(TraceCommand);
  });
 
  it("throw error for a completely empty string", () => {
    expect(() => parseCommand("")).toThrow();
  });
});
; 
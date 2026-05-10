import { describe, it, expect } from "vitest";
import { AddNodeCommand } from "#components/command/command";
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
      "Parameter unclear for add command."
    );
  });
 
  it("throw error for a completely empty string", () => {
    expect(() => parseCommand("")).toThrow();
  });
});

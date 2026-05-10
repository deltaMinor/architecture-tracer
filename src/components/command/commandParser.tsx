import { AddNodeCommand, TraceCommand } from "./command";

import { isValidNodeLabel, isValidNodeId } from "./validationParser";

function parseCommand(commandString: string) {
  var tokens = commandString.split(" ");
  switch (tokens[0]) {
    case "add":
      return parseAddCommand(tokens);
    case "trace":
      return parseTraceCommand(tokens);
    default:
      throw Error("Invalid command.");
  }
}

function parseAddCommand(tokens: string[]) {
  if (tokens.length < 2) {
    throw Error("Insufficient parameters for add command.");
  }
  const remainder = tokens.slice(1).join(" ");
  if (isValidNodeLabel(remainder)) {
    return new AddNodeCommand(remainder.substring(2));
  }
  throw Error(`Invalid parameter for add command: ${remainder}`);
}

function parseTraceCommand(tokens: string[]) {
  if (tokens.length < 3) {
    throw Error("Insufficient parameters for trace command.");
  }
  if (!isValidNodeId(tokens[1])) {
    throw Error(`Invalid parameter for trace command: ${tokens[1]}`);
  }
  const remainder = tokens.slice(2).join(" ");
  if (remainder == "") {
    throw Error(`Description cannot be blank.`);
  }
  return new TraceCommand(tokens[1], remainder);
}

export { parseCommand };

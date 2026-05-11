import {
  AddNodeCommand,
  AddEdgeCommand,
  DeleteNodeCommand,
  DeleteEdgeCommand,
  TraceCommand,
  EndTraceCommand,
} from "./command";

import {
  isValidNodeLabel,
  isValidNodeId,
  isValidEdgeId,
} from "./validationParser";

const EDGE_CONSTRUCTOR_REGEX = /^e\/n#\d+ n#\d+$/;

function parseCommand(commandString: string) {
  var tokens = commandString.split(" ");
  switch (tokens[0]) {
    case "add":
      return parseAddCommand(tokens);
    case "delete":
      return parseDeleteCommand(tokens);
    case "trace":
      return parseTraceCommand(tokens);
    default:
      throw Error("Invalid command.");
  }
}

function isValidEdgeConstructor(token: string) {
  return EDGE_CONSTRUCTOR_REGEX.test(token);
}

function parseAddCommand(tokens: string[]) {
  if (tokens.length < 2) {
    throw Error("Insufficient parameters for add command.");
  }
  const remainder = tokens.slice(1).join(" ");
  if (isValidNodeLabel(remainder)) {
    return new AddNodeCommand(remainder.substring(2));
  }
  if (isValidEdgeConstructor(remainder)) {
    var ids = remainder.substring(2).split(" ");
    return new AddEdgeCommand(ids[0], ids[1]);
  }
  throw Error(`Invalid parameter for add command: ${remainder}`);
}

function parseDeleteCommand(tokens: string[]) {
  if (tokens.length < 2) {
    throw Error("Insufficient parameters for delete command.");
  }
  const remainder = tokens.slice(1).join(" ");
  if (isValidEdgeId(remainder)) {
    return new DeleteEdgeCommand(remainder);
  }
  if (isValidNodeId(remainder)) {
    return new DeleteNodeCommand(remainder);
  }
  throw Error(`Invalid parameter for delete command: ${remainder}`);
}

function parseTraceCommand(tokens: string[]) {
  if (tokens.length == 2) {
    if (tokens[1] == "end") {
      return new EndTraceCommand();
    }
  }
  if (tokens.length < 3) {
    throw Error("Insufficient parameters for trace command.");
  }
  if (!isValidNodeId(tokens[1])) {
    throw Error(`Invalid parameter for trace command: ${tokens[1]}`);
  }
  const remainder = tokens.slice(2).join(" ").trim();
  if (remainder == "") {
    throw Error(`Description cannot be blank.`);
  }
  return new TraceCommand(tokens[1], remainder);
}

export { parseCommand };

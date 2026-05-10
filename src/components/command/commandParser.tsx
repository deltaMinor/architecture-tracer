import {
    AddNodeCommand
} from "./command"

import {
    isValidNodeLabel
} from "./validationParser"

function parseCommand (commandString: string) {
    var tokens = commandString.split(" ");
    switch(tokens[0]) {
        case "add": return parseAddCommand(tokens);
        default: throw Error("Invalid command.");
    };
}

function parseAddCommand (tokens: string[]) {
    if(tokens.length < 2) {
        throw Error("Insufficient parameters for add command.");
    }
    if(isValidNodeLabel(tokens[1])) {
        return new AddNodeCommand(tokens.slice(1).join(" ").substring(2));
    }
    throw Error("Parameter unclear for add command.");
}

export {
    parseCommand
}
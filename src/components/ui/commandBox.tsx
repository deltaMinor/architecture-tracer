import { useCallback, useState } from "react";

import {
  useReactFlow,
} from "@xyflow/react";

import { Input } from "./input";

import { Command } from "../command/command";
import { parseCommand } from "../command/commandParser";

export function CommandBox({
}) {
    const [commandString, setCommandString] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [responseStyle, setResponseStyle] = useState<string>("");
    const reactFlow = useReactFlow();
    const validResponseStyle : string = "#ffffff";
    const invalidResponseStyle : string = "#ff0000";

    const handleCommand = useCallback((commandString: string) => {
        setResponse(`Input received: ${commandString}`);

        try {
            var newCommand: Command = parseCommand(commandString);
            setResponse(newCommand.execute(reactFlow));
            setResponseStyle(validResponseStyle);
        } catch (error) {
            let errorMessage = "Invalid command.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setResponse(errorMessage);
            setResponseStyle(invalidResponseStyle);
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        handleCommand(commandString);
        setCommandString("");
        }
    };

    return (
        <div className="flex flex-col w-full gap-2">
            <Input
            className = "text-white w-full bg-[#16171d]"
            placeholder = "Enter command..."
            value = {commandString}
            type = "text"
            onChange = {(e) => setCommandString(e.target.value)}
            onKeyDown = {handleKeyDown} />
            <div 
            className = "text-left w-full min-h-[60px] rounded-md border border-input bg-background px-2 py-1 text-sm bg-[#16171d]"
            style={{ color: responseStyle }}>
                {response}
            </div>
        </div>
    );
}

import { useCallback, useState } from "react";

import {
  BuiltInEdge,
  useReactFlow,
  type Node,
} from "@xyflow/react";

import { Input } from "./input";

export function CommandBox({
}) {
    const [commandString, setCommandString] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [responseStyle, setResponseStyle] = useState<string>("");
    const { setNodes } = useReactFlow<Node, BuiltInEdge>();
    const validResponseStyle : string = "#ffffff";
    const invalidResponseStyle : string = "#ff0000";

    const handleCommand = useCallback((commandString: string) => {
        setResponse(`Input received: ${commandString}`);

        const match = commandString.match(/^add n\/(.+)$/);
        if (match) {
            const name = match[1].trim();
            const newNode = {
            id: `n${Date.now()}`,
            position: { x: Math.random() * 300, y: Math.random() * 300 },
            data: { label: name },
            };
            setNodes((prev) => [...prev, newNode]);
            setResponseStyle(validResponseStyle);
        } else {
            setResponseStyle(invalidResponseStyle);
        }
    }, [setNodes]);

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

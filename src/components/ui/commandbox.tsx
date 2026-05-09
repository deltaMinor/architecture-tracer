import { useCallback, useState } from "react";

import {
  BuiltInEdge,
  useReactFlow,
  type Node,
} from "@xyflow/react";

import {
  Command,
  CommandInput,
} from "./command";

export function CommandBox({
}) {
    const [commandString, setCommandString] = useState<string>("");
    const { setNodes } = useReactFlow<Node, BuiltInEdge>();

    const handleCommand = useCallback((commandString: string) => {
        const match = commandString.match(/^add n\/(.+)$/);
        if (match) {
            const name = match[1].trim();
            const newNode = {
            id: `n${Date.now()}`,
            position: { x: Math.random() * 300, y: Math.random() * 300 },
            data: { label: name },
            };
            setNodes((prev) => [...prev, newNode]);
        }
    }, [setNodes]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        handleCommand(commandString);
        setCommandString("");
        }
    };

    return (
        <Command
        shouldFilter={false}
        className="rounded-lg border shadow-md md:min-w-[600px]"
        >
            <CommandInput
            placeholder="Enter a command"
            value={commandString}
            onValueChange={setCommandString}
            onKeyDown={handleKeyDown}
            />
        </Command>
    );
}

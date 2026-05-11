import { useState } from "react";

import { Input } from "./input";

interface CommandBoxProps {
    handleInput: (input: string) => void;
}

export function CommandBox({ handleInput }: CommandBoxProps) {
    const [commandString, setCommandString] = useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleInput(commandString);
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
        </div>
    );
}

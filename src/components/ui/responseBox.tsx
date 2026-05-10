export const VALID_INPUT : string = "#ffffff";
export const INVALID_INPUT : string = "#ff0000";

interface ResponseBoxProps {
    text: string;
    style: string;
}

export function ResponseBox({text, style}: ResponseBoxProps) {
    return (
        <div 
        className = "text-left w-full min-h-[60px] rounded-md border border-input bg-background px-2 py-1 text-sm bg-[#16171d]"
        style={{ color: style }}>
            {text}
        </div>
    );
}

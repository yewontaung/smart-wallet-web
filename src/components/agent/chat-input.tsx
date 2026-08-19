import { useState } from "react";
import { ArrowUp, Mic } from "lucide-react";

interface AgentChatInputProps {
    onSend: (text: string) => void;
}

export function AgentChatInput({ onSend }: AgentChatInputProps) {
    const [value, setValue] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const trimmed = value.trim();

        if (!trimmed) return;

        onSend(trimmed);
        setValue("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="fixed bottom-28 left-0 right-0 z-9999 flex justify-center px-4"
        >
            <div className="flex w-full items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-md md:w-[40%]">
                <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70"
                    aria-label="Voice input"
                >
                    <Mic size={18} />
                </button>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Ask me to send money, check balance…"
                    autoComplete="off"
                    enterKeyHint="send"
                    className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />

                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
                    aria-label="Send"
                >
                    <ArrowUp size={18} />
                </button>
            </div>
        </form>
    );
}
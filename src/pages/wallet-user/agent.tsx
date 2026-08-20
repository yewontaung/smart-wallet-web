import { useEffect, useRef, useState } from "react";

import type { AgentMessage } from "../../types/agents";

import { ArrowUp, Mic } from "lucide-react";

const BOTTOM_NAV_HEIGHT = 96;
const KEYBOARD_THRESHOLD = 150;

export function AgentPage() {
    const [messages, setMessages] = useState<AgentMessage[]>([]);

    const [viewportHeight, setViewportHeight] = useState(
        window.visualViewport?.height ?? window.innerHeight
    );

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    useEffect(() => {
        const updateViewport = () => {
            const viewport = window.visualViewport;

            if (!viewport) return;

            const height = viewport.height;

            const keyboardHeight =
                window.innerHeight - viewport.height;

            setViewportHeight(height);

            setKeyboardOpen(
                keyboardHeight > KEYBOARD_THRESHOLD
            );
        };

        if (!window.visualViewport) return;

        updateViewport();

        window.visualViewport.addEventListener(
            "resize",
            updateViewport
        );

        window.visualViewport.addEventListener(
            "scroll",
            updateViewport
        );

        return () => {
            window.visualViewport?.removeEventListener(
                "resize",
                updateViewport
            );

            window.visualViewport?.removeEventListener(
                "scroll",
                updateViewport
            );
        };
    }, []);
    function handleSend(text: string) {
        const userMessage: AgentMessage = {
            id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
            role: "user",
            text,
            createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
    }

    return (
        <div
            className="flex flex-col overflow-hidden"
            style={{
                /*
                 * Normal:
                 * chat height = screen height - navbar space
                 *
                 * Keyboard:
                 * chat height = actual visible viewport
                 */
                height: keyboardOpen
                    ? `${viewportHeight}px`
                    : `calc(100dvh - ${BOTTOM_NAV_HEIGHT}px)`,
            }}
        >
            {/* Messages */}
            <main className="min-h-0 flex-1 overflow-y-auto px-4">
                <div className="flex flex-col gap-4 pt-20 px-4 pb-4">
                    {messages.length === 0 && (
                        <div className="mt-20 text-center text-sm text-white/40">
                            Ask me to send money, check your balance,
                            pay a bill, or top up.
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex justify-end"
                        >
                            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white px-4 py-2 text-sm text-black">
                                {message.text}
                            </div>
                        </div>
                    ))}
                    {/* Scroll target */}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input */}
            <AgentChatInput onSend={handleSend} />
        </div>
    );
}

interface AgentChatInputProps {
    onSend: (text: string) => void;
}

function AgentChatInput({
    onSend,
}: AgentChatInputProps) {
    const [value, setValue] = useState("");

    const inputRef = useRef<HTMLTextAreaElement>(null);

    function adjustHeight() {
        const textarea = inputRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function handleChange(
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        setValue(e.target.value);

        // Wait for React to update the textarea content
        requestAnimationFrame(() => {
            adjustHeight();
        });
    }

    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const trimmed = value.trim();

        if (!trimmed) return;

        onSend(trimmed);

        setValue("");

        // Reset textarea height
        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.style.height = "auto";
            }
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="z-50 shrink-0 px-4 py-3"
        >
            <div className="flex w-full items-end gap-2 rounded-3xl bg-white/10 px-3 py-2 backdrop-blur-md">
                <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70"
                    aria-label="Voice input"
                >
                    <Mic size={18} />
                </button>

                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    placeholder="Ask me to send money, check balance…"
                    autoComplete="off"
                    rows={1}
                    className="
                        min-h-9
                        max-h-32
                        min-w-0
                        flex-1
                        resize-none
                        overflow-y-auto
                        bg-transparent
                        py-2
                        text-sm
                        leading-5
                        text-white
                        placeholder:text-white/40
                        focus:outline-none
                    "
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
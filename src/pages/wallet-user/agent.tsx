import { useEffect, useRef, useState } from "react";
import type { AgentMessage } from "../../types/agents";
import { AgentChatInput } from "../../components/agent/chat-input";

export function AgentPage() {
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
        const viewport = window.visualViewport;

        if (!viewport) return;

        const updateViewport = () => {
            const heightDifference = window.innerHeight - viewport.height;

            setViewportHeight(viewport.height);
            setKeyboardOpen(heightDifference > 150);
        };

        updateViewport();

        viewport.addEventListener("resize", updateViewport);
        viewport.addEventListener("scroll", updateViewport);

        return () => {
            viewport.removeEventListener("resize", updateViewport);
            viewport.removeEventListener("scroll", updateViewport);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    function handleSend(text: string) {
        const userMessage: AgentMessage = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            role: "user",
            text,
            createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
    }

    return (
        <div
            className="relative flex flex-col overflow-hidden"
            style={{
                height: `${viewportHeight}px`,
            }}
        >
            {/* Messages */}
            <main
                className={`flex-1 overflow-y-auto px-4 ${
                    keyboardOpen ? "pb-24" : "pb-40"
                }`}
            >
                <div className="flex min-h-full flex-col gap-4 pt-4">
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

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Chat input */}
            <div
                className={`absolute left-0 right-0 px-4 ${
                    keyboardOpen ? "bottom-3" : "bottom-28"
                }`}
            >
                <AgentChatInput onSend={handleSend} />
            </div>

            {/* Bottom navigation */}
            {!keyboardOpen && (
                <div className="shrink-0">
                    {/* Your existing bottom navigation */}
                </div>
            )}
        </div>
    );
}
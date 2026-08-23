import React, { useEffect, useRef, useState } from "react";
import {
    ArrowUp,
    Mic,
    Loader2,
    Check,
    X,
    Lock,
    Trash2,
    ArrowRight,
    ShieldAlert,
    CreditCard,
    User,
    Hash,
    DollarSign,
    Calendar,
    Layers,
    Bot,
} from "lucide-react";
import type { AgentResponse, AgentAction, AgentHook } from "../../schemas/ai/base";
import { askAi } from "../../services/ai.service";
import { privateRequest } from "../../utils/api";
import { wsEventBus } from "../../utils/event-bus";

const BOTTOM_NAV_HEIGHT = 96;
const KEYBOARD_THRESHOLD = 150;
const SIMULATED_DELAY_MS = 1200;

type ActionState = "idle" | "executing" | "completed" | "failed" | "cancelled" | "expired";

function getFieldIcon(key: string) {
    const k = key.toLowerCase();
    if (k.includes("amount") || k.includes("price") || k.includes("fee") || k.includes("balance"))
        return <DollarSign size={14} className="text-white/60" />;
    if (k.includes("user") || k.includes("name") || k.includes("recipient") || k.includes("to"))
        return <User size={14} className="text-white/60" />;
    if (k.includes("card") || k.includes("account") || k.includes("bank"))
        return <CreditCard size={14} className="text-white/60" />;
    if (k.includes("id") || k.includes("code") || k.includes("number") || k.includes("ref"))
        return <Hash size={14} className="text-white/60" />;
    if (k.includes("date") || k.includes("time") || k.includes("due"))
        return <Calendar size={14} className="text-white/60" />;
    return <Layers size={14} className="text-white/60" />;
}

export function AgentPage() {
    const [messages, setMessages] = useState<AgentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [optimisticPrompt, setOptimisticPrompt] = useState<string | null>(null);

    const [actionStatuses, setActionStatuses] = useState<Record<string, ActionState>>({});
    const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

    const [editablePayloads, setEditablePayloads] = useState<Record<string, Record<string, unknown>>>({});

    const [pinModal, setPinModal] = useState<{
        isOpen: boolean;
        pin: string[];
        actionId: string | null;
        hook: AgentHook | null;
    }>({
        isOpen: false,
        pin: ["", "", "", "", "", ""],
        actionId: null,
        hook: null,
    });

    const [viewportHeight, setViewportHeight] = useState(
        window.visualViewport?.height ?? window.innerHeight
    );
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const prevMessageCountRef = useRef(0);

    // 1. Calculate the total number of actions across all messages
    const totalActionsCount = messages.reduce(
        (acc, msg) => acc + (msg.agentActions?.length || 0),
        0
    );

    // 2. Track totalActionsCount in the dependency array
    useEffect(() => {
        const totalMessages = messages.length;
        // const isNewMessageAdded = totalMessages > prevMessageCountRef.current;

        // Update ref for next comparison
        prevMessageCountRef.current = totalMessages;

        // Scroll if a new message container was added, a new action arrived, or during loading
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages.length, totalActionsCount, loading, optimisticPrompt]);

    // useEffect(() => {
    //     const isNewMessageAdded = messages.length > prevMessageCountRef.current;
    //     prevMessageCountRef.current = messages.length;

    //     if (isNewMessageAdded || loading || optimisticPrompt) {
    //         messagesEndRef.current?.scrollIntoView({
    //             behavior: "smooth",
    //             block: "end",
    //         });
    //     }
    // }, [messages.length, loading, optimisticPrompt]);

    useEffect(() => {
        const updateViewport = () => {
            const viewport = window.visualViewport;
            if (!viewport) return;

            const height = viewport.height;
            const keyboardHeight = window.innerHeight - viewport.height;

            setViewportHeight(height);
            setKeyboardOpen(keyboardHeight > KEYBOARD_THRESHOLD);
        };

        if (!window.visualViewport) return;

        updateViewport();

        window.visualViewport.addEventListener("resize", updateViewport);
        window.visualViewport.addEventListener("scroll", updateViewport);

        return () => {
            window.visualViewport?.removeEventListener("resize", updateViewport);
            window.visualViewport?.removeEventListener("scroll", updateViewport);
        };
    }, []);


    function processAgentActions(agentActions: AgentAction[]) {

        const initialStatuses: Record<string, ActionState> = {};
        const initialPayloads: Record<string, Record<string, unknown>> = {};

        agentActions.forEach((act) => {
            if (act.isError) {
                initialStatuses[act.actionId] = "failed";
            } else if (act.status === "Completed") {
                initialStatuses[act.actionId] = "completed";
            } else if (act.status === "Cancelled") {
                initialStatuses[act.actionId] = "cancelled";
            } else if (act.status === "Expired") {
                initialStatuses[act.actionId] = "expired";
            } else {
                initialStatuses[act.actionId] = "idle";
            }

            if (act.agentHook?.requirePayload) {
                initialPayloads[act.actionId] = { ...act.agentHook.requirePayload };
            }
        });

        return { initialStatuses, initialPayloads };
    }

    // useEffect(() => {

    //     const unsubcribe = wsEventBus.on("ai_response", (payload) => {
    //         console.log("doing ai response")
    //         const result = payload as AgentResponse
    //         // if (!result?.agentActions || !Array.isArray(result.agentActions)) {
    //         //     return;
    //         // }
    //         console.log("continue...")
    //         const { initialStatuses, initialPayloads } = processAgentActions(result.agentActions)
    //         setActionStatuses((prev) => ({ ...prev, ...initialStatuses }));
    //         setEditablePayloads((prev) => ({ ...prev, ...initialPayloads }));
    //         setMessages((prev) => [...prev, result]);
    //         setLoading(false);
    //         setOptimisticPrompt(null);
    //     })
    //     return () => unsubcribe()
    // }, [])

    useEffect(() => {
        // Listener A: Initial AI Response Shell
        const unsubscribeAiResponse = wsEventBus.on("ai_response", (payload) => {
            console.log("ai_response payload received:", payload);
            const result = payload as AgentResponse;

            const actions = result?.agentActions || [];

            if (actions.length > 0) {
                const { initialStatuses, initialPayloads } = processAgentActions(actions);
                setActionStatuses((prev) => ({ ...prev, ...initialStatuses }));
                setEditablePayloads((prev) => ({ ...prev, ...initialPayloads }));
            }

            setMessages((prev) => {
                const msgId = result.messageId;
                const exists = prev.some((msg) => msg.messageId === msgId);

                if (exists) {
                    return prev.map((msg) =>
                        msg.messageId === msgId
                            ? {
                                ...msg,
                                ...result,
                                // Preserve actions if agent_action already added them early!
                                agentActions: msg.agentActions?.length ? msg.agentActions : actions
                            }
                            : msg
                    );
                }
                return [...prev, { ...result, agentActions: actions }];
            });

            setLoading(false);
            setOptimisticPrompt(null);
        });

        // Listener B: Streamed Individual Agent Actions
        const unsubscribeAgentAction = wsEventBus.on("agent_action", (payload) => {

            const action = payload as AgentAction;
            const targetMessageId = action?.messageId;

            if (!targetMessageId) return;

            const { initialStatuses, initialPayloads } = processAgentActions([action]);
            setActionStatuses((prev) => ({ ...prev, ...initialStatuses }));
            setEditablePayloads((prev) => ({ ...prev, ...initialPayloads }));

            setMessages((prev) => {
                const parentExists = prev.some((msg) => msg.messageId === targetMessageId);

                // FIX: If agent_action arrives BEFORE ai_response, create the message container shell!
                if (!parentExists) {
                    console.warn(`Parent message ${targetMessageId} not in state yet. Creating container shell.`);
                    return [
                        ...prev,
                        {
                            messageId: targetMessageId,
                            prompt: "", // Will be updated when ai_response arrives
                            agentActions: [action],
                        } as AgentResponse,
                    ];
                }

                // Normal update if parent message already exists
                return prev.map((msg) => {
                    if (msg.messageId === targetMessageId) {
                        const currentActions = msg.agentActions || [];
                        const isDuplicate = currentActions.some((a) => a.actionId === action.actionId);

                        if (isDuplicate) return msg;

                        return {
                            ...msg,
                            agentActions: [...currentActions, action],
                        };
                    }
                    return msg;
                });
            });
        });

        return () => {
            unsubscribeAiResponse();
            unsubscribeAgentAction();
        };
    }, []);

    async function handleSend(text: string) {
        setOptimisticPrompt(text);
        setLoading(true);

        try {
            await Promise.all([
                askAi({ prompt: text }),
                new Promise((res) => setTimeout(res, SIMULATED_DELAY_MS)),
            ]);
        } catch (e) {
            if (e instanceof Error) console.log(e.message);
        } finally {
            setLoading(false);
            setOptimisticPrompt(null);
        }
    }

    function handlePayloadChange(actionId: string, fieldKey: string, value: string) {
        setEditablePayloads((prev) => ({
            ...prev,
            [actionId]: {
                ...(prev[actionId] || {}),
                [fieldKey]: value,
            },
        }));
    }

    function handleInitiateAction(action: AgentAction) {
        if (!action.agentHook) return;

        if (action.agentHook.requirePin) {
            setPinModal({
                isOpen: true,
                pin: ["", "", "", "", "", ""],
                actionId: action.actionId,
                hook: action.agentHook,
            });
            setTimeout(() => pinInputRefs.current[0]?.focus(), 50);
        } else {
            executeHook(action.actionId, action.agentHook);
        }
    }

    async function executeHook(actionId: string, hook: AgentHook, pin?: string) {
        setActionStatuses((prev) => ({ ...prev, [actionId]: "executing" }));
        setActionErrors((prev) => ({ ...prev, [actionId]: "" }));

        const currentRequirePayload = editablePayloads[actionId] || hook.requirePayload || {};
        const mergedPayload = {
            ...(hook.formPayload || {}),
            ...currentRequirePayload,
        };

        try {
            const responseAction = await privateRequest<AgentAction>(hook.hookUrl, {
                method: hook.hookMethod,
                body: {...mergedPayload,
                    ...(pin ? { pin } : {}),
                },
            });

            const newHook: AgentHook | undefined = responseAction.agentHook || undefined;
            const newDescription = responseAction.description;
            const responseStatus = responseAction.status;

            if (newHook && newHook.hookUrl) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) => ({
                        ...msg,
                        agentActions: msg.agentActions.map((act) =>
                            act.actionId === actionId
                                ? {
                                    ...act,
                                    description: newDescription || act.description,
                                    formDisplay: responseAction.formDisplay || act.formDisplay,
                                    agentHook: newHook,
                                    status: responseStatus || "Pending",
                                }
                                : act
                        ),
                    }))
                );

                if (newHook.requirePayload) {
                    setEditablePayloads((prev) => ({
                        ...prev,
                        [actionId]: { ...newHook.requirePayload },
                    }));
                }

                setActionStatuses((prev) => ({ ...prev, [actionId]: "idle" }));
                return;
            }

            const finalStatus: ActionState =
                responseAction.isError || responseStatus === "Cancelled"
                    ? "failed"
                    : "completed";

            setMessages((prevMessages) =>
                prevMessages.map((msg) => ({
                    ...msg,
                    agentActions: msg.agentActions.map((act) =>
                        act.actionId === actionId
                            ? {
                                ...act,
                                description: newDescription || act.description,
                                formDisplay: responseAction.formDisplay || act.formDisplay,
                                agentHook: undefined,
                                status: responseStatus || "Completed",
                            }
                            : act
                    ),
                }))
            );

            setActionStatuses((prev) => ({ ...prev, [actionId]: finalStatus }));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Error occurred";
            setActionStatuses((prev) => ({ ...prev, [actionId]: "failed" }));
            setActionErrors((prev) => ({ ...prev, [actionId]: msg }));
        }
    }

    function handleCancelAction(actionId: string) {
        setActionStatuses((prev) => ({ ...prev, [actionId]: "cancelled" }));
    }

    function handleDeleteAction(actionId: string) {
        setMessages((prevMessages) =>
            prevMessages
                .map((msg) => ({
                    ...msg,
                    agentActions: msg.agentActions.filter((act) => act.actionId !== actionId),
                }))
                .filter((msg) => msg.agentActions.length > 0 || msg.prompt)
        );
    }

    function handlePinChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pinModal.pin];
        newPin[index] = value.slice(-1);

        setPinModal((prev) => ({ ...prev, pin: newPin }));

        if (value && index < 5) {
            pinInputRefs.current[index + 1]?.focus();
        }
    }

    function handlePinKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !pinModal.pin[index] && index > 0) {
            pinInputRefs.current[index - 1]?.focus();
        }
    }

    function handlePinSubmit(e: React.FormEvent) {
        e.preventDefault();
        const fullPin = pinModal.pin.join("");
        if (fullPin.length !== 6 || !pinModal.hook || !pinModal.actionId) return;

        const { actionId, hook } = pinModal;
        setPinModal((prev) => ({ ...prev, isOpen: false }));
        executeHook(actionId, hook, fullPin);
    }

    return (
        <div
            className="flex flex-col overflow-hidden"
            style={{
                height: keyboardOpen
                    ? `${viewportHeight}px`
                    : `calc(100dvh - ${BOTTOM_NAV_HEIGHT}px)`,
            }}
        >
            <main className="min-h-0 flex-1 overflow-y-auto px-4">
                <div className="flex flex-col gap-3 pt-20 px-2 pb-4">
                    {messages.length === 0 && !optimisticPrompt && (
                        <div className="mt-20 text-center text-xs font-normal tracking-wide text-white/40">
                            Ask me to send money, check your balance, pay a bill, or top up.
                        </div>
                    )}

                    {messages.map((message) => (
                        <React.Fragment key={message.messageId}>
                            <div className="flex justify-end my-1">
                                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white/95 px-3.5 py-2 text-xs font-normal text-neutral-900 shadow-sm leading-relaxed">
                                    {message.prompt}
                                </div>
                            </div>

                            {message.agentActions.map((action) => {
                                const status = actionStatuses[action.actionId] || "idle";
                                const error = actionErrors[action.actionId];
                                const isTerminal =
                                    status === "completed" ||
                                    status === "failed" ||
                                    status === "cancelled" ||
                                    status === "expired";

                                const currentRequirePayload = editablePayloads[action.actionId] || {};
                                const formDisplay = (action as { formDisplay?: Record<string, unknown> }).formDisplay || {};

                                const hasRequireFields = Object.keys(currentRequirePayload).length > 0;
                                const hasDisplayFields = Object.keys(formDisplay).length > 0;
                                const hasContent = hasRequireFields || hasDisplayFields;

                                return (
                                    <div key={action.actionId} className="w-full my-0.5">
                                        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 flex flex-col gap-3 backdrop-blur-md shadow-lg transition-all">
                                            {/* Header */}
                                            <div className="flex items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="h-6 w-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white/80">
                                                        <Bot size={13} />
                                                    </div>
                                                    <h4 className="text-xs font-medium text-white/90 leading-tight tracking-tight">
                                                        {action.description}
                                                    </h4>
                                                </div>

                                                {/* Status Badges */}
                                                {status === "completed" && (
                                                    <span className="shrink-0 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1 uppercase tracking-wider">
                                                        <Check size={10} /> Done
                                                    </span>
                                                )}
                                                {status === "failed" && (
                                                    <span className="shrink-0 text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1 uppercase tracking-wider">
                                                        <X size={10} /> Failed
                                                    </span>
                                                )}
                                                {status === "cancelled" && (
                                                    <span className="shrink-0 text-[10px] font-medium text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                        Cancelled
                                                    </span>
                                                )}
                                                {status === "expired" && (
                                                    <span className="shrink-0 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                        Expired
                                                    </span>
                                                )}
                                                {status === "idle" && action.agentHook?.requirePin && (
                                                    <span className="shrink-0 text-[10px] font-medium text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
                                                        <Lock size={9} /> PIN Required
                                                    </span>
                                                )}
                                            </div>

                                            {/* Data Section */}
                                            {hasContent && (
                                                <div className="rounded-xl bg-black/30 p-2.5 flex flex-col gap-2">
                                                    {/* Display formDisplay items */}
                                                    {Object.entries(formDisplay).map(([key, val]) => (
                                                        <div
                                                            key={key}
                                                            className="flex justify-between items-center gap-3 text-xs"
                                                        >
                                                            <span className="text-white/60 font-normal capitalize inline-flex items-center gap-1.5 text-xs tracking-wide shrink-0">
                                                                {getFieldIcon(key)}
                                                                {key.replace(/([A-Z])/g, " $1")}
                                                            </span>
                                                            <span className="text-white font-mono font-normal text-sm tracking-wide text-right truncate">
                                                                {String(val)}
                                                            </span>
                                                        </div>
                                                    ))}

                                                    {/* Display editable requirePayload inputs */}
                                                    {Object.entries(currentRequirePayload).map(([key, val]) => (
                                                        <div
                                                            key={key}
                                                            className="flex justify-between items-center gap-3 text-xs"
                                                        >
                                                            <span className="text-white/70 font-normal capitalize inline-flex items-center gap-1.5 text-xs tracking-wide shrink-0">
                                                                {getFieldIcon(key)}
                                                                {key.replace(/([A-Z])/g, " $1")}
                                                            </span>
                                                            {!isTerminal ? (
                                                                <input
                                                                    type="text"
                                                                    value={String(val ?? "")}
                                                                    onChange={(e) =>
                                                                        handlePayloadChange(
                                                                            action.actionId,
                                                                            key,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="text-right text-white font-mono font-normal text-sm bg-white/10 focus:bg-white/15 focus:outline-none px-2.5 py-1 rounded-lg w-full max-w-42.5 transition-colors border-none"
                                                                />
                                                            ) : (
                                                                <span className="text-white font-mono font-normal text-sm tracking-wide text-right truncate">
                                                                    {String(val)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {error && (
                                                <div className="text-xs text-rose-400 inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
                                                    <ShieldAlert size={13} className="shrink-0" />
                                                    <span className="text-xs leading-tight">{error}</span>
                                                </div>
                                            )}

                                            {/* Footer Actions */}
                                            <div className="flex items-center justify-between pt-0.5">
                                                {!isTerminal ? (
                                                    <button
                                                        onClick={() => handleCancelAction(action.actionId)}
                                                        disabled={status === "executing"}
                                                        className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors inline-flex items-center gap-1 px-2 py-1 rounded-lg disabled:opacity-40 font-normal"
                                                    >
                                                        <Trash2 size={12} /> Cancel
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDeleteAction(action.actionId)}
                                                        className="text-xs text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-flex items-center gap-1 px-2 py-1 rounded-lg font-normal"
                                                    >
                                                        <Trash2 size={12} /> Clear
                                                    </button>
                                                )}

                                                {!isTerminal && action.agentHook && (
                                                    <button
                                                        onClick={() => handleInitiateAction(action)}
                                                        disabled={status === "executing"}
                                                        className="text-xs font-normal text-neutral-900 bg-white hover:bg-white/90 active:scale-[0.98] transition-all inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl shadow-sm disabled:opacity-40"
                                                    >
                                                        {status === "executing" ? (
                                                            <>
                                                                <Loader2 size={12} className="animate-spin text-neutral-600" />
                                                                Processing…
                                                            </>
                                                        ) : (
                                                            <>
                                                                Confirm <ArrowRight size={12} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}

                    {loading && optimisticPrompt && (
                        <React.Fragment>
                            <div className="flex justify-end my-1">
                                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white/70 px-3.5 py-2 text-xs font-normal text-neutral-900">
                                    {optimisticPrompt}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-white/40 py-1 px-2">
                                <Loader2 size={12} className="animate-spin" />
                                <span>Processing prompt…</span>
                            </div>
                        </React.Fragment>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            <AgentChatInput onSend={handleSend} disabled={loading} />

            {pinModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <form
                        onSubmit={handlePinSubmit}
                        className="w-full max-w-xs rounded-2xl border border-white/10 bg-neutral-900 p-5 flex flex-col items-center gap-4 text-center shadow-2xl"
                    >
                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                            <Lock size={15} />
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-white tracking-wide">Security PIN</h3>
                            <p className="text-[11px] text-white/40 mt-0.5">
                                Enter your 6-digit authorization PIN.
                            </p>
                        </div>

                        <div className="flex gap-1.5 justify-center my-1">
                            {pinModal.pin.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => { pinInputRefs.current[idx] = el; }}
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(idx, e.target.value)}
                                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                                    className="h-10 w-9 text-center font-mono text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                                />
                            ))}
                        </div>

                        <div className="flex gap-2 w-full text-xs">
                            <button
                                type="button"
                                onClick={() => setPinModal((prev) => ({ ...prev, isOpen: false }))}
                                className="flex-1 py-2 text-white/50 hover:text-white transition-colors font-normal"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={pinModal.pin.join("").length !== 6}
                                className="flex-1 py-2 font-normal text-neutral-900 bg-white rounded-xl hover:bg-white/90 disabled:opacity-30 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

interface AgentChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

function AgentChatInput({ onSend, disabled }: AgentChatInputProps) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    function adjustHeight() {
        const textarea = inputRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
        requestAnimationFrame(() => {
            adjustHeight();
        });
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (e.key === "Enter" && !e.shiftKey && !isTouchDevice) {
            e.preventDefault();
            submitForm();
        }
    }

    function submitForm() {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;

        onSend(trimmed);
        setValue("");

        requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.style.height = "auto";
            }
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submitForm();
    }

    return (
        <form onSubmit={handleSubmit} className="z-50 shrink-0 px-4 py-3">
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
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
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
                        text-xs
                        leading-5
                        text-white
                        placeholder:text-white/40
                        focus:outline-none
                        disabled:opacity-50
                    "
                />

                <button
                    type="submit"
                    disabled={!value.trim() || disabled}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
                    aria-label="Send"
                >
                    <ArrowUp size={18} />
                </button>
            </div>
        </form>
    );
}
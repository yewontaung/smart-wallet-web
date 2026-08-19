import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface PinSheetProps {
    open: boolean;
    title: string;
    error?: string;
    submitting?: boolean;
    onCancel: () => void;
    onSubmit: (pin: string) => void;
}

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function PinSheet({ open, title, error, submitting, onCancel, onSubmit }: PinSheetProps) {
    const [pin, setPin] = useState("");

    useEffect(() => {
        if (!open) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPin("")
    }, [open]);

    if (!open) return null;

    const handleKey = (digit: string) => {
        if (submitting || pin.length >= PIN_LENGTH) return;
        const next = pin + digit;
        setPin(next);
        if (next.length === PIN_LENGTH) onSubmit(next);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="w-full rounded-t-3xl bg-neutral-900 px-6 pb-8 pt-5 text-white md:w-[40%]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-white/50">Enter PIN to confirm</p>
                        <p className="text-sm font-medium">{title}</p>
                    </div>
                    <button onClick={onCancel} className="rounded-full p-1.5 hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                    {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-3.5 w-3.5 rounded-full border border-white/40 ${
                                i < pin.length ? "bg-white" : "bg-transparent"
                            }`}
                        />
                    ))}
                </div>

                {error && <p className="mt-3 text-center text-xs text-red-400">{error}</p>}
                {submitting && <p className="mt-3 text-center text-xs text-white/50">Verifying…</p>}

                <div className="mt-6 grid grid-cols-3 gap-3">
                    {KEYS.map((key, i) =>
                        key === "" ? (
                            <div key={i} />
                        ) : (
                            <button
                                key={i}
                                disabled={submitting}
                                onClick={() => (key === "back" ? setPin((p) => p.slice(0, -1)) : handleKey(key))}
                                className="h-14 rounded-2xl bg-white/5 text-lg font-medium hover:bg-white/10 disabled:opacity-40"
                            >
                                {key === "back" ? "⌫" : key}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
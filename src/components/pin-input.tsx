import { useRef, useState } from "react";

export interface PinInputProps {
    length?: number;
    onComplete?: (pin: string) => void;
    onChange?: (pin: string) => void;
    autoFocus?: boolean;
    disabled?: boolean;
    error?: boolean;
}

export function PinInput({
    length = 6,
    onComplete,
    onChange,
    autoFocus = true,
    disabled = false,
    error = false,
}: PinInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const emit = (next: string[]) => {
        const pin = next.join("");
        onChange?.(pin);
        if (pin.length === length && next.every((v) => v !== "")) {
            onComplete?.(pin);
        }
    };

    const handleChange = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, "").slice(-1);
        const next = [...values];
        next[index] = digit;
        setValues(next);
        emit(next);

        if (digit && index < length - 1) {
            inputsRef.current[index + 1]?.focus({ preventScroll: true });
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus({ preventScroll: true });
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;
        const next = Array(length)
            .fill("")
            .map((_, i) => pasted[i] ?? "");
        setValues(next);
        emit(next);
        const lastFilled = Math.min(pasted.length, length) - 1;
        inputsRef.current[Math.max(lastFilled, 0)]?.focus({ preventScroll: true });
    };

    return (
        <div className="flex justify-center gap-2">
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    disabled={disabled}
                    autoFocus={autoFocus && index === 0}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    style={
                        {
                            WebkitTextSecurity: value ? "disc" : "none",
                        } as React.CSSProperties
                    }
                    className={`w-11 h-12 text-center text-xl rounded-lg border bg-white/5
                                outline-none transition-colors select-none
                                focus:border-white/40 focus:bg-white/10
                                disabled:opacity-50
                                ${error ? "border-red-500/70" : "border-white/15"}`}
                />
            ))}
        </div>
    );
}
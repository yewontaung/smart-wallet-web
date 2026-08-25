import { useState, type FormEvent, useEffect, useCallback } from "react";
import { ChevronRightIcon, LockIcon, WalletIcon, Loader2 } from "lucide-react";
import { PinInput } from "../../components/pin-input";
import { rememberWalletUser } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

/**
 * Visual Viewport Hook: Dynamically tracks keyboard height for mobile compatibility
 */
function useVisualViewportHeight() {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            setHeight(window.visualViewport?.height ?? window.innerHeight);
        };

        window.visualViewport.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
        };
    }, []);

    return height;
}

export function WalletRememberPage() {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { rememberToken, login } = useAuth();
    const navigate = useNavigate();

    const viewportHeight = useVisualViewportHeight();

    const onConfirm = useCallback(
        async (pinValue?: string) => {
            const pinToSubmit = pinValue ?? pin;
            if (pinToSubmit.length !== 6 || loading || !rememberToken) return;

            setLoading(true);
            setError("");
            try {
                const result = await rememberWalletUser({
                    pin: pinToSubmit,
                    rememberToken,
                });
                await login(result);
                navigate("/wallet");
            } catch {
                setError("Incorrect PIN. Please try again.");
                setPin("");
            } finally {
                setLoading(false);
            }
        },
        [pin, loading, rememberToken, login, navigate]
    );

    if (!rememberToken) return <Navigate to="/auth/wallet" replace />;

    const canConfirm = pin.length === 6 && !loading;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (canConfirm) onConfirm();
    };

    return (
        <div
            className="bg-transparent text-zinc-100 flex flex-col justify-between p-4 max-w-md w-full mx-auto overflow-hidden transition-[height] duration-75"
            style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }}
        >
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header Spacer */}
                <div className="h-10 shrink-0" />

                {/* Flat Brand Header */}
                <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                        <WalletIcon size={20} className="text-zinc-300" />
                    </div>
                    <h1 className="text-xl font-medium tracking-tight text-zinc-100">
                        Welcome back
                    </h1>
                    <p className="text-zinc-400 text-xs mt-1 text-center font-normal max-w-xs">
                        Enter your 6-digit PIN to access your wallet
                    </p>
                </div>

                {/* Main Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
                    <div className="space-y-3">
                        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-center">
                            <div className="inline-flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-medium tracking-wide mb-3">
                                <LockIcon size={12} />
                                <span>Security PIN</span>
                            </div>

                            <div className="py-1">
                                <PinInput
                                    autoFocus
                                    length={6}
                                    onChange={(v) => {
                                        setPin(v);
                                        if (error) setError("");
                                    }}
                                    onComplete={(completedPin) => onConfirm(completedPin)}
                                    error={!!error}
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-400 text-center mt-3 font-medium">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pb-2 pt-3 shrink-0">
                        <ContinueButton
                            type="submit"
                            disabled={!canConfirm}
                            label={loading ? "Logging in..." : "Login"}
                            loading={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ---------- Shared Continue Button ---------- */

function ContinueButton({
    onClick,
    disabled,
    label,
    loading = false,
    type = "button",
}: {
    onClick?: () => void;
    disabled?: boolean;
    label: string;
    loading?: boolean;
    type?: "button" | "submit";
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${
                disabled
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "theme text-white"
            } font-medium w-full rounded-xl h-12 px-4 text-base flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shrink-0`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin text-zinc-400" />
            ) : (
                <>
                    <span>{label}</span>
                    <ChevronRightIcon size={16} className={disabled ? "hidden" : "block"} />
                </>
            )}
        </button>
    );
}
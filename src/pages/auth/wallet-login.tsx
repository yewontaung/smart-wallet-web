import { useState, type FormEvent, useEffect, useCallback } from "react";
import { PhoneIcon, LockIcon, ChevronRightIcon, WalletIcon, Loader2 } from "lucide-react";
import { BackButton } from "../../components/ui/back-button";
import { PinInput } from "../../components/pin-input";
import { iconSize } from "../../utils/constants";
import { loginWalletUser, verifyWalletUserLogin } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

type Step = "phone" | "pin";

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

export function WalletLoginPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const { login, rememberToken, token } = useAuth();

    const viewportHeight = useVisualViewportHeight();

    const handleLogin = useCallback(async (pinValue?: string) => {
        const pinToSubmit = pinValue ?? pin;
        if (pinToSubmit.length !== 6 || loading) return;

        setLoading(true);
        setError("");
        try {
            const result = await verifyWalletUserLogin({
                pin: pinToSubmit,
                verificationToken,
            });
            await login(result);
            navigate("/wallet");
        } catch {
            setError("Incorrect PIN. Please try again.");
            setPin("");
        } finally {
            setLoading(false);
        }
    }, [pin, loading, verificationToken, login, navigate]);

    if (!token && rememberToken) return <Navigate to="/auth/wallet/remember" replace />;

    const verifyPhone = async () => {
        if (phone.trim().length < 6 || loading) return;
        setLoading(true);
        setError("");
        try {
            const result = await loginWalletUser({ phoneNo: phone.trim() });
            setVerificationToken(result.verificationToken);
            setStep("pin");
        } catch {
            setError("No account found with this phone number.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-transparent text-zinc-100 flex flex-col justify-between p-4 max-w-md w-full mx-auto overflow-hidden transition-[height] duration-75"
            style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }}
        >
            <div className="flex-1 flex flex-col min-h-0">
                {/* Minimal Header */}
                <div className="h-10 shrink-0 flex items-center justify-between mb-2">
                    {step === "pin" ? (
                        <BackButton
                            onClick={() => {
                                setStep("phone");
                                setError("");
                                setPin("");
                            }}
                        />
                    ) : <div />}
                    
                    {/* Step Dots Flow Indicator */}
                    <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${step === "phone" ? "bg-zinc-100" : "bg-zinc-700"}`} />
                        <span className={`h-1.5 w-1.5 rounded-full ${step === "pin" ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    </div>
                </div>

                {/* Flat Brand Header */}
                <div className="flex flex-col items-center mb-6 mt-2 shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                        <WalletIcon size={20} className="text-zinc-300" />
                    </div>
                    <h1 className="text-xl font-medium tracking-tight text-zinc-100">
                        {step === "phone" ? "Welcome back" : "Enter PIN"}
                    </h1>
                    <p className="text-zinc-400 text-xs mt-1 text-center font-normal max-w-xs">
                        {step === "phone"
                            ? "Enter your phone number to sign in"
                            : "Enter your 6-digit PIN to continue"}
                    </p>
                </div>

                {/* Step Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {step === "phone" && (
                        <PhoneStep
                            phone={phone}
                            setPhone={(v) => {
                                setPhone(v);
                                if (error) setError("");
                            }}
                            onContinue={verifyPhone}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {step === "pin" && (
                        <PinStep
                            pin={pin}
                            setPin={(v) => {
                                setPin(v);
                                if (error) setError("");
                            }}
                            onConfirm={handleLogin}
                            loading={loading}
                            error={error}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- Step 1: Phone ---------- */

function PhoneStep({
    phone,
    setPhone,
    onContinue,
    loading,
    error,
}: {
    phone: string;
    setPhone: (v: string) => void;
    onContinue: () => void;
    loading: boolean;
    error: string;
}) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
            <div className="space-y-3">
                <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-3 transition-colors focus-within:border-zinc-700">
                    <label htmlFor="phone-no" className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                        Phone Number
                    </label>
                    <div className="mt-1 flex items-center gap-2.5">
                        <PhoneIcon size={iconSize} className="text-zinc-500 shrink-0" />
                        <input
                            id="phone-no"
                            placeholder="Enter phone number"
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="tel"
                            data-lpignore="true"
                            autoFocus
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="outline-none grow bg-transparent text-base font-normal tracking-wide placeholder:text-zinc-600 text-zinc-100"
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-red-400 text-center font-medium">{error}</p>}
            </div>

            <div className="pb-2 pt-3 shrink-0">
                <ContinueButton
                    type="submit"
                    disabled={phone.trim().length < 6 || loading}
                    label={loading ? "Checking..." : "Continue"}
                    loading={loading}
                />
            </div>
        </form>
    );
}

/* ---------- Step 2: PIN ---------- */

function PinStep({
    pin,
    setPin,
    onConfirm,
    loading,
    error,
}: {
    pin: string;
    setPin: (v: string) => void;
    onConfirm: (pinVal?: string) => void;
    loading: boolean;
    error: string;
}) {
    const canConfirm = pin.length === 6 && !loading;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (canConfirm) onConfirm();
    };

    return (
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
                            onChange={setPin}
                            onComplete={(completedPin) => onConfirm(completedPin)}
                            error={!!error}
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-xs text-red-400 text-center mt-3 font-medium">{error}</p>}
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
            className={`${disabled ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed" : "theme text-white"} 
                       font-medium w-full rounded-xl h-12 px-4 text-base flex items-center justify-center gap-2
                       transition-colors active:scale-[0.99] shrink-0`}
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
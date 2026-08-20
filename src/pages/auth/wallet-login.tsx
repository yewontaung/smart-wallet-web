import { PhoneIcon, LockIcon, ChevronRightIcon, WalletIcon } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { BackButton } from "../../components/ui/back-button";
import { PinInput } from "../../components/pin-input";
import { iconSize } from "../../utils/constants";
import { loginWalletUser, verifyWalletUserLogin } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

type Step = "phone" | "pin";

/**
 * Visual Viewport Hook: Dynamically tracks keyboard height
 */
function useVisualViewportHeight() {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            // Read exact visible viewport height (subtracts soft keyboard height)
            setHeight(window.visualViewport?.height ?? window.innerHeight);
        };

        // Listen ONLY to resize (keyboard open/close) and ignore page scroll events
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

    if (!token && rememberToken) return <Navigate to="/auth/wallet/remember" replace />;

    const verifyPhone = async () => {
        if (phone.trim().length < 6 || loading) return;
        setLoading(true);
        setError("");
        try {
            const result = await loginWalletUser({ phoneNo: phone });
            setVerificationToken(result.verificationToken);
            setStep("pin");
        } catch {
            setError("No account found with this phone number.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (pin.length !== 6 || loading) return;
        setLoading(true);
        setError("");
        try {
            const result = await verifyWalletUserLogin({
                pin,
                verificationToken,
            });
            await login(result);
            navigate("/wallet");
        } catch {
            setError("Incorrect PIN. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="bg-black/90 text-white flex flex-col justify-between p-4 md:w-1/3 md:mx-auto overflow-hidden transition-[height] duration-75"
            style={{ height: viewportHeight ? `${viewportHeight}px` : "100dvh" }}
        >
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="p-2 relative mb-1 h-10 shrink-0">
                    {step === "pin" && (
                        <BackButton
                            onClick={() => {
                                setStep("phone");
                                setError("");
                                setPin("");
                            }}
                        />
                    )}
                </div>

                {/* Brand Header */}
                <div className="flex flex-col items-center mb-5 mt-1 shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-2.5">
                        <WalletIcon size={22} className="text-blue-400" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white/90">
                        Welcome back
                    </h1>
                    <p className="text-white/40 text-xs mt-1 text-center font-light leading-relaxed max-w-60">
                        {step === "phone"
                            ? "Enter your phone number to sign in"
                            : "Enter your 6-digit security PIN"}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-1.5 mb-5 px-1 shrink-0">
                    {(["phone", "pin"] as Step[]).map((s, i) => {
                        const currentIndex = step === "phone" ? 0 : 1;
                        return (
                            <div
                                key={s}
                                className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                                    i <= currentIndex ? "bg-blue-400" : "bg-white/10"
                                }`}
                            />
                        );
                    })}
                </div>

                {/* Dynamic Step Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {step === "phone" && (
                        <PhoneStep
                            phone={phone}
                            setPhone={setPhone}
                            onContinue={verifyPhone}
                            loading={loading}
                            error={error}
                        />
                    )}

                    {step === "pin" && (
                        <PinStep
                            pin={pin}
                            setPin={setPin}
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
            <div className="space-y-4">
                <div className="rounded-2xl bg-white/4 border border-white/5 px-4 py-3 transition-all focus-within:border-blue-500/40">
                    <label htmlFor="phone-no" className="text-[10px] uppercase tracking-wider text-blue-400/90 font-medium">
                        Phone Number
                    </label>
                    <div className="mt-1.5 flex items-center gap-3">
                        <PhoneIcon size={iconSize} className="text-white/40 shrink-0" />
                        <input
                            id="phone-no"
                            placeholder="Enter phone number"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            data-lpignore="true"
                            autoFocus
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="outline-0 grow bg-transparent text-base font-normal tracking-wide placeholder:text-white/20 text-white/90"
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-rose-400/90 text-center font-medium">{error}</p>}
            </div>

            <div className="pb-2 pt-3 shrink-0">
                <ContinueButton
                    type="submit"
                    disabled={phone.trim().length < 6 || loading}
                    label={loading ? "Checking..." : "Continue"}
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
    onConfirm: () => void;
    loading: boolean;
    error: string;
}) {
    const canConfirm = pin.length === 6 && !loading;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (canConfirm) onConfirm();
    };

    useEffect(() => {
        if (pin.length === 6 && !loading) {
            onConfirm();
        }
    }, [pin, loading, onConfirm]);

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
            <div className="space-y-3">
                <div className="rounded-2xl bg-white/4 border border-white/5 px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400/90 font-medium tracking-wide mb-3">
                        <LockIcon size={12} />
                        <span>Security Verification</span>
                    </div>

                    <div>
                        <PinInput autoFocus={false} length={6} onChange={setPin} error={!!error} disabled={loading} />
                    </div>

                    {error && <p className="text-xs text-rose-400/90 text-center mt-2.5 font-medium">{error}</p>}
                </div>
            </div>

            <div className="pb-2 pt-3 shrink-0">
                <ContinueButton
                    type="submit"
                    disabled={!canConfirm}
                    label={loading ? "Logging in..." : "Login"}
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
    type = "button",
}: {
    onClick?: () => void;
    disabled?: boolean;
    label: string;
    type?: "button" | "submit";
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${disabled ? "" : "theme"} font-semibold w-full rounded-full h-13 px-3 text-xl flex items-center justify-center gap-2
                       disabled:bg-transparent disabled:border disabled:border-white/20 disabled:backdrop-blur-2xl disabled:cursor-not-allowed transition-colors
                       active:scale-[0.98] shrink-0`}
        >
            <span>{label}</span>
            <ChevronRightIcon size={18} className={disabled ? "hidden" : "block"} />
        </button>
    );
}
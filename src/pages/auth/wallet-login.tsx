import { PhoneIcon, LockIcon, ChevronRightIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { BackButton } from "../../components/ui/back-button";
import { PinInput } from "../../components/pin-input";
import { iconSize } from "../../utils/constants";
import { loginWalletUser, verifyWalletUserLogin } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

type Step = "phone" | "pin";

export function WalletLoginPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verificationToken, setVerificationToken] = useState("")
    const {login, rememberToken, token} = useAuth()

    if(!token && rememberToken) return <Navigate to="/auth/wallet/remember" replace/>

    // Demo only — replace with real API call
    const verifyPhone = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await loginWalletUser({phoneNo: phone})
            setVerificationToken(result.verificationToken)
            setStep("pin");
        } catch {
            setError("No account found with this phone number.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await verifyWalletUserLogin({
                pin, verificationToken
            })
            await login(result)
            navigate("/wallet")
        } catch {
            setError("Incorrect PIN. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="bg-black/90 text-white min-h-screen flex justify-center">
            <div className="w-full p-4 md:w-1/3">
                {/* Header */}
                <div className="p-2 relative mb-2 h-10">
                    {step === "pin" && <BackButton onClick={() => { setStep("phone"); setError(""); }} />}
                </div>

                {/* Brand / intro */}
                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center mb-4">
                        <WalletIcon size={28} className="text-blue-300" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-white/50 text-sm mt-1 text-center">
                        {step === "phone"
                            ? "Login with your phone number to continue"
                            : "Enter your PIN to access your wallet"}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-7 px-1">
                    {(["phone", "pin"] as Step[]).map((s, i) => {
                        const currentIndex = step === "phone" ? 0 : 1;
                        return (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full flex-1 transition-colors ${
                                    i <= currentIndex ? "bg-blue-400" : "bg-white/10"
                                }`}
                            />
                        );
                    })}
                </div>

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
                        phone={phone}
                        pin={pin}
                        setPin={setPin}
                        onConfirm={handleLogin}
                        loading={loading}
                        error={error}
                    />
                )}
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
    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-white/6 px-4 py-4">
                <label htmlFor="phone-no" className="text-sm text-blue-400 font-medium tracking-wide">
                    Phone Number
                </label>
                <div className="mt-3 flex items-center gap-3">
                    <PhoneIcon size={iconSize} className="text-white/50" />
                    <input
                        id="phone-no"
                        placeholder="Enter phone number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="outline-0 grow bg-transparent text-xl placeholder:text-white/25"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center -mt-2">{error}</p>}

            <ContinueButton
                onClick={onContinue}
                disabled={phone.trim().length < 6 || loading}
                label={loading ? "Checking..." : "Continue"}
            />
        </div>
    );
}

/* ---------- Step 2: PIN ---------- */

function PinStep({
    phone,
    pin,
    setPin,
    onConfirm,
    loading,
    error,
}: {
    phone: string;
    pin: string;
    setPin: (v: string) => void;
    onConfirm: () => void;
    loading: boolean;
    error: string;
}) {
    const canConfirm = pin.length === 6 && !loading;

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-white/6 px-4 py-3 flex items-center gap-3">
                <PhoneIcon size={16} className="text-white/50" />
                <div className="text-base">{phone}</div>
            </div>

            <div className="rounded-2xl bg-white/6 px-4 py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-400 font-medium tracking-wide mb-5">
                    <LockIcon size={14} />
                    Enter your 6-digit PIN
                </div>
                <PinInput length={6} onChange={setPin} error={!!error} disabled={loading} />
                {error && <p className="text-sm text-red-400 text-center mt-3">{error}</p>}
            </div>

            <ContinueButton onClick={onConfirm} disabled={!canConfirm} label={loading ? "Logging in..." : "Login"} />
        </div>
    );
}

/* ---------- Shared continue button ---------- */

function ContinueButton({
    onClick,
    disabled,
    label,
}: {
    onClick: () => void;
    disabled?: boolean;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${disabled ? '' : 'theme'} font-semibold w-full rounded-full p-3 text-xl flex items-center justify-center gap-2
                       disabled:bg-transparent disabled:border disabled:border-white/20 disabled:backdrop-blur-2xl disabled:cursor-not-allowed transition-all
                       active:scale-[0.98]`}
        >
            {label}
            {!disabled && <ChevronRightIcon size={18} />}
        </button>
    );
}
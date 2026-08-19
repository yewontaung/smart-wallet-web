import { ChevronRightIcon, LockIcon, WalletIcon } from "lucide-react";
import { PinInput } from "../../components/pin-input";
import { useState } from "react";
import { rememberWalletUser } from "../../services/auth.service";
import { useAuth } from "../../hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";

export function WalletRememberPage() {

    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {rememberToken, login} = useAuth()
    const navigate = useNavigate()
    
    if(!rememberToken) return <Navigate to="/auth/wallet" replace/>

    const onConfirm = async () => {
        try {
            setLoading(true)
            const result = await rememberWalletUser({pin, rememberToken: rememberToken})
            await login(result)
            navigate("/wallet")
        } catch {
            setError("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const canConfirm = pin.length === 6 && !loading;


    return (
        <div className="bg-black/90 text-white min-h-screen flex justify-center">
            <div className="w-full p-4 md:w-1/3">

                {/* Brand / intro */}
                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center mb-4">
                        <WalletIcon size={28} className="text-blue-300" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-white/50 text-sm mt-1 text-center">
                        Enter your PIN to access your wallet
                    </p>
                </div>

                <div className="space-y-6">

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

            </div>
        </div>
    )
}

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
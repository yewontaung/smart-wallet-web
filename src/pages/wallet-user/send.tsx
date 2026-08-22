import { PhoneIcon, UserRoundIcon, WalletIcon, BanknoteIcon, StickyNoteIcon, ArrowRightIcon, LockIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { BackButton } from "../../components/ui/back-button";
import { PinInput } from "../../components/pin-input";
import { searchReceiver, transferMoney } from "../../services/wallet-user/action.service";
import type { ReceiverProfile } from "../../schemas/wallet/output";
import { useWallet } from "../../hooks/use-wallet";
import { useNavigate } from "react-router-dom";

type Step = "phone" | "details" | "pin";

export function SendPage() {
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [profile, setProfile] = useState<ReceiverProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [pin, setPin] = useState("");

    const { currentBalance, walletId } = useWallet();
    const [errorMessage, setErrorMessage] = useState("");
    const [transferring, setTransferring] = useState(false);
    const navigate = useNavigate();

    const lookupProfile = async () => {
        try {
            setLoadingProfile(true);
            setErrorMessage("");
            const result = await searchReceiver({ phoneNo: phone });
            setProfile(result);
            setStep("details");
        } catch (e) {
            if (e instanceof Error) setErrorMessage(e.message);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSend = async () => {
        if (!profile) return;
        try {
            setTransferring(true);
            const result = await transferMoney({
                amount: Number(amount),
                senderWalletId: walletId,
                receiverWalletId: profile?.walletId,
                note,
                pin,
            });
            navigate(`/wallet/transaction/${result.actionResult}`);
        } catch (e) {
            if (e instanceof Error) setErrorMessage(e.message);
        } finally {
            setTransferring(false);
        }
    };

    return (
        <div className="bg-neutral-950 text-white min-h-screen flex justify-center selection:bg-sky-500/20">
            <div className="w-full max-w-md p-4 pb-24 flex flex-col min-h-screen">
                {/* Header Section with Clean Glass Pill */}
                <div className="relative flex items-center justify-center py-3 mb-6">
                    <div className="absolute left-0 z-10">
                        <BackButton onClick={step === "phone" ? undefined : () => goBack(step, setStep)} />
                    </div>

                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                        <span className="text-xs font-normal tracking-wide text-white/90">Send Money</span>
                    </div>
                </div>

                {/* Account Balance Banner */}
                <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 mb-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-normal">
                        <WalletIcon size={15} className="text-sky-400/70" />
                        <span>Account Balance</span>
                    </div>
                    <div className="text-base font-normal text-white tracking-wide">
                        {currentBalance.toLocaleString()} <span className="text-xs text-white/50 font-normal">ks</span>
                    </div>
                </div>

                {/* Step Progress Bar */}
                <StepIndicator step={step} />

                {/* Step 1: Phone */}
                {step === "phone" && (
                    <PhoneStep
                        phone={phone}
                        setPhone={setPhone}
                        onContinue={lookupProfile}
                        loading={loadingProfile}
                        errorMessage={errorMessage}
                    />
                )}

                {/* Step 2: Details */}
                {(step === "details" || step === "pin") && profile && (
                    <DetailsStep
                        profile={profile}
                        amount={amount}
                        setAmount={setAmount}
                        note={note}
                        setNote={setNote}
                        balance={currentBalance}
                        onContinue={() => setStep("pin")}
                    />
                )}

                {/* Step 3: PIN Modal */}
                {step === "pin" && profile && (
                    <PinModal
                        profile={profile}
                        amount={amount}
                        onChange={setPin}
                        onConfirm={handleSend}
                        onClose={() => setStep("details")}
                        transferring={transferring}
                        errorMessage={errorMessage}
                    />
                )}
            </div>
        </div>
    );
}

function goBack(step: Step, setStep: (s: Step) => void) {
    if (step === "details") setStep("phone");
    if (step === "pin") setStep("details");
}

/* ---------- Step Indicator ---------- */

function StepIndicator({ step }: { step: Step }) {
    const steps: Step[] = ["phone", "details", "pin"];
    const currentIndex = steps.indexOf(step);

    return (
        <div className="flex items-center gap-2 mb-6 px-1">
            {steps.map((s, i) => (
                <div key={s} className="flex-1">
                    <div
                        className={`h-1 rounded-full transition-all duration-300 ${i <= currentIndex
                                ? "bg-linear-to-r from-blue-600 to-sky-400"
                                : "bg-white/10"
                            }`}
                    />
                </div>
            ))}
        </div>
    );
}

/* ---------- Step 1: Phone Input ---------- */

function PhoneStep({
    phone,
    setPhone,
    onContinue,
    loading,
    errorMessage,
}: {
    phone: string;
    setPhone: (v: string) => void;
    onContinue: () => void;
    loading: boolean;
    errorMessage?: string;
}) {
    return (
        <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 focus-within:border-sky-500/40 transition-colors">
                    <label htmlFor="phone-no" className="text-xs font-normal text-white/50 tracking-wide uppercase">
                        Recipient Phone
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                        <PhoneIcon size={18} className="text-sky-400/60 shrink-0" />
                        <input
                            id="phone-no"
                            placeholder="Enter phone number"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-transparent text-lg font-normal text-white placeholder:text-white/20 focus:outline-none"
                        />
                    </div>
                </div>
                {errorMessage && (
                    <p className="text-xs font-normal text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                        {errorMessage}
                    </p>
                )}
            </div>

            <ContinueButton
                onClick={onContinue}
                disabled={phone.trim().length < 6 || loading}
                label={loading ? "Searching..." : "Continue"}
                loading={loading}
            />
        </div>
    );
}

/* ---------- Step 2: Amount & Details ---------- */

function DetailsStep({
    profile,
    amount,
    setAmount,
    note,
    setNote,
    balance,
    onContinue,
}: {
    profile: ReceiverProfile;
    amount: string;
    setAmount: (v: string) => void;
    note: string;
    setNote: (v: string) => void;
    balance: number;
    onContinue: () => void;
}) {
    const numericAmount = Number(amount);
    const isValidAmount = amount.trim() !== "" && numericAmount > 0 && numericAmount <= balance;

    return (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
                {/* Receiver Profile Card */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-600/30 to-sky-500/30 border border-sky-400/30 flex items-center justify-center shrink-0">
                        <UserRoundIcon size={18} className="text-sky-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-normal text-white truncate">{profile.fullName}</div>
                        <div className="text-xs font-normal text-white/40">{profile.phoneNo}</div>
                    </div>
                </div>

                {/* Amount Input */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 focus-within:border-sky-500/40 transition-colors">
                    <div className="flex justify-between items-center">
                        <label htmlFor="amount" className="text-xs font-normal text-white/50 tracking-wide uppercase">
                            Transfer Amount
                        </label>
                        <span className="text-[11px] font-normal text-white/40">
                            Max: {balance.toLocaleString()} ks
                        </span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <BanknoteIcon size={18} className="text-sky-400/60 shrink-0" />
                        <input
                            id="amount"
                            placeholder="0"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            value={amount}
                            // Prevents typing negative sign and exponent notation
                            onKeyDown={(e) => {
                                if (["-", "e", "E", "+"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            // Prevents mouse wheel scrolling from changing the numeric value
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-xl font-normal text-white placeholder:text-white/20 focus:outline-none"
                        />                        <span className="text-xs font-normal text-white/40">ks</span>
                    </div>
                    {amount.trim() !== "" && numericAmount > balance && (
                        <p className="text-xs font-normal text-rose-400 pt-1">Amount exceeds available balance</p>
                    )}
                </div>

                {/* Optional Note */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2 focus-within:border-sky-500/40 transition-colors">
                    <label htmlFor="note" className="text-xs font-normal text-white/50 tracking-wide uppercase">
                        Note <span className="text-white/25 lowercase">(optional)</span>
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                        <StickyNoteIcon size={18} className="text-sky-400/60 shrink-0" />
                        <input
                            id="note"
                            placeholder="What is this for?"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-transparent text-sm font-normal text-white placeholder:text-white/20 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <ContinueButton onClick={onContinue} disabled={!isValidAmount} label="Continue" />
        </div>
    );
}

/* ---------- Step 3: PIN Modal ---------- */

function PinModal({
    profile,
    amount,
    onChange,
    onConfirm,
    onClose,
    transferring,
    errorMessage,
}: {
    profile: ReceiverProfile;
    amount: string;
    onChange: (v: string) => void;
    onConfirm: () => void;
    onClose: () => void;
    transferring?: boolean;
    errorMessage?: string;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/10 p-6 space-y-6 shadow-2xl mb-2 sm:mb-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                            <LockIcon size={14} />
                        </div>
                        <span className="text-xs font-normal text-white/90">Confirm Security PIN</span>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={transferring}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                {/* Summary View */}
                <div className="rounded-2xl bg-white/5 p-3.5 space-y-2 border border-white/5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-normal">Recipient</span>
                        <span className="text-white font-normal truncate max-w-40 text-right">{profile.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-white/50 font-normal">Amount</span>
                        <span className="text-sm font-normal text-white">
                            {Number(amount).toLocaleString()} <span className="text-xs text-white/50 font-normal">ks</span>
                        </span>
                    </div>
                </div>

                {/* PIN Input Box */}
                <div className="space-y-3 text-center">
                    <label className="text-xs font-normal text-white/60">Enter 6-digit Security PIN</label>
                    <div className="flex justify-center pt-1">
                        <PinInput length={6} onChange={onChange} />
                    </div>
                </div>

                {errorMessage && (
                    <p className="text-xs font-normal text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl text-center">
                        {errorMessage}
                    </p>
                )}

                <ContinueButton
                    onClick={onConfirm}
                    disabled={transferring}
                    label={transferring ? "Processing..." : "Confirm Transfer"}
                    loading={transferring}
                />
            </div>
        </div>
    );
}

/* ---------- Theme Gradient Button ---------- */

function ContinueButton({
    onClick,
    disabled,
    label,
    loading,
}: {
    onClick: () => void;
    disabled?: boolean;
    label: string;
    loading?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full h-12 rounded-2xl border border-sky-400/30 bg-linear-to-br from-blue-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-normal text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-sm"
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin text-white/80" />
            ) : (
                <>
                    <span>{label}</span>
                    <ArrowRightIcon size={15} />
                </>
            )}
        </button>
    );
}
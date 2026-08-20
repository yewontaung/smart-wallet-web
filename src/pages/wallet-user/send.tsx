import { PhoneIcon, UserRoundIcon, WalletIcon, BanknoteIcon, StickyNoteIcon, ChevronRightIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { BackButton } from "../../components/ui/back-button";
import { PinInput } from "../../components/pin-input";
import { iconSize } from "../../utils/constants";
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

    const { currentBalance, walletId } = useWallet()
    const [errorMessage, setErrorMessage] = useState("")
    const [transferring, setTransferring] = useState(false)
    const navigate = useNavigate()

    // Replace with real API call
    const lookupProfile = async () => {
        try {
            setLoadingProfile(true);
            const result = await searchReceiver({ phoneNo: phone })
            setProfile(result);
            setStep("details");
        } catch (e) {
            if (e instanceof Error)
                setErrorMessage(e.message)
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSend = async () => {

        if (!profile) return
        try {
            setTransferring(true)
            const result = await transferMoney({
                amount: Number(amount),
                senderWalletId: walletId,
                receiverWalletId: profile?.walletId,
                note,
                pin,
            })
            setTransferring(false)
            navigate(`/wallet/transaction/${result.actionResult}`)
        } finally {
            setTransferring(false)
        }
    };

    return (
        <div className="bg-white/10 text-white min-h-screen flex justify-center">
            <div className="w-full p-4 md:w-1/3 pb-24">
                {/* Title section */}
                <div className="p-2 relative">
                    <BackButton onClick={step === "phone" ? undefined : () => goBack(step, setStep)} />
                    <h4 className="text-2xl text-center mb-3">Send Money</h4>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between rounded-2xl bg-white/6 px-4 py-3 mb-6">
                    <div className="flex items-center gap-2 text-blue-400/80 text-sm">
                        <WalletIcon size={16} />
                        Account Balance
                    </div>
                    <div className="text-lg font-semibold">{currentBalance.toLocaleString()} ks</div>
                </div>

                {/* Step indicator */}
                <StepIndicator step={step} />

                {step === "phone" && (
                    <PhoneStep
                        phone={phone}
                        setPhone={setPhone}
                        onContinue={lookupProfile}
                        loading={loadingProfile}
                        errorMessage={errorMessage}
                    />
                )}

                {step === "details" && profile && (
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

                {step === "pin" && profile && (
                    <PinStep
                        profile={profile}
                        amount={amount}
                        pin={pin}
                        setPin={setPin}
                        onConfirm={handleSend}
                        transferring={transferring}
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

/* ---------- Step indicator ---------- */

function StepIndicator({ step }: { step: Step }) {
    const steps: Step[] = ["phone", "details", "pin"];
    const currentIndex = steps.indexOf(step);

    return (
        <div className="flex items-center gap-2 mb-7 px-1">
            {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                        className={`h-1.5 rounded-full flex-1 transition-colors ${i <= currentIndex ? "bg-blue-400" : "bg-white/10"
                            }`}
                    />
                </div>
            ))}
        </div>
    );
}

/* ---------- Step 1: Phone ---------- */

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
    errorMessage?: string
}) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-white/6 px-4 py-4">
                <label htmlFor="phone-no" className="text-sm text-blue-400/70 font-medium tracking-wide">
                    Phone Number
                </label>
                <div className="mt-3 flex items-center gap-3">
                    <PhoneIcon size={iconSize} />
                    <input
                        id="phone-no"
                        placeholder="Enter Phone number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="outline-0 grow bg-transparent text-xl placeholder:text-white/25"
                    />
                </div>
                {errorMessage && <span className="text-red-400">{errorMessage}</span>}
            </div>


            <ContinueButton
                onClick={onContinue}
                disabled={phone.trim().length < 6 || loading}
                label={loading ? "Searching..." : "Continue"}
            />
        </div>
    );
}

/* ---------- Step 2: Profile + Amount + Note ---------- */

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
        <div className="space-y-5">
            {/* Profile card */}
            <div className="rounded-2xl bg-white/6 px-4 py-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
                    <UserRoundIcon size={20} className="text-blue-300" />
                </div>
                <div>
                    <div className="text-base font-medium">{profile.fullName}</div>
                    <div className="text-sm text-white/50">{profile.phoneNo}</div>
                </div>
            </div>

            {/* Amount card */}
            <div className="rounded-2xl bg-white/6 px-4 py-4">
                <label htmlFor="amount" className="text-sm text-blue-400 font-medium tracking-wide">
                    Amount
                </label>
                <div className="mt-3 flex items-center gap-3">
                    <BanknoteIcon size={iconSize} className="text-white/50" />
                    <input
                        id="amount"
                        placeholder="0"
                        type="number"
                        inputMode="numeric"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="outline-0 grow bg-transparent text-xl placeholder:text-white/25"
                    />
                    <span className="text-white/40 text-sm">ks</span>
                </div>
                {amount.trim() !== "" && numericAmount > balance && (
                    <p className="text-xs text-red-400 mt-2">Amount exceeds your balance.</p>
                )}
            </div>

            {/* Note card */}
            <div className="rounded-2xl bg-white/6 px-4 py-4">
                <label htmlFor="note" className="text-sm text-blue-400 font-medium tracking-wide">
                    Note <span className="text-white/30 font-normal">(optional)</span>
                </label>
                <div className="mt-3 flex items-center gap-3">
                    <StickyNoteIcon size={iconSize} className="text-white/50" />
                    <input
                        id="note"
                        placeholder="What's this for?"
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="outline-0 grow bg-transparent text-lg placeholder:text-white/25"
                    />
                </div>
            </div>

            <ContinueButton onClick={onContinue} disabled={!isValidAmount} label="Continue" />
        </div>
    );
}

/* ---------- Step 3: PIN ---------- */

function PinStep({
    profile,
    amount,
    pin,
    setPin,
    onConfirm,
    transferring
}: {
    profile: ReceiverProfile;
    amount: string;
    pin: string;
    setPin: (v: string) => void;
    onConfirm: () => void;
    transferring?:boolean
}) {
    const canConfirm = pin.length === 6;

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-white/6 px-4 py-4 flex items-center justify-between">
                <div>
                    <div className="text-sm text-blue-400/70">Sending to</div>
                    <div className="text-base font-medium mt-1">{profile.fullName}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-blue-400/70">Amount</div>
                    <div className="text-lg font-semibold mt-1">
                        {Number(amount).toLocaleString()} ks
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white/6 px-4 py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-400 font-medium tracking-wide mb-5">
                    <LockIcon size={14} />
                    Enter your 6-digit PIN
                </div>
                <PinInput length={6} onChange={setPin} />
            </div>

            {transferring || <ContinueButton onClick={onConfirm} disabled={!canConfirm} label="Confirm & Send" />}
            {transferring && <div className="text-center">Sending...</div>}
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
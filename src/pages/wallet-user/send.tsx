import {
  PhoneIcon,
  UserRoundIcon,
  WalletIcon,
  BanknoteIcon,
  StickyNoteIcon,
  ArrowRightIcon,
  LockIcon,
  Loader2,
} from "lucide-react";
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
    <div className="bg-slate-950 text-slate-100 min-h-screen flex justify-center selection:bg-indigo-500/20">
      <div className="w-full max-w-md p-4 pb-24 flex flex-col min-h-screen">
        {/* Floating Back Button & Glass Pill Title Header */}
        <div className="relative flex items-center justify-center pt-2 pb-5">
          <div className="absolute left-0 top-2 z-30">
            <BackButton onClick={step === "phone" ? undefined : () => goBack(step, setStep)} />
          </div>

          <div className="bg-slate-900/80 border border-slate-700/60 backdrop-blur-md px-5 py-2 rounded-full shadow-sm">
            <h4 className="text-sm font-semibold tracking-wide text-slate-200">
              Send Money
            </h4>
          </div>
        </div>

        {/* Account Balance Banner */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-900/60 border border-slate-800 px-4 py-3.5 mb-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <WalletIcon size={16} className="text-indigo-400" />
            <span>Account Balance</span>
          </div>
          <div className="text-base font-semibold text-slate-100 tracking-wide">
            {currentBalance.toLocaleString()}{" "}
            <span className="text-xs text-slate-400 font-normal uppercase">ks</span>
          </div>
        </div>

        {/* Step Progress Indicator */}
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
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentIndex
                ? "bg-indigo-500 shadow-sm shadow-indigo-500/30"
                : "bg-slate-800/80"
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
        {/* Phone Container with pl-12 for Floating Back Button Alignment */}
        <div className="pl-12 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 focus-within:border-indigo-500/60 transition-colors shadow-sm">
          <label htmlFor="phone-no" className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Recipient Phone
          </label>
          <div className="flex items-center gap-3 pt-1">
            <PhoneIcon size={18} className="text-slate-400 shrink-0" />
            <input
              id="phone-no"
              placeholder="Enter phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>
        {errorMessage && (
          <p className="text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/50 p-3 rounded-xl">
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
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center gap-3 shadow-sm">
          <div className="h-10 w-10 rounded-full bg-indigo-950/50 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <UserRoundIcon size={18} className="text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-100 truncate">{profile.fullName}</div>
            <div className="text-xs font-medium text-slate-400">{profile.phoneNo}</div>
          </div>
        </div>

        {/* Amount Input Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 focus-within:border-indigo-500/60 transition-colors shadow-sm">
          <div className="flex justify-between items-center">
            <label htmlFor="amount" className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Transfer Amount
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              Max: {balance.toLocaleString()} ks
            </span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <BanknoteIcon size={18} className="text-slate-400 shrink-0" />
            <input
              id="amount"
              placeholder="0"
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onKeyDown={(e) => {
                if (["-", "e", "E", "+"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-xl font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <span className="text-xs font-medium text-slate-400 uppercase">ks</span>
          </div>
          {amount.trim() !== "" && numericAmount > balance && (
            <p className="text-xs font-medium text-rose-300 pt-1">Amount exceeds available balance</p>
          )}
        </div>

        {/* Optional Note Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2 focus-within:border-indigo-500/60 transition-colors shadow-sm">
          <label htmlFor="note" className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Note <span className="text-slate-500 lowercase">(optional)</span>
          </label>
          <div className="flex items-center gap-3 pt-1">
            <StickyNoteIcon size={18} className="text-slate-400 shrink-0" />
            <input
              id="note"
              placeholder="What is this for?"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:outline-none"
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl mb-2 sm:mb-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <LockIcon size={14} />
            </div>
            <span className="text-xs font-semibold text-slate-200">Confirm Security PIN</span>
          </div>
          <button
            onClick={onClose}
            disabled={transferring}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Transfer Summary */}
        <div className="rounded-2xl bg-slate-950/60 p-3.5 space-y-2 border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Recipient</span>
            <span className="text-slate-100 font-semibold truncate max-w-40 text-right">{profile.fullName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Amount</span>
            <span className="text-sm font-semibold text-slate-100">
              {Number(amount).toLocaleString()} <span className="text-xs text-slate-400 font-normal uppercase">ks</span>
            </span>
          </div>
        </div>

        {/* PIN Entry */}
        <div className="space-y-3 text-center">
          <label className="text-xs font-medium text-slate-400">Enter 6-digit Security PIN</label>
          <div className="flex justify-center pt-1">
            <PinInput length={6} onChange={onChange} />
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl text-center">
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

/* ---------- Action Button ---------- */

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
      className={`w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98] ${
        disabled
          ? "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
          : "theme text-white shadow-md shadow-indigo-950/50"
      }`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-white" />
      ) : (
        <>
          <span>{label}</span>
          <ArrowRightIcon size={16} />
        </>
      )}
    </button>
  );
}
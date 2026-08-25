import { Check, Loader2, PhoneIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../components/ui/back-button";
import { iconSize } from "../../utils/constants";
import { useModal } from "../../hooks/use-modal";
import { ConfirmModal } from "../../components/confirm-modal";
import { privateRequest } from "../../utils/api";
import type { ActionResult } from "../../schemas/wallet/output";

const PACKAGES = [
  500, 1000, 1500, 2000, 3000, 5000, 10000, 20000, 30000
];

export function TopUpPage() {
  const modal = useModal();
  const navigate = useNavigate();

  const [phoneNo, setPhoneNo] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAmount = selectedIndex !== null ? PACKAGES[selectedIndex] : null;

  const handleConfirm = async (pin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await privateRequest<ActionResult>("/wallet-user/action/mobile-topup", {
        method: "POST",
        body: {
          amount: selectedAmount,
          phoneNo: phoneNo,
          pin: pin,
        },
      });

      navigate(`/wallet/transaction/${result.actionResult}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err?.message || "Failed to process mobile topup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex justify-center">
      <div className="w-full p-4 md:w-1/3 flex flex-col">
        
        {/* Floating Back Button & Rounded Glass Pill Title */}
        <div className="relative flex items-center justify-center pt-2 pb-5">
          <div className="absolute left-0 top-2 z-30">
            <BackButton />
          </div>
          
          {/* Glass Pill Title */}
          <div className="bg-slate-900/80 border border-slate-700/60 backdrop-blur-md px-5 py-2 rounded-full shadow-sm">
            <h4 className="text-sm font-semibold tracking-wide text-slate-200">
              Mobile Topup
            </h4>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/40 p-3 text-center text-sm font-medium text-rose-300">
            {error}
          </div>
        )}

        {/* Phone Input Container — Offset with pl-12 to avoid floating back button overlap */}
        <div className="sticky top-2 z-20">
          <div className="pl-12 border border-slate-800 bg-slate-900/90 backdrop-blur-md rounded-2xl p-3.5 flex items-center gap-3 shadow-lg focus-within:border-indigo-500/60 transition-colors">
            <div className="text-slate-400 pl-1">
              <PhoneIcon size={iconSize} />
            </div>
            <input
              id="phone-no"
              placeholder="Enter phone number"
              type="tel"
              disabled={isLoading}
              value={phoneNo}
              onChange={(e) => {
                setError(null);
                setPhoneNo(e.target.value);
              }}
              className="outline-none grow text-xl font-medium bg-transparent placeholder:text-slate-500 disabled:opacity-50 text-slate-100"
            />
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 pb-24">
          {PACKAGES.map((amount, i) => (
            <PackageCard
              key={i}
              amount={amount}
              selected={selectedIndex === i}
              onSelect={() => {
                setError(null);
                setSelectedIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      {/* Pay Action Button */}
      <PayButton
        onClick={modal.open}
        disabled={selectedAmount === null || !phoneNo.trim() || isLoading}
        isLoading={isLoading}
        selectedAmount={selectedAmount}
      />

      {/* Confirm Modal */}
      {selectedAmount !== null && (
        <ConfirmModal
          amount={selectedAmount}
          balance={10000}
          onConfirm={handleConfirm}
          phoneNumber={phoneNo}
          isOpen={modal.isOpen}
          onClose={modal.close}
        />
      )}
    </div>
  );
}

function PackageCard({
  amount,
  selected,
  onSelect,
}: {
  amount: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative px-3 py-5 rounded-2xl flex flex-col justify-center items-center border transition-all outline-none
        ${
          selected
            ? "bg-indigo-950/40 border-indigo-500/70 text-slate-100 shadow-md shadow-indigo-950/50"
            : "bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98]"
        }`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-indigo-500 text-slate-950 flex items-center justify-center">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
      <div
        className={`text-center tracking-tight ${
          selected ? "text-xl font-bold text-slate-100" : "text-lg font-medium text-slate-300"
        }`}
      >
        {amount.toLocaleString()}
      </div>
      <span className={`text-xs mt-1 uppercase ${selected ? "text-indigo-300" : "text-slate-400"}`}>
        Ks
      </span>
    </button>
  );
}

function PayButton({
  onClick,
  disabled,
  isLoading,
  selectedAmount,
}: {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  selectedAmount: number | null;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full px-4 md:w-1/3 z-30">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex justify-center items-center gap-2 font-semibold rounded-2xl py-3.5 px-6 text-lg transition-all
          ${disabled ? "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed" : "theme text-white active:scale-[0.98]"}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
            <span>Processing...</span>
          </>
        ) : selectedAmount ? (
          <span>Pay {selectedAmount.toLocaleString()} Ks</span>
        ) : (
          <span>Confirm Payment</span>
        )}
      </button>
    </div>
  );
}
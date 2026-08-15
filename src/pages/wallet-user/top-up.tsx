import { PhoneIcon } from "lucide-react";
import { useState } from "react";
import { BackButton } from "../../components/ui/back-button";
import { iconSize } from "../../utils/constants";
import { useModal } from "../../hooks/use-modal";
import { ConfirmModal } from "../../components/confirm-modal";

const PACKAGES = [500, 1000, 1500, 2000, 3000, 5000, 500, 1000, 1500, 2000, 3000, 5000, 10000, 20000, 1000, 1500, 2000, 3000, 5000, 500, 1000, 1500, 2000, 3000, 5000, 10000, 20000];

export function TopUpPage() {
    const modal = useModal();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedAmount = selectedIndex !== null ? PACKAGES[selectedIndex] : null;

    return (
        <div className="bg-white/10 text-white min-h-screen flex justify-center">
            <div className="w-full p-4 md:w-1/3">
                {/* Title section */}
                <div className="p-2 relative">
                    <BackButton />
                    <h4 className="text-2xl text-center mb-3">Mobile Topup</h4>
                </div>

                {/* Phone input — liquid glass, sticky on scroll */}
                <div className="sticky top-2 z-20">
                    <div
                        className="mt-2 border border-white/15 flex gap-3 items-center rounded-full
                                   bg-white/10 backdrop-blur-2xl px-4 py-3
                                   shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_24px_-8px_rgba(0,0,0,0.6)]
                                   focus-within:bg-white/[0.14]
                                   transition-colors"
                    >
                        <PhoneIcon size={iconSize} />
                        <input
                            id="phone-no"
                            placeholder="Enter phone number"
                            type="tel"
                            className="outline-0 grow text-xl bg-transparent placeholder:text-white/30"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5 pb-20">
                    {PACKAGES.map((amount, i) => (
                        <PackageCard
                            key={i}
                            amount={amount}
                            selected={selectedIndex === i}
                            onSelect={() => setSelectedIndex(i)}
                        />
                    ))}
                </div>
            </div>

            <PayButton onClick={modal.open} disabled={selectedAmount === null} />

            {selectedAmount !== null && (
                <ConfirmModal
                    amount={selectedAmount}
                    balance={10000}
                    onConfirm={() => {}}
                    phoneNumber="0987654321"
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
            className={`px-4 py-8 rounded-2xl flex justify-center items-center border transition-all duration-150
                        ${
                            selected
                                ? "bg-blue-500/15 border-blue-400/60 shadow-[0_0_0_1px_rgba(52,211,153,0.3)]"
                                : "bg-white/10 border-transparent hover:bg-white/[0.14] active:scale-[0.97]"
                        }`}
        >
            <div
                className={`text-center tracking-tight ${
                    selected ? "text-blue-300 text-xl font-semibold" : "text-white/90 text-lg font-medium"
                }`}
            >
                {amount.toLocaleString()} ks
            </div>
        </button>
    );
}

function PayButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 ${disabled ? '' : 'theme'} font-semibold w-full md:w-1/3 rounded-full p-3 text-xl
                       disabled:cursor-not-allowed disabled:bg-transparent disabled:border disabled:border-white/20 disabled:backdrop-blur-2xl transition-opacity`}
        >
            Confirm Payment
        </button>
    );
}
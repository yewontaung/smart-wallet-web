import { useState } from "react";
import { Modal } from "./ui/modal";
import { PinInput } from "./pin-input";

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber: string;
    amount: number;
    balance: number;
    onConfirm: (pin: string) => void | Promise<void>;
    loading?: boolean;
    errorMessage?: string;
}

export function ConfirmModal({
    isOpen,
    onClose,
    phoneNumber,
    amount,
    balance,
    onConfirm,
    loading = false,
    errorMessage,
}: ConfirmModalProps) {
    const [pin, setPin] = useState("");

    const insufficientBalance = balance < amount;
    const canConfirm = pin.length === 6 && !insufficientBalance && !loading;

    const handleConfirm = async () => {
        if (!canConfirm) return;
        await onConfirm(pin);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Payment"
            id="confirm-topup"
            closeOnOverlayClick={!loading}
            closeOnEsc={!loading}
        >
            <div className="space-y-4">
                {/* Summary */}
                <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/10">
                    <Row label="Phone Number" value={phoneNumber} />
                    <Row label="Amount" value={`${amount.toLocaleString()} ks`} />
                    <Row
                        label="Account Balance"
                        value={`${balance.toLocaleString()} ks`}
                        valueClassName={insufficientBalance ? "text-red-400" : undefined}
                    />
                </div>

                {insufficientBalance ? (
                    <p className="text-sm text-red-400 text-center">
                        Insufficient balance to complete this payment.
                    </p>
                ) : (
                    <>
                        <div>
                            <p className="text-sm text-white/60 text-center mb-3">
                                Enter your 6-digit PIN to confirm
                            </p>
                            <PinInput
                                length={6}
                                disabled={loading}
                                error={!!errorMessage}
                                onChange={setPin}
                            />
                            {errorMessage && (
                                <p className="text-sm text-red-400 text-center mt-2">{errorMessage}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!canConfirm}
                            className="w-full rounded-full py-3 text-base font-semibold
                                       theme active:scale-[0.98]
                                       disabled:bg-white/10 disabled:text-white disabled:cursor-not-allowed
                                       transition-all"
                        >
                            {loading ? "Processing…" : "Confirm"}
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
}

function Row({
    label,
    value,
    valueClassName = "",
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-white/60">{label}</span>
            <span className={`text-base font-medium ${valueClassName}`}>{value}</span>
        </div>
    );
}
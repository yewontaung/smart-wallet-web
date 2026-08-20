import { useState } from "react";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    Clock3,
    Copy,
    XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import type { TransactionDetail, TransactionStatus } from "../../../schemas/shared/outputs";
import { formatAmount, formatDate } from "../../../utils/format";
import { useQuery } from "@tanstack/react-query";
import { getTransactionById } from "../../../services/wallet-user/transaction.service";



function maskPhone(phone: string) {
    if (phone.length <= 4) return phone;
    return `•••• ${phone.slice(-4)}`;
}

function getStatusIcon(status: TransactionStatus) {
    switch (status) {
        case "Completed":
            return <CheckCircle2 className="h-3.5 w-3.5" />;
        case "Pending":
            return <Clock3 className="h-3.5 w-3.5" />;
        case "Failed":
        case "Cancelled":
            return <XCircle className="h-3.5 w-3.5" />;
    }
}

function getStatusStyle(status: TransactionStatus) {
    switch (status) {
        case "Completed":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "Pending":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        case "Failed":
        case "Cancelled":
            return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
}

export default function WalletTransactionDetailPage() {

    const { trxId } = useParams<{ trxId: string }>();

    const { data: transaction, isLoading, isError } = useQuery({
        queryKey: ["transaction-detail"],
        enabled: !!trxId,
        queryFn: () => getTransactionById(trxId!)
    })

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-white/50">
                Loading transaction...
            </div>
        );
    }

    if (isError || !transaction) {
        return (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <XCircle className="h-8 w-8 text-rose-400" />

                <p className="mt-3 text-sm font-medium">
                    Transaction not found
                </p>

                <p className="mt-1 text-xs text-white/40">
                    We couldn't load this transaction.
                </p>
            </div>
        );
    }

    const isOutgoing = transaction.operation === "Transfer";

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-white">
            {/* Apple-style Floating Header Row (Fixed/Absolute Overlay) */}
            <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Floating Title Pill */}
                    <div className="flex h-10 items-center px-4 rounded-full border border-white/15 bg-transparent backdrop-blur-2xl shadow-lg">
                        <h1 className="text-xs font-semibold tracking-wide text-white/90">
                            Transaction Details
                        </h1>
                    </div>
                </div>

                {/* FloatedTopNavbar will naturally fit/align on the right side of this flex container */}
            </header>

            {/* Scrollable Main Content Container */}
            <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-16 pb-28 space-y-3">
                {/* Hero Card */}
                <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                    <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${isOutgoing
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                    >
                        {isOutgoing ? (
                            <ArrowUpRight className="h-5 w-5" />
                        ) : (
                            <ArrowDownLeft className="h-5 w-5" />
                        )}
                    </div>

                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-white/50">
                        {transaction.operation}
                    </p>

                    <p className="mt-0.5 text-2xl font-bold tracking-tight">
                        {formatAmount(transaction.amount)}{" "}
                        <span className="text-sm font-medium text-white/60">
                            MMK
                        </span>
                    </p>

                    {/* Status Badge */}
                    <div
                        className={`mx-auto mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${getStatusStyle(
                            transaction.status
                        )}`}
                    >
                        {getStatusIcon(transaction.status)}
                        <span>{transaction.status}</span>
                    </div>
                </section>

                {/* Transfer Flow Section */}
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <h2 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Transfer Parties
                    </h2>

                    <div className="relative space-y-2">
                        <WalletPerson
                            label="From"
                            wallet={transaction.senderWallet}
                        />

                        <div className="relative flex justify-center my-0.5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dashed border-white/10" />
                            </div>
                            <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/40 backdrop-blur-md">
                                <ArrowRight className="h-2.5 w-2.5 rotate-90" />
                            </div>
                        </div>

                        <WalletPerson
                            label="To"
                            wallet={transaction.receiverWallet}
                        />
                    </div>
                </section>

                {/* Metadata Details */}
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Transaction Info
                    </h2>

                    <div className="space-y-2.5">
                        <DetailRow
                            label="Transaction ID"
                            value={transaction.trxId}
                            copy
                        />
                        <DetailRow
                            label="Operation"
                            value={transaction.operation}
                        />
                        <DetailRow
                            label="Created"
                            value={formatDate(transaction.createdAt)}
                        />
                        <DetailRow
                            label="Updated"
                            value={formatDate(transaction.updatedAt)}
                        />

                        {transaction.note && (
                            <div className="pt-2 border-t border-white/5">
                                <span className="block text-[10px] text-white/40 mb-1">
                                    Note
                                </span>
                                <p className="text-xs text-white/80 rounded-lg bg-white/5 p-2.5 border border-white/5">
                                    {transaction.note}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

function WalletPerson({
    label,
    wallet,
}: {
    label: string;
    wallet: TransactionDetail["receiverWallet"];
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-white/3 p-2.5 border border-white/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10 text-xs font-semibold text-white/90">
                {wallet.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-medium text-white/90">
                        {wallet.fullName}
                    </p>
                    <span className="text-[9px] font-medium uppercase tracking-wider text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        {label}
                    </span>
                </div>
                <p className="text-[11px] text-white/40">
                    {maskPhone(wallet.phoneNo)}
                </p>
            </div>
        </div>
    );
}

function DetailRow({
    label,
    value,
    copy = false,
}: {
    label: string;
    value: string;
    copy?: boolean;
}) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="shrink-0 text-xs text-white/40">{label}</span>

            <div className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-right text-xs font-mono text-white/80">
                    {value}
                </span>

                {copy && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy to clipboard"
                        className="shrink-0 rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white active:scale-90"
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
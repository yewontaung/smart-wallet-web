import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import type { TransactionDetail } from "../../../schemas/shared/outputs";
import { formatAmount, formatDate } from "../../../utils/format";
import { useQuery } from "@tanstack/react-query";
import { getTransactionById } from "../../../services/wallet-user/transaction.service";
import type { TransactionStatus } from "../../../schemas/enums";
import { useAuth } from "../../../hooks/use-auth";

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
  const { user } = useAuth();

  const {
    data: transaction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction-detail", trxId],
    enabled: Boolean(trxId),
    queryFn: () => getTransactionById(trxId ?? ""),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Loading transaction...
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <XCircle className="h-8 w-8 text-rose-400" />
        <p className="mt-3 text-sm font-medium text-slate-200">
          Transaction not found
        </p>
        <p className="mt-1 text-xs text-slate-400">
          We couldn't load this transaction.
        </p>
      </div>
    );
  }

  const isOutgoing = transaction.senderWallet.userId === (user?.accountId ?? 0);
  const counterparty = isOutgoing
    ? transaction.receiverWallet
    : transaction.senderWallet;

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-slate-100">
      {/* Header */}
      <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex h-10 items-center px-4 rounded-full border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl shadow-lg">
            <h1 className="text-xs font-semibold tracking-wide text-slate-200">
              Transaction Details
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-16 pb-28 space-y-3">
        {/* Hero Card */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-center backdrop-blur-md shadow-sm">
          <div
            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border ${
              isOutgoing
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {isOutgoing ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownLeft className="h-5 w-5" />
            )}
          </div>

          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {transaction.operation}
          </p>

          <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-50">
            {isOutgoing ? "-" : "+"}
            {formatAmount(transaction.amount)}{" "}
            <span className="text-sm font-medium text-slate-400">MMK</span>
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

        {/* Counterparty Section */}
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-md shadow-sm">
          <h2 className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {isOutgoing ? "Sent To" : "Received From"}
          </h2>

          <CounterpartyCard wallet={counterparty} />
        </section>

        {/* Transaction Metadata */}
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-md shadow-sm">
          <h2 className="mb-3 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Transaction Info
          </h2>

          <div className="space-y-2.5">
            <DetailRow
              label="Transaction ID"
              value={transaction.trxId}
              copy
            />
            <DetailRow label="Operation" value={transaction.operation} />
            <DetailRow
              label="Created"
              value={formatDate(transaction.createdAt)}
            />
            <DetailRow
              label="Updated"
              value={formatDate(transaction.updatedAt)}
            />

            {transaction.note && (
              <div className="pt-2 border-t border-slate-800/60">
                <span className="block text-[10px] text-slate-400 mb-1">
                  Note
                </span>
                <p className="text-xs text-slate-300 rounded-lg bg-slate-950/40 p-2.5 border border-slate-800/50">
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

function CounterpartyCard({
  wallet,
}: {
  wallet: TransactionDetail["receiverWallet"];
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-800/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50 text-sm font-semibold text-slate-200">
        {wallet.fullName.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-200">
          {wallet.fullName}
        </p>
        <p className="mt-0.5 text-[11px] font-mono text-slate-400">
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
      <span className="shrink-0 text-xs text-slate-400">{label}</span>

      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-right text-xs font-mono text-slate-300">
          {value}
        </span>

        {copy && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy transaction ID"
            className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 active:scale-90"
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
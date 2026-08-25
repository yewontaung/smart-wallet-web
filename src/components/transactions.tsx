import { Link } from "react-router-dom";
import type { TransactionLogListItem } from "../schemas/shared/outputs";
import { ChevronRightIcon, ReceiptText, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { iconSize } from "../utils/constants";
import { formatDate } from "../utils/format";

export function TransactionListItem({ item }: { item?: TransactionLogListItem }) {
    if (!item) return null;

    return (
        <Link
            to={`/wallet/transaction/${item.trxId}`}
            className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-slate-800/40 active:bg-slate-800/70 rounded-xl transition-colors group"
        >
            {/* Left Info Group */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center bg-transparent">
                    {item.trxType === "Income" && <TrendingDownIcon size={iconSize} className="text-emerald-400" />}
                    {item.trxType === "Expense" && <TrendingUpIcon size={iconSize} className="text-rose-400" />}
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-100 truncate">
                        {item.trxType === "Income" ? "From" : "To"} {item.walletInfo?.fullName}
                    </div>

                    <small className="block truncate text-xs text-slate-400 font-normal">
                        {formatDate(item.createdAt)}
                    </small>

                    {/* Dedicated line for Note */}
                    {item.note && (
                        <p className="mt-1 text-xs text-slate-300 bg-slate-950/60 border border-slate-800/80 px-2 py-0.5 rounded-md truncate sm:max-w-xs">
                            {item.note}
                        </p>
                    )}
                </div>
            </div>

            {/* Right Amount & Visual Cue */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <div className={`text-sm font-semibold ${item.trxType === "Income" ? "text-emerald-400" : "text-slate-100"}`}>
                    {item.trxType === "Income" ? "+" : "-"} {item.amount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ks</span>
                </div>
                <ChevronRightIcon size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>
        </Link>
    );
}
export function TransactionList({ items = [] }: { items?: TransactionLogListItem[] }) {
    return (

        <div className="p-2 px-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mt-2 divide-y divide-slate-800/60 shadow-sm">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl my-2">
                    <ReceiptText size={18} /> {/* from lucide-react */}
                    <p className="text-sm font-medium text-zinc-300">No transactions yet</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-50">
                        Your recent activity and transactions will appear here.
                    </p>
                </div>
            ) : (
                items.map((i) => <TransactionListItem key={i.logId} item={i} />)
            )}        </div>
    );
}
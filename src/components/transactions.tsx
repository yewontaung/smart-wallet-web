import { Link } from "react-router-dom";
import type { TransactionLogListItem } from "../schemas/shared/outputs";
import { ChevronRightIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { iconSize } from "../utils/constants";

export function TransactionListItem({ item }: { item?: TransactionLogListItem }) {
    if (!item) return null;

    return (
        <Link
            to={`/wallet/transaction/${item.trxId}`}
            className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-slate-800/40 active:bg-slate-800/70 rounded-xl transition-colors group"
        >
            {/* Left Info Group */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-950 border border-slate-800">
                    {item.trxType === "Income" && <TrendingDownIcon size={iconSize} className="text-emerald-400" />}
                    {item.trxType === "Expense" && <TrendingUpIcon size={iconSize} className="text-rose-400" />}
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-100 truncate">
                        {item.trxType === "Income" ? "Received from" : "Sent to"} {item.walletInfo?.fullName}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                        <small className="truncate text-xs text-slate-400 font-normal shrink-0">
                            {item.createdAt}
                        </small>

                        {/* Optional Transaction Note */}
                        {item.note && (
                            <span className="truncate text-[11px] text-slate-300 bg-slate-950/60 border border-slate-800/80 px-2 py-0.5 rounded-md max-w-40">
                                {item.note}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Amount & Visual Cue */}
            <div className="flex items-center gap-2 shrink-0">
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
            {items.map(i => <TransactionListItem key={i.logId} item={i} />)}
        </div>
    );
}
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Search,
} from "lucide-react";
import { getMyTransactionLogs } from "../../../services/wallet-user/me.service";
import { TransactionList } from "../../../components/transactions";

// Types & DTOs
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | string;
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED" | string;

export default function WalletTransactionListPage() {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["transaction-logs", page, pageSize, searchQuery],
        queryFn: () => getMyTransactionLogs(page, pageSize, searchQuery),
        placeholderData: keepPreviousData, // <--- Replaced keepPreviousData: true
    });

    const transactions = data?.items ?? [];
    const totalPages = data?.pages ?? 1;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page on search
    };

    return (
        <div className="flex flex-col gap-4 px-4 pt-20 pb-24 text-slate-100 max-w-2xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between py-2">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-50">
                        Transaction History
                    </h1>
                    <p className="text-xs text-slate-400">
                        View and manage your account activity
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by ID, operation, or note..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 backdrop-blur-md outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
            </div>

            {/* Transactions List */}
            <div className="flex flex-col gap-2.5">
                {isLoading ? (
                    <div className="flex py-16 items-center justify-center text-xs text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin mr-2 text-indigo-400" />
                        Loading transaction history...
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-rose-500/30 rounded-2xl bg-rose-500/5">
                        <p className="text-xs font-medium text-rose-400">
                            Failed to load transaction logs
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 text-[11px] text-indigo-400 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                        <p className="text-xs font-medium text-slate-300">
                            No transactions found
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            {searchQuery
                                ? "Try searching with a different term"
                                : "You have no transaction records yet"}
                        </p>
                    </div>
                ) : (
                    <TransactionList items={transactions} />
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-2">
                    <p className="text-xs text-slate-400">
                        Page <span className="text-slate-200 font-semibold">{page}</span> of{" "}
                        <span className="text-slate-200 font-semibold">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="flex h-8 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            className="flex h-8 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
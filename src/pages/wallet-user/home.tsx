import { ArrowDownLeft, ArrowUpRight, ChevronRightIcon, CreditCardIcon, Eye, EyeOff, ListIcon, SmartphoneIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { iconSize } from "../../utils/constants"
import { useState, type ReactNode } from "react"
import { formatAccountNumber, formatAmount } from "../../utils/format"
import { useQuery } from "@tanstack/react-query"
import { getMyBalance, getMyTransactionLogs } from "../../services/wallet-user/me.service"
import { TransactionList } from "../../components/transactions"

export function HomePage() {
    const { data: pageResult, isLoading } = useQuery({
        queryKey: ["wallet-me-logs"],
        queryFn: () => getMyTransactionLogs(),
    })
    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen">
            {/* Balance section */}
            <section className="p-10 relative">
                <BalanceCard />
                {/* Buttons section */}
                <ActionButtons />
            </section>
            {/* Transaction section */}
            <section className="px-5 pb-32 mt-10">
                <div className="flex justify-between items-center mb-3">
                    <h6 className="font-bold text-slate-100">Recent Transactions</h6>
                    <Link className="rounded-full w-10 h-10 p-1 bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex justify-center items-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm" to={"/wallet/transaction"}>
                        <ListIcon size={iconSize} />
                    </Link>
                </div>
                {isLoading && <div className="text-center text-slate-400 py-6">Loading...</div>}
                {isLoading || <TransactionList items={pageResult?.items} />}
            </section>
        </div>
    )
}

function ActionButtons() {
    return (
        <div className="flex justify-evenly items-center absolute -bottom-7 px-3 left-1/2 -translate-x-1/2 w-[95%]">
            <ActionBtn link="/action/topup" label="Top Up" icon={<SmartphoneIcon size={iconSize} />} />
            {/* <ActionBtn label="Receive" icon={<ArrowDownLeft size={iconSize} />} /> */}
            <ActionBtn link="/action/send" label="Send" icon={<ArrowUpRight size={iconSize} />} />
            {/* <ActionBtn label="Pay bill" icon={<CreditCardIcon size={iconSize} />} /> */}
        </div>
    )
}

function ActionBtn({ onClick, label, icon, link = "" }: { link?: string, label?: string, icon: ReactNode, onClick?: () => void }) {
    return (
        <Link to={link} className="text-center group">
            <button 
                onClick={onClick} 
                className="flex mb-1 border rounded-full border-slate-700/60 bg-transparent p-3 w-16 h-16 backdrop-blur-2xl justify-center items-center text-slate-100 group-hover:scale-105 active:scale-95 transition-all shadow-md"
            >
                {icon}
            </button>
            <small className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{label}</small>
        </Link>
    )
}

function BalanceCard() {
    const [showBalance, setShowBalance] = useState(false);

    const {
        data: balanceInfo,
        isLoading,
    } = useQuery({
        queryKey: ["wallet-me-balance"],
        queryFn: () => getMyBalance(),
    });

    return (
        <div className="flex items-center rounded-2xl border border-sky-400/30 bg-linear-to-br from-blue-600 via-indigo-600 to-sky-500 p-5 py-10 shadow-lg">
            <div className="w-full">
                {/* Account info */}
                <div className="mb-3 flex items-center px-2">
                    {isLoading ? (
                        <div className="h-4 w-36 animate-pulse rounded-md bg-white/20" />
                    ) : (
                        <>
                            <span className="text-sm text-sky-100 font-medium">
                                Acc:{" "}
                                {showBalance
                                    ? balanceInfo?.phoneNo
                                    : formatAccountNumber(
                                        balanceInfo?.phoneNo ?? ""
                                    )}
                            </span>
                        </>
                    )}

                    {/* Visibility button */}
                    {!isLoading && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowBalance((prev) => !prev)
                            }
                            className="rounded-full p-1.5 text-white/70 ms-5 transition hover:bg-white/10 hover:text-white"
                            aria-label={
                                showBalance
                                    ? "Hide balance"
                                    : "Show balance"
                            }
                        >
                            {showBalance ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}

                </div>

                {/* Balance */}
                <div className="flex items-center">
                    {isLoading ? (
                        <div className="h-9 w-48 animate-pulse rounded-lg bg-white/20" />
                    ) : (
                        <span className="me-2 whitespace-nowrap text-[clamp(1.25rem,6vw,1.875rem)] font-bold text-white tracking-tight">
                            {showBalance
                                ? `${formatAmount(
                                    balanceInfo?.currentBalance ?? 0
                                )} MMK`
                                : "•••••••• MMK"}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}
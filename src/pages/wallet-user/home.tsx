import { ArrowDownLeft, ArrowUpRight, ChevronRightIcon, CreditCardIcon, Eye, EyeOff, ListIcon, SmartphoneIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { iconSize } from "../../utils/constants"
import type { TransactionLogListItem } from "../../schemas/shared/outputs"
import { useState, type ReactNode } from "react"
import { formatAccountNumber, formatAmount } from "../../utils/format"
import { useQuery } from "@tanstack/react-query"
import { getMyBalance, getMyTransactionLogs } from "../../services/wallet-user/me.service"

export function HomePage() {
    const { data: pageResult, isLoading } = useQuery({
        queryKey: ["wallet-me-logs"],
        queryFn: () => getMyTransactionLogs(),
    })
    return (
        <>
            {/* Balance section */}
            <section className="p-10 relative">
                <BalanceCard />
                {/* Buttons section */}
                <ActionButtons />
            </section>
            {/* Transaction section */}
            <section className="px-5 pb-32 mt-10">
                <div className="flex justify-between items-center mb-3">
                    <h6 className="font-bold">Recent Transactions</h6>
                    <Link className="rounded-full w-10 h-10 p-1 bg-white/5 flex justify-center items-center" to={""}>
                        <ListIcon size={iconSize} />
                    </Link>
                </div>
                {isLoading && <div className="text-center">Loading...</div>}
                {isLoading || <TransactionList items={pageResult?.items} />}
            </section>
        </>
    )
}

function TransactionList({ items = [] }: { items?: TransactionLogListItem[] }) {
    return (
        <div className="p-2 px-4 rounded-2xl bg-white/10 mt-2 divide-y divide-white/10">
            {items.map(i => <TransactionListItem key={i.logId} item={i} />)}
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
        <Link to={link} className="text-center">
            <button onClick={onClick} className="flex mb-1 border rounded-full border-white/20 p-3 w-16 h-16 backdrop-blur-2xl justify-center items-center">
                {icon}
            </button>
            <small>{label}</small>
        </Link>
    )
}


function TransactionListItem({ item }: { item?: TransactionLogListItem }) {
    if (!item) return null;

    return (
        <Link
            to={`/wallet/transaction/${item.trxId}`}
            className="flex items-center justify-between gap-3 px-3 py-3 hover:bg-white/5 active:bg-white/10 transition-colors group"
        >
            {/* Left Info Group */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                    {item.trxType === "Income" && <TrendingDownIcon size={iconSize} className="text-emerald-400" />}
                    {item.trxType === "Expense" && <TrendingUpIcon size={iconSize} className="text-rose-400" />}
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-normal text-white/90 truncate">
                        {item.trxType === "Income" ? "Received from" : "Sent to"} {item.walletInfo?.fullName}
                    </div>

                    <small className="block truncate text-xs text-white/40 font-normal">
                        {item.createdAt}
                    </small>
                </div>
            </div>

            {/* Right Amount & Visual Cue */}
            <div className="flex items-center gap-2 shrink-0">
                <div className={`text-sm font-normal ${item.trxType === "Income" ? "text-emerald-400" : "text-white/80"}`}>
                    {item.trxType === "Income" ? "+" : "-"} {item.amount.toLocaleString()} <span className="text-xs text-white/40">ks</span>
                </div>
                <ChevronRightIcon size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
        </Link>
    );
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
        <div className="flex items-center rounded-2xl border border-sky-400/30 bg-linear-to-br from-blue-600 via-indigo-600 to-sky-500 p-5 py-10">
            <div className="w-full">
                {/* Account info */}
                <div className="mb-3 flex items-center px-2">
                    {isLoading ? (
                        <div className="h-4 w-36 animate-pulse rounded-md bg-white/20" />
                    ) : (
                        <>
                            <span>
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
                            className="rounded-full p-1.5 text-white/60 ms-5 transition hover:bg-white/10 hover:text-white"
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
                        <span className="me-2 whitespace-nowrap text-[clamp(1.25rem,6vw,1.875rem)] font-bold">
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
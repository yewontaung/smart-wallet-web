import { ArrowDownLeft, ArrowUpRight, CreditCardIcon, EyeOff, ListIcon, SmartphoneIcon, TrendingDownIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { iconSize } from "../../utils/constants"
import type { TransactionLogListItem } from "../../schemas/shared/outputs"
import type { ReactNode } from "react"

export function HomePage() {
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
                <TransactionList />
            </section>
        </>
    )
}

function TransactionList({items = []}:{items?:TransactionLogListItem[]}) {
    return (
        <div className="p-2 px-4 rounded-2xl bg-white/10 mt-2">
            {items.map(i => <TransactionListItem item={i} />)}
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
            <TransactionListItem />
        </div>
    )
}

function ActionButtons() {
    return (
        <div className="flex justify-evenly items-center absolute -bottom-7 px-3 left-1/2 -translate-x-1/2 w-[95%]">
            <ActionBtn label="Top Up" icon={<SmartphoneIcon size={iconSize} />} />
            <ActionBtn label="Receive" icon={<ArrowDownLeft size={iconSize} />} />
            <ActionBtn label="Send" icon={<ArrowUpRight size={iconSize} />} />
            <ActionBtn label="Pay bill" icon={<CreditCardIcon size={iconSize} />} />
        </div>
    )
}

function ActionBtn({onClick, label, icon}:{label?:string, icon:ReactNode, onClick?:() => void}) {
    return (
        <div className="text-center">
            <button onClick={onClick} className="flex mb-1 border rounded-full border-white/20 p-3 w-16 h-16 backdrop-blur-2xl justify-center items-center">
                {icon}
            </button>
            <small>{label}</small>
        </div>
    )
}

function TransactionListItem({ item }: { item?: TransactionLogListItem }) {
    return (
        <div className="flex items-center justify-between gap-4 px-3 py-3 border-b border-white/20">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-green-400">
                    <TrendingDownIcon size={iconSize} />
                </div>

                <div className="min-w-0">
                    <div className="font-bold">
                        Receive from Mg Mg
                    </div>

                    <small className="block truncate text-gray-500">
                        12.08.2026 12:44
                    </small>
                </div>
            </div>

            <div className="shrink-0 font-semibold text-green-400">
                +1,000,000
            </div>
        </div>
    )
}

function BalanceCard() {
    return (
        <div className="border border-sky-400/30 bg-linear-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-2xl p-5 py-10 flex items-center">
            <div>
                {/* Account inof */}
                <div className="mb-3 px-2 flex items-center">Acc: ******* 2492 <EyeOff className="ms-3 w-3.5 h-3.5" /></div>
                {/* Balance */}
                <span className="text-4xl font-bold me-2">10000000</span><small>.02 mmk</small>
            </div>
        </div>
    )
}
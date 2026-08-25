import { useEffect, useState } from "react"
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock3,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react"

import {
    getManagerAccounts,
    type AccountListResponse,
} from "../../services/manager/account.service"

import {
    getManagerBusinesses,
    type BusinessListResponse,
} from "../../services/manager/business.service"

import {
    getManagerTransactions,
    type TransactionListResponse,
} from "../../services/manager/transaction.service"

import {
    getBusinessRequests,
    type BusinessRequestListResponse,
} from "../../services/manager/business-request.service"


function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US").format(value)
}


function formatCurrency(value: number): string {
    return `MMK ${formatNumber(value)}`
}


function getInitial(name: string): string {
    return name?.charAt(0).toUpperCase() || "?"
}


function getAccountStatusClass(status: string): string {
    switch (status.toLowerCase()) {
        case "verified":
            return "bg-emerald-500/10 text-emerald-400"

        case "pending":
            return "bg-amber-500/10 text-amber-400"

        case "freeze":
        case "frozen":
            return "bg-red-500/10 text-red-400"

        default:
            return "bg-zinc-800 text-zinc-400"
    }
}


function getBusinessStatusClass(status: string): string {
    return status.toLowerCase() === "open"
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-zinc-800 text-zinc-500"
}


export default function DashboardPage() {
    const [accountsResponse, setAccountsResponse] =
        useState<AccountListResponse | null>(null)

    const [businessesResponse, setBusinessesResponse] =
        useState<BusinessListResponse | null>(null)

    const [transactionsResponse, setTransactionsResponse] =
        useState<TransactionListResponse | null>(null)

    const [businessRequestsResponse, setBusinessRequestsResponse] =
        useState<BusinessRequestListResponse | null>(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        let cancelled = false

        async function loadDashboard() {
            try {
                setLoading(true)
                setError(null)

                const [
                    accountsData,
                    businessesData,
                    transactionsData,
                    businessRequestsData,
                ] = await Promise.all([
                    getManagerAccounts(),
                    getManagerBusinesses(),
                    getManagerTransactions(),
                    getBusinessRequests(),
                ])

                if (cancelled) {
                    return
                }

                setAccountsResponse(accountsData)
                setBusinessesResponse(businessesData)
                setTransactionsResponse(transactionsData)
                setBusinessRequestsResponse(businessRequestsData)
            } catch (err) {
                if (cancelled) {
                    return
                }

                console.error(
                    "Failed to load manager dashboard:",
                    err,
                )

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load dashboard data.",
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadDashboard()

        return () => {
            cancelled = true
        }
    }, [])


    /*
     * Real API data
     */

    const accounts = accountsResponse?.items ?? []

    const businesses = businessesResponse?.items ?? []

    const transactions = transactionsResponse?.items ?? []

    const businessRequests =
        businessRequestsResponse?.items ?? []


    /*
     * Real totals returned by backend
     */

    const totalAccounts =
        accountsResponse?.total ?? 0

    const totalBusinesses =
        businessesResponse?.total ?? 0

    const totalTransactions =
        transactionsResponse?.total ?? 0

    const totalBusinessRequests =
        businessRequestsResponse?.total ?? 0


    /*
     * Calculate total balance from real account data
     */

    const totalBalance = accounts.reduce(
        (sum, account) =>
            sum + Number(account.currentBalance || 0),
        0,
    )


    /*
     * Calculate account statuses from real API data
     */

    const verifiedAccounts = accounts.filter(
        (account) =>
            account.accountStatus.toLowerCase() ===
            "verified",
    ).length

    const pendingAccounts = accounts.filter(
        (account) =>
            account.accountStatus.toLowerCase() ===
            "pending",
    ).length


    /*
     * Calculate open businesses from real API data
     */

    const openBusinesses = businesses.filter(
        (business) =>
            business.status.toLowerCase() === "open",
    ).length


    /*
     * Dashboard statistic cards
     */

    const stats = [
        {
            title: "Total Accounts",
            value: formatNumber(totalAccounts),
            description: "Registered wallet accounts",
            icon: Users,
        },
        {
            title: "Total Balance",
            value: formatCurrency(totalBalance),
            description: "Current balance",
            icon: Wallet,
        },
        {
            title: "Businesses",
            value: formatNumber(totalBusinesses),
            description: "Registered businesses",
            icon: Building2,
        },
        {
            title: "Transactions",
            value: formatNumber(totalTransactions),
            description: "Recorded transactions",
            icon: TrendingUp,
        },
        {
            title: "Business Requests",
            value: formatNumber(totalBusinessRequests),
            description: "Business registration requests",
            icon: Clock3,
        },
    ]


    return (
        <div className="space-y-6">

            {/* Welcome */}

            <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-zinc-900 to-sky-950/40 p-6">

                <div className="relative z-10">

                    <p className="text-sm font-medium text-sky-400">
                        Manager Portal
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        Welcome back, Manager 👋
                    </h1>

                    <p className="mt-2 max-w-xl text-sm text-zinc-400">
                        Here's an overview of your Smart Wallet
                        platform. Monitor accounts, businesses,
                        business requests and activity from one
                        place.
                    </p>

                    <div className="mt-5">
                    <a
                        href="/manager/managers"
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
                       >
                    <Users className="h-4 w-4" />
                     View Managers
                    </a>
                    </div>

                </div>

                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            </section>




            {/* Error */}

            {error && (
                <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

                    <p className="text-sm font-medium text-red-400">
                        Failed to load dashboard
                    </p>

                    <p className="mt-1 text-sm text-red-300/70">
                        {error}
                    </p>

                </section>
            )}


            {/* Statistics */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <div
                            key={stat.title}
                            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-zinc-700"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10">

                                    <Icon className="h-5 w-5 text-sky-400" />

                                </div>

                                <div className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-400">

                                    <ArrowUpRight className="h-3.5 w-3.5" />

                                    Live

                                </div>

                            </div>

                            <p className="mt-5 text-sm text-zinc-500">
                                {stat.title}
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {loading ? "..." : stat.value}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                {stat.description}
                            </p>

                        </div>
                    )
                })}

            </section>


            {/* Business Requests */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900">

                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">

                            <Clock3 className="h-5 w-5 text-amber-400" />

                        </div>

                        <div>

                            <h2 className="font-semibold text-zinc-100">
                                Business Requests
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Review business registration requests
                            </p>

                        </div>

                    </div>

                    <a
                        href="/manager/business-requests"
                        className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
                    >
                        Review Requests
                    </a>

                </div>


                <div className="p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-zinc-500">
                                Total Requests
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-white">
                                {loading
                                    ? "..."
                                    : formatNumber(
                                          totalBusinessRequests,
                                      )}
                            </p>

                        </div>

                        <div className="rounded-xl bg-amber-500/10 px-4 py-3 text-right">

                            <p className="text-xs text-zinc-500">
                                Requests available
                            </p>

                            <p className="mt-1 text-sm font-medium text-amber-400">
                                {loading
                                    ? "Loading..."
                                    : businessRequests.length > 0
                                      ? "Review required"
                                      : "No requests"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* Main Grid */}

            <div className="grid gap-6 xl:grid-cols-3">

                {/* Recent Accounts */}

                <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 xl:col-span-2">

                    <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                        <div>

                            <h2 className="font-semibold text-zinc-100">
                                Recent Accounts
                            </h2>

                            <p className="mt-1 text-xs text-zinc-500">
                                Recently created wallet accounts
                            </p>

                        </div>

                        <a
                            href="/manager/accounts"
                            className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
                        >
                            View all
                        </a>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="border-b border-zinc-800 bg-zinc-950/40">

                                <tr>

                                    <th className="px-5 py-3 font-medium text-zinc-500">
                                        Account
                                    </th>

                                    <th className="px-5 py-3 font-medium text-zinc-500">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3 font-medium text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium text-zinc-500">
                                        Balance
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-zinc-800">

                                {loading && (
                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="px-5 py-8 text-center text-sm text-zinc-500"
                                        >
                                            Loading accounts...
                                        </td>

                                    </tr>
                                )}


                                {!loading &&
                                    accounts.length === 0 && (
                                        <tr>

                                            <td
                                                colSpan={4}
                                                className="px-5 py-8 text-center text-sm text-zinc-500"
                                            >
                                                No accounts found.
                                            </td>

                                        </tr>
                                    )}


                                {!loading &&
                                    accounts
                                        .slice(0, 5)
                                        .map((account) => (
                                            <tr
                                                key={account.userId}
                                                className="transition hover:bg-zinc-800/40"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-sky-400">

                                                            {getInitial(
                                                                account.fullName,
                                                            )}

                                                        </div>

                                                        <span className="font-medium text-zinc-200">
                                                            {
                                                                account.fullName
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                <td className="px-5 py-4 text-zinc-500">
                                                    {account.phoneNo}
                                                </td>


                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getAccountStatusClass(
                                                            account.accountStatus,
                                                        )}`}
                                                    >
                                                        {
                                                            account.accountStatus
                                                        }
                                                    </span>

                                                </td>


                                                <td className="px-5 py-4 text-right font-medium text-zinc-200">

                                                    {formatNumber(
                                                        Number(
                                                            account.currentBalance ||
                                                                0,
                                                        ),
                                                    )}

                                                </td>

                                            </tr>
                                        ))}

                            </tbody>

                        </table>

                    </div>

                </section>


                {/* Platform Overview */}

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900">

                    <div className="border-b border-zinc-800 px-5 py-4">

                        <h2 className="font-semibold text-zinc-100">
                            Platform Overview
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Current platform status
                        </p>

                    </div>


                    <div className="space-y-5 p-5">

                        {/* Verified */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">

                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-zinc-200">
                                        Verified Accounts
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Active wallet users
                                    </p>

                                </div>

                            </div>

                            <span className="font-semibold text-zinc-100">
                                {loading
                                    ? "..."
                                    : verifiedAccounts}
                            </span>

                        </div>


                        {/* Pending */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">

                                    <Clock3 className="h-4 w-4 text-amber-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-zinc-200">
                                        Pending Accounts
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Waiting for approval
                                    </p>

                                </div>

                            </div>

                            <span className="font-semibold text-zinc-100">
                                {loading
                                    ? "..."
                                    : pendingAccounts}
                            </span>

                        </div>


                        {/* Open Businesses */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">

                                    <Building2 className="h-4 w-4 text-sky-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-zinc-200">
                                        Open Businesses
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Currently operating
                                    </p>

                                </div>

                            </div>

                            <span className="font-semibold text-zinc-100">
                                {loading
                                    ? "..."
                                    : openBusinesses}
                            </span>

                        </div>


                        {/* Business Requests */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">

                                    <Clock3 className="h-4 w-4 text-amber-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-zinc-200">
                                        Business Requests
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Registration requests
                                    </p>

                                </div>

                            </div>

                            <span className="font-semibold text-zinc-100">
                                {loading
                                    ? "..."
                                    : totalBusinessRequests}
                            </span>

                        </div>


                        {/* Transactions */}

                        <div className="border-t border-zinc-800 pt-5">

                            <div className="flex items-center justify-between">

                                <span className="text-xs text-zinc-500">
                                    Total transactions
                                </span>

                                <span className="text-xs font-medium text-sky-400">

                                    {loading
                                        ? "..."
                                        : formatNumber(
                                              totalTransactions,
                                          )}

                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </div>


            {/* Recent Businesses */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900">

                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                    <div>

                        <h2 className="font-semibold text-zinc-100">
                            Recent Businesses
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Latest registered businesses
                        </p>

                    </div>

                    <a
                        href="/manager/businesses"
                        className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
                    >
                        View all
                    </a>

                </div>


                <div className="grid gap-3 p-5 md:grid-cols-3">

                    {loading && (
                        <div className="py-8 text-center text-sm text-zinc-500 md:col-span-3">
                            Loading businesses...
                        </div>
                    )}


                    {!loading &&
                        businesses.length === 0 && (
                            <div className="py-8 text-center text-sm text-zinc-500 md:col-span-3">
                                No businesses found.
                            </div>
                        )}


                    {!loading &&
                        businesses
                            .slice(0, 3)
                            .map((business) => (
                                <div
                                    key={business.businessId}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-950"
                                >

                                    <div className="flex items-start justify-between">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">

                                            <Building2 className="h-5 w-5 text-sky-400" />

                                        </div>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getBusinessStatusClass(
                                                business.status,
                                            )}`}
                                        >
                                            {business.status}
                                        </span>

                                    </div>


                                    <h3 className="mt-4 font-medium text-zinc-100">
                                        {business.qualifiedName}
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        {business.businessType}
                                    </p>

                                </div>
                            ))}

                </div>

            </section>


            {/* Recent Transactions */}

            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">

                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

                    <div>

                        <h2 className="font-semibold text-zinc-100">
                            Recent Transactions
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Latest wallet activity
                        </p>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                        <thead className="border-b border-zinc-800 bg-zinc-950/40">

                            <tr>

                                <th className="px-5 py-3 font-medium text-zinc-500">
                                    Operation
                                </th>

                                <th className="px-5 py-3 font-medium text-zinc-500">
                                    Sender
                                </th>

                                <th className="px-5 py-3 font-medium text-zinc-500">
                                    Receiver
                                </th>

                                <th className="px-5 py-3 text-right font-medium text-zinc-500">
                                    Amount
                                </th>

                                <th className="px-5 py-3 font-medium text-zinc-500">
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-zinc-800">

                            {loading && (
                                <tr>

                                    <td
                                        colSpan={5}
                                        className="px-5 py-8 text-center text-sm text-zinc-500"
                                    >
                                        Loading transactions...
                                    </td>

                                </tr>
                            )}


                            {!loading &&
                                transactions.length === 0 && (
                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="px-5 py-8 text-center text-sm text-zinc-500"
                                        >
                                            No transactions found.
                                        </td>

                                    </tr>
                                )}


                            {!loading &&
                                transactions
                                    .slice(0, 5)
                                    .map((transaction) => (
                                        <tr
                                            key={transaction.trxId}
                                            className="transition hover:bg-zinc-800/40"
                                        >

                                            <td className="px-5 py-4">

                                                <div>

                                                    <p className="font-medium text-zinc-200">
                                                        {
                                                            transaction.operation
                                                        }
                                                    </p>

                                                    {transaction.note && (
                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            {
                                                                transaction.note
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                            </td>


                                            <td className="px-5 py-4 text-zinc-400">

                                                {
                                                    transaction
                                                        .senderWallet
                                                        .fullName
                                                }

                                            </td>


                                            <td className="px-5 py-4 text-zinc-400">

                                                {
                                                    transaction
                                                        .receiverWallet
                                                        .fullName
                                                }

                                            </td>


                                            <td className="px-5 py-4 text-right font-medium text-zinc-200">

                                                {formatCurrency(
                                                    Number(
                                                        transaction.amount ||
                                                            0,
                                                    ),
                                                )}

                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        transaction.status.toLowerCase() ===
                                                        "completed"
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : transaction.status.toLowerCase() ===
                                                                "pending"
                                                              ? "bg-amber-500/10 text-amber-400"
                                                              : "bg-red-500/10 text-red-400"
                                                    }`}
                                                >
                                                    {
                                                        transaction.status
                                                    }
                                                </span>

                                            </td>

                                        </tr>
                                    ))}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    )
}
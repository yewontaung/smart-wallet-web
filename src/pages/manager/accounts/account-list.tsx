import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Search,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Users,
    UserCheck,
    Clock3,
    UserX,
    Wallet,
    SlidersHorizontal,
    ArrowUpRight,
    Eye,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import type { AccountListItem } from "../../../schemas/manager/outputs"
import type { AccountSearch } from "../../../schemas/manager/searches"
import type { WalletUserStatus } from "../../../schemas/enums"

const mockAccounts: AccountListItem[] = [
    {
        userId: 1,
        fullName: "Aung Aung",
        nickName: "Aung",
        accountType: "",
        accountStatus: "Verified",
        phoneNo: "09 123 456 789",
        createdAt: "2026-08-10T10:30:00",
        approvedAt: "2026-08-10T11:00:00",
        approverId: 100,
        approverFullName: "Manager",
        currentBalance: 125000,
        lastBalance: 100000,
    },
    {
        userId: 2,
        fullName: "Su Su",
        nickName: "Su",
        accountType: "",
        accountStatus: "Pending",
        phoneNo: "09 987 654 321",
        createdAt: "2026-08-12T09:15:00",
        currentBalance: 50000,
        lastBalance: 50000,
    },
    {
        userId: 3,
        fullName: "Mg Mg",
        nickName: "Mg",
        accountType: "",
        accountStatus: "Freeze",
        phoneNo: "09 555 123 456",
        createdAt: "2026-08-14T14:20:00",
        approvedAt: "2026-08-14T15:00:00",
        approverId: 101,
        approverFullName: "Admin",
        currentBalance: 75000,
        lastBalance: 80000,
    },
]

async function getAccounts(
    search: AccountSearch,
): Promise<{
    page: number
    size: number
    items: AccountListItem[]
    total: number
    pages: number
}> {
    // TODO: Replace this mock implementation with the real backend API.
    await new Promise((resolve) => setTimeout(resolve, 300))

    const query = search.q?.toLowerCase().trim()

    const filtered = mockAccounts.filter((account) => {
        if (
            query &&
            !account.fullName.toLowerCase().includes(query) &&
            !account.phoneNo.toLowerCase().includes(query) &&
            !account.userId.toString().includes(query)
        ) {
            return false
        }

        if (
            search.accountStatus &&
            account.accountStatus !== search.accountStatus
        ) {
            return false
        }

        if (
            search.balanceFrom !== undefined &&
            account.currentBalance < search.balanceFrom
        ) {
            return false
        }

        if (
            search.balanceTo !== undefined &&
            account.currentBalance > search.balanceTo
        ) {
            return false
        }

        if (search.createdFrom) {
            const created = new Date(account.createdAt)

            if (created < search.createdFrom) {
                return false
            }
        }

        if (search.createdTo) {
            const created = new Date(account.createdAt)

            const endOfDay = new Date(search.createdTo)
            endOfDay.setHours(23, 59, 59, 999)

            if (created > endOfDay) {
                return false
            }
        }

        return true
    })

    return {
        page: 1,
        size: filtered.length,
        items: filtered,
        total: filtered.length,
        pages: 1,
    }
}

function formatMoney(value: number) {
    return `${value.toLocaleString()} MMK`
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
}

function getStatusStyle(status: WalletUserStatus) {
    switch (status) {
        case "Verified":
            return {
                wrapper: "bg-emerald-500/10 border-emerald-500/20",
                text: "text-emerald-400",
                dot: "bg-emerald-400",
            }

        case "Pending":
            return {
                wrapper: "bg-amber-500/10 border-amber-500/20",
                text: "text-amber-400",
                dot: "bg-amber-400",
            }

        case "Freeze":
            return {
                wrapper: "bg-red-500/10 border-red-500/20",
                text: "text-red-400",
                dot: "bg-red-400",
            }

        default:
            return {
                wrapper: "bg-zinc-500/10 border-zinc-500/20",
                text: "text-zinc-400",
                dot: "bg-zinc-400",
            }
    }
}

export default function AccountListPage() {
    const navigate = useNavigate()

    const [search, setSearch] = useState<AccountSearch>({})
    const [form, setForm] = useState<AccountSearch>({})
    const [showFilters, setShowFilters] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ["manager-accounts", search],
        queryFn: () => getAccounts(search),
    })

    const accounts = data?.items ?? []

    const statistics = useMemo(() => {
        const verified = mockAccounts.filter(
            (account) => account.accountStatus === "Verified",
        ).length

        const pending = mockAccounts.filter(
            (account) => account.accountStatus === "Pending",
        ).length

        const frozen = mockAccounts.filter(
            (account) => account.accountStatus === "Freeze",
        ).length

        return {
            total: mockAccounts.length,
            verified,
            pending,
            frozen,
        }
    }, [])

    const handleSearch = () => {
        setSearch({
            ...form,
            balanceFrom:
                form.balanceFrom !== undefined
                    ? Number(form.balanceFrom)
                    : undefined,
            balanceTo:
                form.balanceTo !== undefined
                    ? Number(form.balanceTo)
                    : undefined,
        })
    }

    const handleReset = () => {
        setForm({})
        setSearch({})
    }

    const updateForm = <K extends keyof AccountSearch>(
        key: K,
        value: AccountSearch[K],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }))
    }

    return (
        <div className="min-h-full space-y-7 pb-10">
            {/* Header */}
            <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Manager / Accounts
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Account Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                    Monitor wallet users, account status and balances from one
                    place.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Total */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-0.5 hover:border-sky-500/30">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">
                                Total Accounts
                            </p>

                            <p className="mt-2 text-3xl font-bold text-white">
                                {statistics.total}
                            </p>

                            <p className="mt-2 text-xs text-zinc-600">
                                All wallet users
                            </p>
                        </div>

                        <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Verified */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/30">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">
                                Verified
                            </p>

                            <p className="mt-2 text-3xl font-bold text-white">
                                {statistics.verified}
                            </p>

                            <p className="mt-2 text-xs text-emerald-400">
                                Active accounts
                            </p>
                        </div>

                        <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-0.5 hover:border-amber-500/30">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">
                                Pending
                            </p>

                            <p className="mt-2 text-3xl font-bold text-white">
                                {statistics.pending}
                            </p>

                            <p className="mt-2 text-xs text-amber-400">
                                Need attention
                            </p>
                        </div>

                        <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                            <Clock3 className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Frozen */}
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-0.5 hover:border-red-500/30">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                        <div>
                            <p className="text-sm text-zinc-500">
                                Frozen
                            </p>

                            <p className="mt-2 text-3xl font-bold text-white">
                                {statistics.frozen}
                            </p>

                            <p className="mt-2 text-xs text-red-400">
                                Restricted accounts
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                            <UserX className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="font-semibold text-white">
                            Find an account
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Search by name, phone number or account ID.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowFilters((value) => !value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
                            showFilters
                                ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
                                : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </button>
                </div>

                <div className="p-5">
                    {/* Main Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />

                        <input
                            type="text"
                            value={form.q ?? ""}
                            onChange={(event) =>
                                updateForm("q", event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                            placeholder="Search by name, phone number or user ID..."
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10"
                        />
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mt-5 grid gap-4 border-t border-zinc-800 pt-5 md:grid-cols-2 lg:grid-cols-4">
                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-zinc-500">
                                    Account Status
                                </label>

                                <select
                                    value={form.accountStatus ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "accountStatus",
                                            event.target.value
                                                ? (event.target
                                                      .value as WalletUserStatus)
                                                : undefined,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-200 outline-none focus:border-sky-500/50"
                                >
                                    <option value="">All statuses</option>
                                    <option value="Verified">
                                        Verified
                                    </option>
                                    <option value="Pending">
                                        Pending
                                    </option>
                                    <option value="Freeze">Frozen</option>
                                </select>
                            </div>

                            {/* Minimum Balance */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-zinc-500">
                                    Minimum Balance
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={form.balanceFrom ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "balanceFrom",
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    placeholder="0"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-sky-500/50"
                                />
                            </div>

                            {/* Maximum Balance */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-zinc-500">
                                    Maximum Balance
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={form.balanceTo ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "balanceTo",
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    placeholder="0"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-sky-500/50"
                                />
                            </div>

                            {/* Created Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-zinc-500">
                                        From
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            form.createdFrom
                                                ? form.createdFrom
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(event) =>
                                            updateForm(
                                                "createdFrom",
                                                event.target.value
                                                    ? new Date(
                                                          event.target.value,
                                                      )
                                                    : undefined,
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-3 text-xs text-zinc-300 outline-none focus:border-sky-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-zinc-500">
                                        To
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            form.createdTo
                                                ? form.createdTo
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={(event) =>
                                            updateForm(
                                                "createdTo",
                                                event.target.value
                                                    ? new Date(
                                                          event.target.value,
                                                      )
                                                    : undefined,
                                            )
                                        }
                                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-3 text-xs text-zinc-300 outline-none focus:border-sky-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-5 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/10 transition hover:bg-sky-400"
                        >
                            <Search className="h-4 w-4" />
                            Search Accounts
                        </button>
                    </div>
                </div>
            </section>

            {/* Account Table */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-white">
                            Accounts
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            {data?.total ?? 0} accounts found
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-xs text-zinc-500 sm:flex">
                        <Wallet className="h-3.5 w-3.5" />
                        Wallet Users
                    </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-400" />

                        <p className="mt-4 text-sm text-zinc-500">
                            Loading accounts...
                        </p>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="rounded-2xl bg-zinc-800 p-4">
                            <Users className="h-7 w-7 text-zinc-500" />
                        </div>

                        <h3 className="mt-4 font-medium text-zinc-300">
                            No accounts found
                        </h3>

                        <p className="mt-1 text-sm text-zinc-600">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-200 text-left">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-950/40">
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Account
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Balance
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Created
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800/80">
                                {accounts.map((account) => {
                                    const statusStyle = getStatusStyle(
                                        account.accountStatus,
                                    )

                                    return (
                                        <tr
                                            key={account.userId}
                                            onClick={() =>
                                                navigate(
                                                    `/manager/accounts/${account.userId}`,
                                                )
                                            }
                                            className="group cursor-pointer transition hover:bg-zinc-800/40"
                                        >
                                            {/* Account */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-500/20 to-indigo-500/20 text-sm font-bold text-sky-400 ring-1 ring-sky-500/10">
                                                        {getInitials(
                                                            account.fullName,
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-zinc-100">
                                                            {account.fullName}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-zinc-600">
                                                            ID #
                                                            {account.userId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-5 py-4 text-sm text-zinc-400">
                                                {account.phoneNo}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle.wrapper} ${statusStyle.text}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                                    />

                                                    {account.accountStatus}
                                                </span>
                                            </td>

                                            {/* Balance */}
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-zinc-100">
                                                    {formatMoney(
                                                        account.currentBalance,
                                                    )}
                                                </p>

                                                {account.currentBalance >
                                                account.lastBalance ? (
                                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-400">
                                                        <ArrowUpRight className="h-3 w-3" />
                                                        Balance increased
                                                    </p>
                                                ) : account.currentBalance <
                                                  account.lastBalance ? (
                                                    <p className="mt-0.5 text-xs text-red-400">
                                                        Balance decreased
                                                    </p>
                                                ) : (
                                                    <p className="mt-0.5 text-xs text-zinc-600">
                                                        No change
                                                    </p>
                                                )}
                                            </td>

                                            {/* Created */}
                                            <td className="px-5 py-4 text-sm text-zinc-500">
                                                {new Date(
                                                    account.createdAt,
                                                ).toLocaleDateString()}
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition group-hover:border-sky-500/20 group-hover:bg-sky-500/5 group-hover:text-sky-400">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    View
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
                    <p className="text-xs text-zinc-600">
                        Page {data?.page ?? 1} of {data?.pages ?? 1}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-zinc-800 p-2 text-zinc-700 transition hover:bg-zinc-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-zinc-800 p-2 text-zinc-700 transition hover:bg-zinc-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
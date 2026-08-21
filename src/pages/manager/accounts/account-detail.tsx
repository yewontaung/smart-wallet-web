import { useQuery } from "@tanstack/react-query"
import {
    ArrowLeft,
    UserRound,
    Phone,
    ShieldCheck,
    Wallet,
    CalendarDays,
    UserCheck,
    Hash,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

type AccountDetail = {
    userId: number
    fullName: string
    nickName?: string
    accountType: string
    accountStatus: "Pending" | "Verified" | "Freeze"
    phoneNo: string
    createdAt: string
    approvedAt?: string
    approverId?: number
    approverFullName?: string
    currentBalance: number
    lastBalance: number
}

/*
 * Temporary mock data.
 *
 * TODO:
 * Replace this function with the real backend API call.
 *
 * Example later:
 *
 * const response = await fetch(
 *     `http://localhost:8000/api/manager/accounts/${accountId}`
 * )
 *
 * if (!response.ok) {
 *     throw new Error("Failed to load account")
 * }
 *
 * return response.json()
 */

const mockAccounts: AccountDetail[] = [
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

async function getAccountDetail(
    accountId: string,
): Promise<AccountDetail> {
    // Simulate backend request delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    /*
     * Temporary implementation.
     *
     * This is where the real backend API call will go later.
     */
    const account = mockAccounts.find(
        (item) => item.userId === Number(accountId),
    )

    if (!account) {
        throw new Error("Account not found")
    }

    return account
}

export default function AccountDetailPage() {
    const navigate = useNavigate()
    const { accountId } = useParams()

    const {
        data: account,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["manager-account-detail", accountId],
        queryFn: () => getAccountDetail(accountId!),
        enabled: Boolean(accountId),
    })

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-400" />

                    <p className="mt-4 text-sm text-zinc-500">
                        Loading account...
                    </p>
                </div>
            </div>
        )
    }

    if (isError || !account) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                        <UserRound className="h-7 w-7 text-red-400" />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                        Account Not Found
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        The requested account could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/manager/accounts")}
                        className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
                    >
                        Back to Accounts
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back */}
            <button
                type="button"
                onClick={() => navigate("/manager/accounts")}
                className="group flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-100"
            >
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                Back to Accounts
            </button>

            {/* Profile Header */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
                <div className="absolute inset-0 bg-linear-to-br from-sky-500/10 via-transparent to-indigo-500/5" />

                <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/20">
                            <UserRound className="h-8 w-8 text-sky-400" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold text-zinc-100">
                                    {account.fullName}
                                </h1>

                                <StatusBadge
                                    status={account.accountStatus}
                                />
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500">
                                <span className="flex items-center gap-1.5">
                                    <Hash className="h-3.5 w-3.5" />
                                    Account ID: {account.userId}
                                </span>

                                {account.nickName && (
                                    <span>
                                        Nickname: {account.nickName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Information */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <SectionHeader
                    icon={<UserRound className="h-4 w-4" />}
                    title="Account Information"
                    description="Basic information about this wallet user."
                />

                <div className="grid gap-px bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                        icon={<UserRound />}
                        label="Full Name"
                        value={account.fullName}
                    />

                    <InfoItem
                        icon={<UserRound />}
                        label="Nickname"
                        value={account.nickName || "-"}
                    />

                    <InfoItem
                        icon={<Phone />}
                        label="Phone Number"
                        value={account.phoneNo}
                    />

                    <InfoItem
                        icon={<ShieldCheck />}
                        label="Account Status"
                        value={account.accountStatus}
                    />

                    <InfoItem
                        icon={<CalendarDays />}
                        label="Created At"
                        value={formatDate(account.createdAt)}
                    />

                    <InfoItem
                        icon={<Hash />}
                        label="Account Type"
                        value={account.accountType || "-"}
                    />
                </div>
            </section>

            {/* Balance */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <SectionHeader
                    icon={<Wallet className="h-4 w-4" />}
                    title="Balance Information"
                    description="Current wallet balance and previous balance."
                />

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Wallet className="h-4 w-4" />
                            Current Balance
                        </div>

                        <p className="mt-3 text-3xl font-semibold text-emerald-400">
                            {account.currentBalance.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Wallet className="h-4 w-4" />
                            Previous Balance
                        </div>

                        <p className="mt-3 text-3xl font-semibold text-zinc-200">
                            {account.lastBalance.toLocaleString()}
                        </p>
                    </div>
                </div>
            </section>

            {/* Approval Information */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                <SectionHeader
                    icon={<UserCheck className="h-4 w-4" />}
                    title="Approval Information"
                    description="Account approval and manager information."
                />

                <div className="grid gap-px bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                        icon={<UserCheck />}
                        label="Approver"
                        value={account.approverFullName || "-"}
                    />

                    <InfoItem
                        icon={<Hash />}
                        label="Approver ID"
                        value={
                            account.approverId
                                ? String(account.approverId)
                                : "-"
                        }
                    />

                    <InfoItem
                        icon={<CalendarDays />}
                        label="Approved At"
                        value={
                            account.approvedAt
                                ? formatDate(account.approvedAt)
                                : "-"
                        }
                    />
                </div>
            </section>
        </div>
    )
}

function SectionHeader({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <div className="border-b border-zinc-800 px-5 py-4">
            <div className="flex items-center gap-2 text-sky-400">
                {icon}

                <h2 className="font-medium text-zinc-100">
                    {title}
                </h2>
            </div>

            <p className="mt-1 text-xs text-zinc-600">
                {description}
            </p>
        </div>
    )
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="bg-zinc-900 p-5">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-zinc-600">
                    {icon}
                </span>

                {label}
            </div>

            <p className="mt-2 text-sm font-medium text-zinc-200">
                {value}
            </p>
        </div>
    )
}

function StatusBadge({
    status,
}: {
    status: AccountDetail["accountStatus"]
}) {
    const styles = {
        Verified:
            "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        Pending:
            "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        Freeze:
            "bg-red-500/10 text-red-400 ring-red-500/20",
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles[status]}`}
        >
            {status}
        </span>
    )
}

function formatDate(value: string) {
    return new Date(value).toLocaleString()
}
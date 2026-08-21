import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock3,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react"

const stats = [
    {
        title: "Total Accounts",
        value: "1,248",
        change: "+12.5%",
        description: "from last month",
        icon: Users,
    },
    {
        title: "Total Balance",
        value: "₨ 48.6M",
        change: "+8.2%",
        description: "from last month",
        icon: Wallet,
    },
    {
        title: "Businesses",
        value: "186",
        change: "+6.4%",
        description: "from last month",
        icon: Building2,
    },
    {
        title: "Transactions",
        value: "8,492",
        change: "+18.7%",
        description: "from last month",
        icon: TrendingUp,
    },
]

const recentAccounts = [
    {
        name: "Aung Aung",
        phone: "09 123 456 789",
        status: "Verified",
        balance: "125,000",
    },
    {
        name: "Su Su",
        phone: "09 987 654 321",
        status: "Pending",
        balance: "50,000",
    },
    {
        name: "Mg Mg",
        phone: "09 555 123 456",
        status: "Verified",
        balance: "75,000",
    },
    {
        name: "Hnin Ei",
        phone: "09 777 888 999",
        status: "Freeze",
        balance: "32,500",
    },
]

const recentBusinesses = [
    {
        name: "Golden Café",
        type: "Standalone",
        status: "Open",
    },
    {
        name: "Yangon Food Group",
        type: "Organization",
        status: "Open",
    },
    {
        name: "Smart Fashion",
        type: "Standalone",
        status: "Closed",
    },
]

export default function DashboardPage() {
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
                        Here's an overview of your Smart Wallet platform.
                        Monitor accounts, businesses and activity from one
                        place.
                    </p>
                </div>

                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            </section>

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    {stat.change}
                                </div>
                            </div>

                            <p className="mt-5 text-sm text-zinc-500">
                                {stat.title}
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {stat.value}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                                {stat.description}
                            </p>
                        </div>
                    )
                })}
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
                                {recentAccounts.map((account) => (
                                    <tr
                                        key={account.phone}
                                        className="transition hover:bg-zinc-800/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-sky-400">
                                                    {account.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <span className="font-medium text-zinc-200">
                                                    {account.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-zinc-500">
                                            {account.phone}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    account.status === "Verified"
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : account.status ===
                                                            "Freeze"
                                                          ? "bg-red-500/10 text-red-400"
                                                          : "bg-amber-500/10 text-amber-400"
                                                }`}
                                            >
                                                {account.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right font-medium text-zinc-200">
                                            {account.balance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quick Overview */}
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
                                1,084
                            </span>
                        </div>

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
                                96
                            </span>
                        </div>

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
                                172
                            </span>
                        </div>

                        <div className="border-t border-zinc-800 pt-5">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs text-zinc-500">
                                    Platform activity
                                </span>

                                <span className="text-xs font-medium text-emerald-400">
                                    82%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                                <div className="h-full w-[82%] rounded-full bg-sky-500" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Businesses */}
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
                    {recentBusinesses.map((business) => (
                        <div
                            key={business.name}
                            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-950"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                                    <Building2 className="h-5 w-5 text-sky-400" />
                                </div>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        business.status === "Open"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-zinc-800 text-zinc-500"
                                    }`}
                                >
                                    {business.status}
                                </span>
                            </div>

                            <h3 className="mt-4 font-medium text-zinc-100">
                                {business.name}
                            </h3>

                            <p className="mt-1 text-xs text-zinc-500">
                                {business.type}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
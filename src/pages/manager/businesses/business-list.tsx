import { useState } from "react"
import {
    Search,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Building2,
    UserRound,
    CalendarDays,
    ArrowUpRight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { BusinessProfileListItem } from "../../../schemas/shared/outputs"
import type { BusinessProfileSearch } from "../../../schemas/shared/searches"
import type { BusinessType } from "../../../schemas/enums"

const mockBusinesses: BusinessProfileListItem[] = [
    {
        businessId: 1,
        qualifiedName: "Aung Aung Mini Mart",
        bannerUrl: "",
        description: "A local convenience store.",
        businessType: "Standalone",
        createdAt: "2026-08-05T10:30:00",
        status: "Open",
        owner: {
            userId: 1,
            fullName: "Aung Aung",
            profileUrl: "",
        },
        approver: {
            approverId: 100,
            approvedAt: "2026-08-05T11:00:00",
            approverFullName: "Manager",
        },
    },
    {
        businessId: 2,
        qualifiedName: "Shwe Myanmar Restaurant",
        bannerUrl: "",
        description: "Traditional Myanmar food restaurant.",
        businessType: "Organization",
        createdAt: "2026-08-08T09:15:00",
        status: "Open",
        owner: {
            userId: 2,
            fullName: "Su Su",
            profileUrl: "",
        },
        approver: {
            approverId: 100,
            approvedAt: "2026-08-08T10:00:00",
            approverFullName: "Manager",
        },
    },
    {
        businessId: 3,
        qualifiedName: "Mg Mg Electronics",
        bannerUrl: "",
        description: "Electronics and accessories shop.",
        businessType: "Standalone",
        createdAt: "2026-08-12T14:20:00",
        status: "Closed",
        owner: {
            userId: 3,
            fullName: "Mg Mg",
            profileUrl: "",
        },
        approver: {
            approverId: 101,
            approvedAt: "2026-08-12T15:00:00",
            approverFullName: "Admin",
        },
    },
]

async function getBusinesses(
    search: BusinessProfileSearch,
): Promise<{
    page: number
    size: number
    items: BusinessProfileListItem[]
    total: number
    pages: number
}> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const query = search.q?.toLowerCase().trim()

    const filtered = mockBusinesses.filter((business) => {
        if (
            query &&
            !business.qualifiedName.toLowerCase().includes(query) &&
            !business.owner.fullName.toLowerCase().includes(query)
        ) {
            return false
        }

        if (
            search.businessType &&
            business.businessType !== search.businessType
        ) {
            return false
        }

        if (search.createdFrom) {
            const createdDate = new Date(business.createdAt)
            const fromDate = new Date(search.createdFrom)

            if (createdDate < fromDate) {
                return false
            }
        }

        if (search.createdTo) {
            const createdDate = new Date(business.createdAt)
            const toDate = new Date(search.createdTo)

            if (createdDate > toDate) {
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

export default function BusinessListPage() {
    const [search, setSearch] = useState<BusinessProfileSearch>({})
    const [form, setForm] = useState<BusinessProfileSearch>({})

    const { data, isLoading } = useQuery({
        queryKey: ["manager-businesses", search],
        queryFn: () => getBusinesses(search),
    })

    const handleSearch = () => {
        setSearch({
            ...form,
        })
    }

    const handleReset = () => {
        setForm({})
        setSearch({})
    }

    const updateForm = <K extends keyof BusinessProfileSearch>(
        key: K,
        value: BusinessProfileSearch[K],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }))
    }

    const businesses = data?.items ?? []

    const openBusinesses = businesses.filter(
        (business) => business.status === "Open",
    ).length

    const organizationCount = businesses.filter(
        (business) => business.businessType === "Organization",
    ).length

    const standaloneCount = businesses.filter(
        (business) => business.businessType === "Standalone",
    ).length

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
                            <Building2 className="h-5 w-5 text-sky-400" />
                        </div>

                        <span className="text-sm font-medium text-sky-400">
                            Business Management
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
                        Businesses
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Manage and search registered businesses.
                    </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                    <p className="text-xs text-zinc-500">
                        Total Businesses
                    </p>

                    <p className="mt-1 text-xl font-semibold text-zinc-100">
                        {data?.total ?? 0}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={<Building2 className="h-5 w-5" />}
                    label="Total"
                    value={data?.total ?? 0}
                    description="Registered businesses"
                />

                <StatCard
                    icon={<ArrowUpRight className="h-5 w-5" />}
                    label="Open"
                    value={openBusinesses}
                    description="Currently active"
                    valueClass="text-emerald-400"
                />

                <StatCard
                    icon={<Building2 className="h-5 w-5" />}
                    label="Organizations"
                    value={organizationCount}
                    description="Organization accounts"
                    valueClass="text-sky-400"
                />

                <StatCard
                    icon={<Building2 className="h-5 w-5" />}
                    label="Standalone"
                    value={standaloneCount}
                    description="Independent businesses"
                    valueClass="text-violet-400"
                />
            </div>

            {/* Search / Filter */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/10">
                <div className="border-b border-zinc-800 bg-zinc-900/80 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
                            <Search className="h-4 w-4 text-sky-400" />
                        </div>

                        <div>
                            <h2 className="font-medium text-zinc-100">
                                Search Businesses
                            </h2>

                            <p className="text-xs text-zinc-500">
                                Find businesses by name, owner or type.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Search
                            </label>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                                <input
                                    type="text"
                                    value={form.q ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "q",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Business name or owner name"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20"
                                />
                            </div>
                        </div>

                        {/* Business Type */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Business Type
                            </label>

                            <select
                                value={form.businessType ?? ""}
                                onChange={(event) =>
                                    updateForm(
                                        "businessType",
                                        event.target.value
                                            ? (event.target
                                                  .value as BusinessType)
                                            : undefined,
                                    )
                                }
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-sky-500"
                            >
                                <option value="">All types</option>
                                <option value="Standalone">
                                    Standalone
                                </option>
                                <option value="Organization">
                                    Organization
                                </option>
                            </select>
                        </div>

                        {/* Created From */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Created From
                            </label>

                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                                <input
                                    type="date"
                                    value={form.createdFrom ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "createdFrom",
                                            event.target.value ||
                                                undefined,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-3 text-sm text-zinc-100 outline-none transition focus:border-sky-500"
                                />
                            </div>
                        </div>

                        {/* Created To */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                                Created To
                            </label>

                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                                <input
                                    type="date"
                                    value={form.createdTo ?? ""}
                                    onChange={(event) =>
                                        updateForm(
                                            "createdTo",
                                            event.target.value ||
                                                undefined,
                                        )
                                    }
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-3 text-sm text-zinc-100 outline-none transition focus:border-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/10 transition hover:bg-sky-400 active:scale-[0.98]"
                        >
                            <Search className="h-4 w-4" />
                            Search
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.98]"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>
                </div>
            </section>

            {/* Business Table */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/10">
                <div className="flex flex-col gap-2 border-b border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-medium text-zinc-100">
                            Business List
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Registered businesses in the wallet system
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400">
                        {data?.total ?? 0} businesses
                    </span>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-400" />

                        <p className="text-sm text-zinc-500">
                            Loading businesses...
                        </p>
                    </div>
                ) : businesses.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800">
                            <Building2 className="h-6 w-6 text-zinc-600" />
                        </div>

                        <p className="mt-4 font-medium text-zinc-300">
                            No businesses found
                        </p>

                        <p className="mt-1 text-sm text-zinc-600">
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 text-left text-sm">
                            <thead className="border-b border-zinc-800 bg-zinc-950/50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Business
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Owner
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Created
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                                        Approver
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {businesses.map((business) => (
                                    <tr
                                        key={business.businessId}
                                        className="group cursor-pointer transition hover:bg-zinc-800/40"
                                    >
                                        {/* Business */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 transition group-hover:bg-sky-500/20">
                                                    <Building2 className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-medium text-zinc-100">
                                                        {
                                                            business.qualifiedName
                                                        }
                                                    </p>

                                                    <p className="mt-1 max-w-xs truncate text-xs text-zinc-500">
                                                        {
                                                            business.description
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-zinc-600">
                                                        ID:{" "}
                                                        {
                                                            business.businessId
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Owner */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                                                    <UserRound className="h-4 w-4 text-zinc-400" />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-zinc-200">
                                                        {
                                                            business.owner
                                                                .fullName
                                                        }
                                                    </p>

                                                    <p className="text-xs text-zinc-600">
                                                        User ID:{" "}
                                                        {
                                                            business.owner
                                                                .userId
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    business.businessType ===
                                                    "Organization"
                                                        ? "bg-violet-500/10 text-violet-400"
                                                        : "bg-sky-500/10 text-sky-400"
                                                }`}
                                            >
                                                {business.businessType}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    business.status ===
                                                    "Open"
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "bg-red-500/10 text-red-400"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        business.status ===
                                                        "Open"
                                                            ? "bg-emerald-400"
                                                            : "bg-red-400"
                                                    }`}
                                                />

                                                {business.status}
                                            </span>
                                        </td>

                                        {/* Created */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <CalendarDays className="h-4 w-4 text-zinc-600" />

                                                {new Date(
                                                    business.createdAt,
                                                ).toLocaleDateString()}
                                            </div>
                                        </td>

                                        {/* Approver */}
                                        <td className="px-5 py-4">
                                            <p className="text-zinc-300">
                                                {
                                                    business.approver
                                                        .approverFullName
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-zinc-600">
                                                Approved{" "}
                                                {new Date(
                                                    business.approver.approvedAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
                    <p className="text-sm text-zinc-500">
                        Page {data?.page ?? 1} of {data?.pages ?? 1}
                    </p>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-600 transition hover:bg-zinc-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            disabled
                            className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-600 transition hover:bg-zinc-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
    description,
    valueClass = "text-zinc-100",
}: {
    icon: React.ReactNode
    label: string
    value: number
    description: string
    valueClass?: string
}) {
    return (
        <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition group-hover:bg-sky-500/10 group-hover:text-sky-400">
                    {icon}
                </div>

                <ArrowUpRight className="h-4 w-4 text-zinc-700 transition group-hover:text-zinc-500" />
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                {label}
            </p>

            <p className={`mt-1 text-2xl font-semibold ${valueClass}`}>
                {value}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
                {description}
            </p>
        </div>
    )
}
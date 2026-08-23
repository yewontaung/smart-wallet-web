import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Search,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Users,
    UserRound,
} from "lucide-react"

import {
    getManagers,
    type ManagerSearch,
} from "../../../services/manager/manager.service"

export default function ManagerListPage() {
    const [search, setSearch] = useState<ManagerSearch>({
        page: 1,
        size: 10,
    })

    const [form, setForm] = useState<ManagerSearch>({
        page: 1,
        size: 10,
    })

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["managers", search],
        queryFn: () => getManagers(search),
    })

    const managers = data?.items ?? []

    const handleSearch = () => {
        setSearch({
            ...form,
            page: 1,
            size: 10,
        })
    }

    const handleReset = () => {
        const reset: ManagerSearch = {
            page: 1,
            size: 10,
        }

        setForm(reset)
        setSearch(reset)
    }

    const getStatusClass = (isDisable: boolean) => {
        return isDisable
            ? "bg-red-500/10 text-red-400"
            : "bg-emerald-500/10 text-emerald-400"
    }

    const getRoleClass = (role: string) => {
        switch (role) {
            case "Super Admin":
                return "bg-purple-500/10 text-purple-400"

            case "Admin":
                return "bg-sky-500/10 text-sky-400"

            case "Moderator":
                return "bg-amber-500/10 text-amber-400"

            default:
                return "bg-zinc-800 text-zinc-400"
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-400" />

                    <span className="text-sm text-sky-400">
                        Manager Management
                    </span>
                </div>

                <h1 className="mt-2 text-3xl font-semibold text-zinc-100">
                    Managers
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    View and manage manager accounts.
                </p>
            </div>

            {/* Search and Filters */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-xs font-medium text-zinc-500">
                            Search
                        </label>

                        <input
                            value={form.q ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    q: e.target.value,
                                })
                            }
                            placeholder="Name, phone or email"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-500"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-500">
                            Role
                        </label>

                        <select
                            value={form.role ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    role:
                                        e.target.value ||
                                        undefined,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
                        >
                            <option value="">All roles</option>
                            <option value="Super Admin">
                                Super Admin
                            </option>
                            <option value="Admin">
                                Admin
                            </option>
                            <option value="Moderator">
                                Moderator
                            </option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-500">
                            Status
                        </label>

                        <select
                            value={
                                form.isDisable === undefined
                                    ? ""
                                    : form.isDisable
                                      ? "disabled"
                                      : "active"
                            }
                            onChange={(e) => {
                                const value = e.target.value

                                setForm({
                                    ...form,
                                    isDisable:
                                        value === ""
                                            ? undefined
                                            : value ===
                                                "disabled",
                                })
                            }}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
                        >
                            <option value="">All statuses</option>
                            <option value="active">
                                Active
                            </option>
                            <option value="disabled">
                                Disabled
                            </option>
                        </select>
                    </div>

                    {/* Created From */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-500">
                            Created From
                        </label>

                        <input
                            type="date"
                            value={form.createdFrom ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    createdFrom:
                                        e.target.value ||
                                        undefined,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
                        />
                    </div>

                    {/* Created To */}
                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-500">
                            Created To
                        </label>

                        <input
                            type="date"
                            value={form.createdTo ?? ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    createdTo:
                                        e.target.value ||
                                        undefined,
                                })
                            }
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-sky-500"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-400"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </button>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </section>

            {/* Error */}
            {isError && (
                <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-400">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load managers."}
                    </p>
                </section>
            )}

            {/* Manager Table */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">
                        Loading managers...
                    </div>
                ) : managers.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        No managers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-250 text-left text-sm">
                            <thead className="border-b border-zinc-800 bg-zinc-950/50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                                        Manager
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                                        Role
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                                        Created
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {managers.map((manager) => (
                                    <tr
                                        key={manager.userId}
                                        className="transition hover:bg-zinc-800/40"
                                    >
                                        {/* Manager */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {manager.profileUrl ? (
                                                    <img
                                                        src={
                                                            manager.profileUrl
                                                        }
                                                        alt={
                                                            manager.fullName
                                                        }
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
                                                        <UserRound className="h-5 w-5 text-sky-400" />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-medium text-zinc-100">
                                                        {
                                                            manager.fullName
                                                        }
                                                    </p>

                                                    {manager.nickName && (
                                                        <p className="text-xs text-zinc-500">
                                                            {
                                                                manager.nickName
                                                            }
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-zinc-600">
                                                        ID:{" "}
                                                        {
                                                            manager.userId
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-5 py-4 text-zinc-400">
                                            {manager.phoneNo}
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRoleClass(
                                                    manager.role,
                                                )}`}
                                            >
                                                {manager.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    manager.isDisable,
                                                )}`}
                                            >
                                                {manager.isDisable
                                                    ? "Disabled"
                                                    : "Active"}
                                            </span>
                                        </td>

                                        {/* Created */}
                                        <td className="px-5 py-4 text-zinc-400">
                                            {new Date(
                                                manager.createdAt,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
                    <span className="text-sm text-zinc-500">
                        Page {data?.page ?? 1} of{" "}
                        {data?.pages ?? 1}
                    </span>

                    <div className="flex gap-2">
                        <button
                            disabled={
                                !data || data.page <= 1
                            }
                            onClick={() =>
                                setSearch({
                                    ...search,
                                    page:
                                        (data?.page ?? 1) -
                                        1,
                                })
                            }
                            className="rounded-lg border border-zinc-800 p-2 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            disabled={
                                !data ||
                                data.page >= data.pages
                            }
                            onClick={() =>
                                setSearch({
                                    ...search,
                                    page:
                                        (data?.page ?? 1) +
                                        1,
                                })
                            }
                            className="rounded-lg border border-zinc-800 p-2 text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
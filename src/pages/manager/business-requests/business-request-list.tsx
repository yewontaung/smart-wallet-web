import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Search,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Building2,
    UserRound,
    Check,
    X,
} from "lucide-react"

import {
    getBusinessRequests,
    approveBusinessRequest,
    rejectBusinessRequest,
    type BusinessRequestSearch,
} from "../../../services/manager/business-request.service"

export default function BusinessRequestListPage() {
    const queryClient = useQueryClient()

    const [search, setSearch] = useState<BusinessRequestSearch>({
        page: 1,
        size: 10,
    })

    const [form, setForm] = useState<BusinessRequestSearch>({
        page: 1,
        size: 10,
    })

    const [rejectId, setRejectId] = useState<number | null>(null)
    const [remark, setRemark] = useState("")

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["business-requests", search],
        queryFn: () => getBusinessRequests(search),
    })

    const approveMutation = useMutation({
        mutationFn: approveBusinessRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["business-requests"],
            })
        },
    })

    const rejectMutation = useMutation({
        mutationFn: ({
            requestId,
            remark,
        }: {
            requestId: number
            remark: string
        }) => rejectBusinessRequest(requestId, remark),

        onSuccess: () => {
            setRejectId(null)
            setRemark("")

            queryClient.invalidateQueries({
                queryKey: ["business-requests"],
            })
        },
    })

    const requests = data?.items ?? []

    const handleSearch = () => {
        setSearch({
            ...form,
            page: 1,
            size: 10,
        })
    }

    const handleReset = () => {
        const reset = {
            page: 1,
            size: 10,
        }

        setForm(reset)
        setSearch(reset)
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-sky-400" />

                    <span className="text-sm text-sky-400">
                        Business Management
                    </span>
                </div>

                <h1 className="mt-2 text-3xl font-semibold text-zinc-100">
                    Business Requests
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    Review business registration requests.
                </p>
            </div>

            {/* Search */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        value={form.q ?? ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                q: e.target.value,
                            })
                        }
                        placeholder="Business name or owner"
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none"
                    />

                    <select
                        value={form.businessType ?? ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                businessType:
                                    e.target.value || undefined,
                            })
                        }
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100"
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

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white"
                    >
                        <Search className="h-4 w-4" />
                        Search
                    </button>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </button>
                </div>
            </section>

            {/* Error */}
            {isError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-sm text-red-400">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load business requests."}
                    </p>
                </div>
            )}

            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">
                        Loading business requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500">
                        No business requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-250 text-left text-sm">
                            <thead className="border-b border-zinc-800 bg-zinc-950/50">
                                <tr>
                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Business
                                    </th>

                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Owner
                                    </th>

                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Requested
                                    </th>

                                    <th className="px-5 py-3 text-xs text-zinc-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-800">
                                {requests.map((request) => (
                                    <tr
                                        key={request.requestId}
                                        className="hover:bg-zinc-800/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex gap-3">
                                                <Building2 className="h-5 w-5 text-sky-400" />

                                                <div>
                                                    <p className="font-medium text-zinc-100">
                                                        {request.qualifiedName}
                                                    </p>

                                                    <p className="text-xs text-zinc-500">
                                                        {request.description}
                                                    </p>

                                                    <p className="text-xs text-zinc-600">
                                                        Request ID:{" "}
                                                        {request.requestId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <UserRound className="h-4 w-4 text-zinc-500" />

                                                <div>
                                                    <p className="text-zinc-200">
                                                        {request.owner.fullName}
                                                    </p>

                                                    <p className="text-xs text-zinc-600">
                                                        User ID:{" "}
                                                        {request.owner.userId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            {request.businessType}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs text-yellow-400">
                                                {request.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-zinc-400">
                                            {new Date(
                                                request.requestedAt,
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        approveMutation.mutate(
                                                            request.requestId,
                                                        )
                                                    }
                                                    disabled={
                                                        approveMutation.isPending
                                                    }
                                                    className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setRejectId(
                                                            request.requestId,
                                                        )
                                                    }
                                                    className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </div>
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
                        Page {data?.page ?? 1} of {data?.pages ?? 1}
                    </span>

                    <div className="flex gap-2">
                        <button
                            disabled={!data || data.page <= 1}
                            onClick={() =>
                                setSearch({
                                    ...search,
                                    page: (data?.page ?? 1) - 1,
                                })
                            }
                            className="rounded-lg border border-zinc-800 p-2 disabled:opacity-30"
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
                                    page: (data?.page ?? 1) + 1,
                                })
                            }
                            className="rounded-lg border border-zinc-800 p-2 disabled:opacity-30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Reject modal */}
            {rejectId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <h2 className="text-lg font-semibold text-zinc-100">
                            Reject Business Request
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                            Please provide a reason for rejection.
                        </p>

                        <textarea
                            value={remark}
                            onChange={(e) =>
                                setRemark(e.target.value)
                            }
                            className="mt-4 h-32 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none"
                            placeholder="Rejection reason..."
                        />

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setRejectId(null)
                                    setRemark("")
                                }}
                                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={
                                    !remark.trim() ||
                                    rejectMutation.isPending
                                }
                                onClick={() =>
                                    rejectMutation.mutate({
                                        requestId: rejectId,
                                        remark,
                                    })
                                }
                                className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-40"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
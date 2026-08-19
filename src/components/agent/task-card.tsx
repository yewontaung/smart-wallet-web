import { Check, Clock, Loader2, X } from "lucide-react";
import type { AgentTask } from "../../types/agents"

interface TaskCardProps {
    task: AgentTask;
    onEditForm: (form: unknown) => void;
    onConfirm: () => void;
    onRetry: () => void;
}

function StatusBadge({ status }: { status: AgentTask["status"] }) {
    switch (status) {
        case "queued":
            return (
                <span className="flex items-center gap-1 text-xs text-white/40">
                    <Clock size={12} /> Queued
                </span>
            );
        case "processing":
        case "submitting":
            return (
                <span className="flex items-center gap-1 text-xs text-white/60">
                    <Loader2 size={12} className="animate-spin" /> Working…
                </span>
            );
        case "needs_input":
            return <span className="text-xs text-amber-300">Needs your confirmation</span>;
        case "success":
            return (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <Check size={12} /> Done
                </span>
            );
        case "failed":
            return (
                <span className="flex items-center gap-1 text-xs text-red-400">
                    <X size={12} /> Failed
                </span>
            );
    }
}

function LabeledInput({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="text-[11px] text-white/40">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-0.5 w-full rounded-lg bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
            />
        </label>
    );
}

export function TaskCard({ task, onEditForm, onConfirm, onRetry }: TaskCardProps) {
    const isQueued = task.status === "queued";

    return (
        <div
            className={`rounded-2xl border px-4 py-3 transition-opacity ${
                isQueued ? "border-white/5 bg-white/2 opacity-60" : "border-white/15 bg-white/5"
            }`}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{task.title}</p>
                <StatusBadge status={task.status} />
            </div>
            <p className="mt-0.5 text-xs text-white/50">{task.description}</p>

            {task.status === "needs_input" && task.intent === "send_money" && (
                <div className="mt-3 space-y-2">
                    <LabeledInput
                        label="Recipient"
                        value={task.form?.recipient as string ?? ""}
                        onChange={(v) => onEditForm({ ...task.form, recipient: v })}
                    />
                    <LabeledInput
                        label="Amount"
                        type="number"
                        value={String(task.form?.amount ?? "")}
                        onChange={(v) => onEditForm({ ...task.form, amount: Number(v) })}
                    />
                    <LabeledInput
                        label="Note (optional)"
                        value={task.form?.note as string ?? ""}
                        onChange={(v) => onEditForm({ ...task.form, note: v })}
                    />
                    <button onClick={onConfirm} className="mt-1 w-full rounded-xl bg-white py-2 text-sm font-medium text-black">
                        Continue
                    </button>
                </div>
            )}

            {task.status === "needs_input" && task.intent === "bill_payment" && (
                <div className="mt-3 space-y-2">
                    <LabeledInput
                        label="Biller"
                        value={task.form?.biller as string ?? ""}
                        onChange={(v) => onEditForm({ ...task.form, biller: v })}
                    />
                    <LabeledInput
                        label="Amount"
                        type="number"
                        value={String(task.form?.amount ?? "")}
                        onChange={(v) => onEditForm({ ...task.form, amount: Number(v) })}
                    />
                    <button onClick={onConfirm} className="mt-1 w-full rounded-xl bg-white py-2 text-sm font-medium text-black">
                        Continue
                    </button>
                </div>
            )}

            {task.status === "needs_input" && task.intent === "topup" && (
                <div className="mt-3 space-y-2">
                    <LabeledInput
                        label="Amount"
                        type="number"
                        value={String(task.form?.amount ?? "")}
                        onChange={(v) => onEditForm({ ...task.form, amount: Number(v) })}
                    />
                    <p className="text-xs text-white/40">Source: {task.form?.source as string}</p>
                    <button onClick={onConfirm} className="mt-1 w-full rounded-xl bg-white py-2 text-sm font-medium text-black">
                        Continue
                    </button>
                </div>
            )}

            {task.status === "success" && task.result && (
                <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
                    <p className="text-sm font-medium text-emerald-400">{task.result.summary}</p>
                    {task.result.detail?.map((d) => (
                        <div key={d.label} className="flex justify-between text-xs text-white/50">
                            <span>{d.label}</span>
                            <span className="text-white/80">{d.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {task.status === "failed" && (
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    <p className="text-xs text-red-400">{task.error}</p>
                    {task.intent !== "unknown" && (
                        <button onClick={onRetry} className="rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-white/20">
                            Retry
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
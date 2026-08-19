import type { AgentTask, ClassifiedIntent } from "../types/agents";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MOCK_BALANCE = 482.5;
const MOCK_PIN = "1234";

function extractAmount(text: string): number | undefined {
    const match = text.match(/\$?\s?(\d+(\.\d{1,2})?)/);
    return match ? parseFloat(match[1]) : undefined;
}

function extractRecipient(text: string): string | undefined {
    const match = text.match(/to\s+([a-zA-Z]+)/i);
    return match ? match[1] : undefined;
}

function extractBiller(text: string): string | undefined {
    const billers = ["electric", "water", "internet", "phone", "wifi"];
    return billers.find((b) => text.includes(b));
}

/**
 * Stands in for: user text -> agentic runtime -> NLP model API
 * (intent classification + entity extraction). Returns a ranked
 * list of intents so one message can carry multiple tasks.
 */
export async function classifyIntents(text: string): Promise<ClassifiedIntent[]> {
    await wait(700 + Math.random() * 500);
    const lower = text.toLowerCase();
    const intents: ClassifiedIntent[] = [];

    if (/(send|transfer)\b/.test(lower)) {
        intents.push({
            id: crypto.randomUUID(),
            type: "send_money",
            confidence: 0.94,
            entities: [
                { key: "amount", label: "Amount", value: String(extractAmount(lower) ?? "") },
                { key: "recipient", label: "Recipient", value: extractRecipient(lower) ?? "" },
            ],
        });
    }

    if (/balance/.test(lower)) {
        intents.push({ id: crypto.randomUUID(), type: "check_balance", confidence: 0.98, entities: [] });
    }

    if (/(bill|pay my)\b/.test(lower)) {
        intents.push({
            id: crypto.randomUUID(),
            type: "bill_payment",
            confidence: 0.89,
            entities: [
                { key: "biller", label: "Biller", value: extractBiller(lower) ?? "electric" },
                { key: "amount", label: "Amount", value: String(extractAmount(lower) ?? "") },
            ],
        });
    }

    if (/(top ?up|add money|reload)/.test(lower)) {
        intents.push({
            id: crypto.randomUUID(),
            type: "topup",
            confidence: 0.91,
            entities: [{ key: "amount", label: "Amount", value: String(extractAmount(lower) ?? "") }],
        });
    }

    if (intents.length === 0) {
        intents.push({ id: crypto.randomUUID(), type: "unknown", confidence: 0.4, entities: [] });
    }

    return intents;
}

/**
 * Stands in for: backend registering a tool per predefined intent
 * and returning task/form data. Financial intents never execute
 * here — they just come back as a form + requiresPin flag.
 */
export function buildTaskFromIntent(intent: ClassifiedIntent): AgentTask {
    const entity = (key: string) => intent.entities.find((e) => e.key === key)?.value;

    switch (intent.type) {
        case "send_money":
            return {
                id: intent.id,
                intent: intent.type,
                title: "Send money",
                description: "Review and confirm the transfer",
                requiresPin: true,
                status: "queued",
                form: {
                    recipient: entity("recipient") ?? "",
                    amount: Number(entity("amount")) || 0,
                    note: "",
                },
            };
        case "check_balance":
            return {
                id: intent.id,
                intent: intent.type,
                title: "Check balance",
                description: "Fetching your current balance",
                requiresPin: false,
                status: "queued",
            };
        case "bill_payment":
            return {
                id: intent.id,
                intent: intent.type,
                title: "Pay bill",
                description: "Review and confirm the payment",
                requiresPin: true,
                status: "queued",
                form: {
                    biller: entity("biller") ?? "electric",
                    amount: Number(entity("amount")) || 0,
                },
            };
        case "topup":
            return {
                id: intent.id,
                intent: intent.type,
                title: "Top up wallet",
                description: "Review and confirm the top up",
                requiresPin: true,
                status: "queued",
                form: {
                    amount: Number(entity("amount")) || 0,
                    source: "Linked card •• 4821",
                },
            };
        default:
            return {
                id: intent.id,
                intent: "unknown",
                title: "Not sure what you need",
                description: 'Try something like "send $20 to Alex"',
                requiresPin: false,
                status: "failed",
                error: "No matching tool found for this request",
            };
    }
}

/**
 * Stands in for: agentic runtime actually executing a registered
 * tool. Financial tools only run once a PIN is supplied — the
 * backend never does the financial task on its own.
 */
export async function executeTask(task: AgentTask, pin?: string): Promise<AgentTask> {
    await wait(800 + Math.random() * 700);

    if (task.requiresPin && pin !== MOCK_PIN) {
        return { ...task, status: "failed", error: "Incorrect PIN. Please try again." };
    }

    switch (task.intent) {
        case "check_balance":
            return {
                ...task,
                status: "success",
                result: {
                    summary: `$${MOCK_BALANCE.toFixed(2)}`,
                    detail: [{ label: "Available balance", value: `$${MOCK_BALANCE.toFixed(2)}` }],
                },
            };
        case "send_money": {
            const f = task.form as { recipient: string; amount: number; note?: string };
            return {
                ...task,
                status: "success",
                result: {
                    summary: `Sent $${f.amount.toFixed(2)} to ${f.recipient}`,
                    detail: [
                        { label: "Recipient", value: f.recipient },
                        { label: "Amount", value: `$${f.amount.toFixed(2)}` },
                        { label: "Note", value: f.note || "—" },
                    ],
                },
            };
        }
        case "bill_payment": {
            const f = task.form as { biller: string; amount: number };
            return {
                ...task,
                status: "success",
                result: {
                    summary: `Paid $${f.amount.toFixed(2)} to ${f.biller}`,
                    detail: [
                        { label: "Biller", value: f.biller },
                        { label: "Amount", value: `$${f.amount.toFixed(2)}` },
                    ],
                },
            };
        }
        case "topup": {
            const f = task.form as { amount: number; source: string };
            return {
                ...task,
                status: "success",
                result: {
                    summary: `Topped up $${f.amount.toFixed(2)}`,
                    detail: [
                        { label: "Source", value: f.source },
                        { label: "Amount", value: `$${f.amount.toFixed(2)}` },
                    ],
                },
            };
        }
        default:
            return { ...task, status: "failed", error: "Unable to execute this task" };
    }
}
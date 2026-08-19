export type IntentType =
    | "send_money"
    | "check_balance"
    | "bill_payment"
    | "topup"
    | "unknown";

export interface AgentEntity {
    key: string;
    label: string;
    value: string;
}

export interface ClassifiedIntent {
    id: string;
    type: IntentType;
    confidence: number;
    entities: AgentEntity[];
}

export type TaskStatus =
    | "queued"
    | "processing"
    | "needs_input"
    | "submitting"
    | "success"
    | "failed";

export interface AgentTaskResult {
    summary: string;
    detail?: { label: string; value: string }[];
}

export interface AgentTask {
    id: string;
    intent: IntentType;
    title: string;
    description: string;
    requiresPin: boolean;
    status: TaskStatus;
    form?: Record<string, unknown>;
    result?: AgentTaskResult;
    error?: string;
}

export interface AgentMessage {
    id: string;
    role: "user" | "agent";
    text?: string;
    createdAt: number;
    thinking?: boolean;
    tasks?: AgentTask[];
}
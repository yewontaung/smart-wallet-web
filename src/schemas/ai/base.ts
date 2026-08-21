import type { AIActionStatus } from "../enums";

export type AgentHook = {
  hookUrl: string;
  hookMethod: string;
  requirePayload: Record<string, unknown>;
  formPayload: Record<string, unknown>;
  requirePin: boolean;
};

export type AgentAction = {
  actionId: number;
  intent: string;
  status: AIActionStatus
  description: string;
  isError: boolean;
  agentHook?: AgentHook;
  formDisplay: Record<string, unknown>;
};

export type AgentResponse = {
  messageId: number;
  prompt: string;
  createdAt: string;
  accountId: number;
  agentActions: AgentAction[];
};

export type AIMessageForm = {
    prompt:string
}
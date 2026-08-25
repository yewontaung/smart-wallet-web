import { type AgentResponse, type AIMessageForm } from "../schemas/ai/base";
import { privateRequest } from "../utils/api";

export async function askAi(form:AIMessageForm) {
    const result = privateRequest<AgentResponse>(
        "/ai/message",
        {
            method: "POST",
            body: form
        }
    )
    return result
}
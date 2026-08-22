// src/hooks/use-global-socket.ts
import { useEffect } from "react";
import { wsEventBus } from "../utils/event-bus";
import { useWebSocket } from "./use-websocket";

export function useGlobalWebSocket(userId?: string) {
    const socketUrl = userId ? `${import.meta.env.VITE_WEB_SOCKET_URL}/${userId}` : null;

    const { lastJsonMessage } = useWebSocket<{ message_type: string; payload: unknown }>(socketUrl, {
        shouldReconnect: true,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        if (!lastJsonMessage) return;

        const { message_type, payload } = lastJsonMessage;

        console.log(message_type)
        console.log(payload)
        if (message_type === "notification") {
            wsEventBus.emit("notification", payload);
        } else if (message_type === "ai_response") {
            wsEventBus.emit("ai_response", payload);
        } else if (message_type === "agent_action") {
            wsEventBus.emit("agent_action", payload);
        }
    }, [lastJsonMessage]);
}
// src/hooks/use-websocket.ts
import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketOptions {
    shouldReconnect?: boolean;
    reconnectInterval?: number;
}

export function useWebSocket<T = unknown>(
    url: string | null,
    options: UseWebSocketOptions = {}
) {
    const { shouldReconnect = true, reconnectInterval = 3000 } = options;
    const [lastJsonMessage, setLastJsonMessage] = useState<T | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    // Ref to hold the latest connect function without circular invocation issues
    const connectRef = useRef<() => void>(() => { });

    const connect = useCallback(() => {
        if (!url) return;

        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            console.log("WS is connected.")
        };

        ws.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                setLastJsonMessage(parsed);
                console.log(parsed)
            } catch (err) {
                console.error("Failed to parse WS frame JSON:", err);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            if (shouldReconnect) {
                setTimeout(() => {
                    // Access connect via ref to break the recursive dependency loop
                    connectRef.current();
                }, reconnectInterval);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            ws.close();
        };
    }, [url, shouldReconnect, reconnectInterval]);

    // Keep connectRef synced with the current connect function instance
    useEffect(() => {
        connectRef.current = connect;
    }, [connect]);

    useEffect(() => {
        if (!url) return;

        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.onclose = null; // Disable auto-reconnect trigger on cleanup

                // Only close if it's already OPEN or CONNECTING
                if (
                    socketRef.current.readyState === WebSocket.OPEN ||
                    socketRef.current.readyState === WebSocket.CONNECTING
                ) {
                    socketRef.current.close();
                }
            }
        };
    }, [url, connect]);
    
    const sendJsonMessage = useCallback((data: unknown) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(data));
        }
    }, []);

    return { lastJsonMessage, isConnected, sendJsonMessage };
}
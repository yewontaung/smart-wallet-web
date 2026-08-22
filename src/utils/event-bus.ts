// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<T = any> = (data: T) => void;

class EventBus {
    private listeners: Map<string, Set<Callback>> = new Map();

    on<T>(event: string, callback: Callback<T>) {
        console.log("registring")
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe cleanup function
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    emit<T>(event: string, data: T) {
        console.log("calling")
        this.listeners.get(event)?.forEach((cb) => cb(data));
    }
}

export const wsEventBus = new EventBus();
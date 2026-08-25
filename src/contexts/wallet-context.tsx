import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    WalletContext,
    type WalletContextValue,
} from "../hooks/use-wallet";

import { getMyBalance } from "../services/wallet-user/me.service";
import { useAuth } from "../hooks/use-auth";
import { useGlobalWebSocket } from "../hooks/use-global-socket";

export function WalletProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [value, setValue] =
        useState<WalletContextValue | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBalance = async () => {
            try {
                const result = await getMyBalance();
                setValue(result);
            } finally {
                setLoading(false);
            }
        };

        loadBalance();
    }, []);

    const { user } = useAuth();

    // Initialize the single WS connection for the entire app session
    useGlobalWebSocket(user?.accountId);

    if (loading || !value) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}
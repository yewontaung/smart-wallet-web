import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../../../components/protected-route";
import { WalletProvider } from "../../../contexts/wallet-context";

export function WalletActionLayout() {
    return (
        <ProtectedRoute>
            <WalletProvider>
                <Outlet />
            </WalletProvider>
        </ProtectedRoute>
    )
}
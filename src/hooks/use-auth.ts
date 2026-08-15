import { createContext, useContext } from "react";
import type { WalletUserAuthResult } from "../schemas/outputs";

export type UserRole = (
    "special-wallet-user" | 
    "normal-wallet-user" | 
    "admin-manager" |
    "normal-manager" |
    "supervisor-manager"
)

export interface User {
    accountId: string;
    phoneNo: string;
    fullName: string;
    role: UserRole;
    profileUrl?: string
}

export interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (result:WalletUserAuthResult) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
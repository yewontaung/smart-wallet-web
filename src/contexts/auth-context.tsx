// contexts/auth-context.tsx
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "../hooks/use-auth";
import type { ProfileInfo, WalletUserAuthResult } from "../schemas/outputs";
import { privateRequest } from "../utils/api";



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(
        () => !!sessionStorage.getItem("auth_token")
    );

    useEffect(() => {
        const savedToken = sessionStorage.getItem("auth_token");
        if (!savedToken) {
            return; // isLoading was already initialized to false
        }

        privateRequest<ProfileInfo>("/wallet-user/me/profile")
            .then((u) => {
                setUser(u);
                setToken(savedToken);
            })
            .catch(() => sessionStorage.removeItem("auth_token"))
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (result:WalletUserAuthResult) => {
        sessionStorage.setItem("auth_token", result.accessToken);
        setToken(result.accessToken);
        setUser({
            accountId: result.accountId,
            fullName: result.fullName,
            phoneNo: result.phoneNo,
            profileUrl: result.profileUrl,
            role: result.role
        })
    };

    const logout = () => {
        sessionStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// components/protected-route.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading, rememberToken } = useAuth();

    if (isLoading) return <div className="min-h-screen bg-black/90" />; // splash/skeleton

    if (!user && !rememberToken) return <Navigate to="/auth/wallet" replace />;

    if (!user && !rememberToken) return <Navigate to="/auth/wallet/remember" replace/>

    return <>{children}</>;
}
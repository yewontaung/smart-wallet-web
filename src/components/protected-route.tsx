// components/protected-route.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="min-h-screen bg-black/90" />; // splash/skeleton
    if (!user) return <Navigate to="/auth/wallet" replace />;

    return <>{children}</>;
}
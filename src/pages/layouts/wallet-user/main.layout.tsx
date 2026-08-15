import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../../../components/protected-route";
import { FloatedBottomNavbar, FloatedTopNavbar } from "../../../components/floated-navbar";

export function MainLayout() {
    return (
        <ProtectedRoute>
            <div className="bg-white/10 min-h-screen relative text-white">
                <section>
                    <div className="flex justify-center">
                        <div className="w-full relative md:w-[40%]">
                            <FloatedTopNavbar />
                            <Outlet />
                        </div>
                    </div>
                </section>
                <FloatedBottomNavbar />
            </div>
        </ProtectedRoute>
    )
}
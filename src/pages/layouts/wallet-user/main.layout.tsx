import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../../../components/protected-route";
import {
    FloatedBottomNavbar,
    FloatedTopNavbar,
} from "../../../components/floated-navbar";

export function MainLayout() {
    return (
        <ProtectedRoute>
            <div className="relative h-dvh overflow-hidden bg-white/10 text-white">
                <section className="h-full overflow-hidden">
                    <div className="flex h-full justify-center">
                        <div className="relative h-full w-full overflow-hidden md:w-[40%]">
                            <FloatedTopNavbar />

                            <div className="h-full overflow-hidden">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </section>

                <FloatedBottomNavbar />
            </div>
        </ProtectedRoute>
    );
}
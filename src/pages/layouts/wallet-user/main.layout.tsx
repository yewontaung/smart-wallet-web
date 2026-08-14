import { Outlet } from "react-router-dom";
import { FloatedBottomNavbar, FloatedTopNavbar } from "../../../components/floated-navbar";

export function MainLayout() {
    return (
        <div className="bg-black/90 min-h-screen relative text-white">
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
    )
}
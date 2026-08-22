import { Outlet } from "react-router-dom";
import {
    FloatedBottomNavbar,
    FloatedTopNavbar,
} from "../../../components/floated-navbar";

export function WalletLayout() {
    return (
        <div className="relative h-dvh overflow-hidden bg-white/10 text-white">
            <section className="h-full">
                <div className="flex h-full justify-center">
                    <div className="relative h-full w-full md:w-[40%]">
                        <FloatedTopNavbar />

                        {/* This is the scrolling area */}
                        <div className="h-full overflow-y-auto overflow-x-hidden">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </section>

            <FloatedBottomNavbar />
        </div>
    );
}
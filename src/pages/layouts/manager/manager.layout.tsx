import {
    Building2,
    LayoutDashboard,
    LogOut,
    WalletCards,
    Users,
} from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

export default function ManagerLayout() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 w-64 border-r border-zinc-800 bg-zinc-900">
                    {/* Logo */}
                    <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
                            <WalletCards className="h-5 w-5 text-sky-400" />
                        </div>

                        <div>
                            <h1 className="text-sm font-semibold">
                                Smart Wallet
                            </h1>
                            <p className="text-xs text-zinc-500">
                                Manager Portal
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 p-3">
                        <NavLink
                            to="/manager/dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                }`
                            }
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/manager/accounts"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                }`
                            }
                        >
                            <Users className="h-5 w-5" />
                            Accounts
                        </NavLink>

                        <NavLink
                            to="/manager/businesses"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-sky-500/10 text-sky-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                }`
                            }
                        >
                            <Building2 className="h-5 w-5" />
                            Businesses
                        </NavLink>
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 p-3">
                        <button
                            type="button"
                            onClick={() => {
                                // TODO: Connect to real logout function.
                                console.log("Manager logout")
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="ml-64 flex min-h-screen flex-1 flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-6 backdrop-blur">
                        <div>
                            <h2 className="text-sm font-medium text-zinc-300">
                                Manager Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sm font-semibold text-sky-400">
                                M
                            </div>

                            <div className="hidden sm:block">
                                <p className="text-sm font-medium">
                                    Manager
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
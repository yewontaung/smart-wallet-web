import { LockKeyhole, UserRound, WalletCards } from "lucide-react"

export default function ManagerLoginPage() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // TODO: Connect this to the real manager login API later.
        console.log("Manager login submitted")
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/20">
                        <WalletCards className="h-7 w-7 text-sky-400" />
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Smart Wallet
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        Manager Portal
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">
                            Manager Login
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            Sign in to access the manager dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username / Phone */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Username
                            </label>

                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-600">
                    Smart Wallet Manager Portal
                </p>
            </div>
        </main>
    )
}
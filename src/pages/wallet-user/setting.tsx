import { useState } from "react";
import {
    Bell,
    ChevronRight,
    Globe,
    HelpCircle,
    KeyRound,
    LogOut,
    Moon,
    ShieldCheck,
    Smartphone,
    User,
} from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";

export function SettingPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricsEnabled, setBiometricsEnabled] = useState(true);
    const {logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        // TODO: Implement your auth/wallet session cleanup here
        console.log("Logging out...");
        logout()
        navigate("/auth/wallet")
    };

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-white">
            {/* Apple-style Floating Header Row */}
            <header className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Floating Title Pill */}
                    <div className="flex h-10 items-center px-4 rounded-full border border-white/15 bg-black/20 backdrop-blur-xl shadow-lg">
                        <h1 className="text-xs font-semibold tracking-wide text-white/90">
                            Settings
                        </h1>
                    </div>
                </div>

                {/* FloatedTopNavbar automatically positions to the right */}
            </header>

            {/* Scrollable Main Content */}
            <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-16 pb-28 space-y-3">
                {/* 1. Account Profile Section */}
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <h2 className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Account
                    </h2>
                    <div className="space-y-1.5">
                        <SettingItem
                            icon={<User className="h-4 w-4 text-sky-400" />}
                            title="Personal Information"
                            subtitle="Name, Phone, KYC status"
                        />
                        <SettingItem
                            icon={<KeyRound className="h-4 w-4 text-amber-400" />}
                            title="Security & PIN"
                            subtitle="Change transaction PIN"
                        />
                    </div>
                </section>

                {/* 2. Preferences Section */}
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <h2 className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Preferences
                    </h2>
                    <div className="space-y-1.5">
                        <SettingToggle
                            icon={<Bell className="h-4 w-4 text-purple-400" />}
                            title="Push Notifications"
                            checked={notificationsEnabled}
                            onChange={setNotificationsEnabled}
                        />
                        <SettingToggle
                            icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
                            title="Face ID / Biometrics"
                            checked={biometricsEnabled}
                            onChange={setBiometricsEnabled}
                        />
                        <SettingItem
                            icon={<Globe className="h-4 w-4 text-indigo-400" />}
                            title="Language"
                            value="English"
                        />
                        <SettingItem
                            icon={<Moon className="h-4 w-4 text-yellow-400" />}
                            title="Theme"
                            value="Dark"
                        />
                    </div>
                </section>

                {/* 3. Support & App Info Section */}
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                    <h2 className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                        Support
                    </h2>
                    <div className="space-y-1.5">
                        <SettingItem
                            icon={<HelpCircle className="h-4 w-4 text-teal-400" />}
                            title="Help Center & FAQ"
                        />
                        <SettingItem
                            icon={<Smartphone className="h-4 w-4 text-white/60" />}
                            title="App Version"
                            value="v1.0.4"
                            clickable={false}
                        />
                    </div>
                </section>

                {/* 4. Priority Action: Logout at Bottom */}
                <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-2.5 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center justify-between rounded-xl bg-rose-500/15 p-3 text-rose-300 border border-rose-500/20 transition hover:bg-rose-500/25 active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 transition group-hover:scale-105">
                                <LogOut className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-semibold">Log Out</p>
                                <p className="text-[10px] text-rose-300/70">
                                    End your wallet session
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-rose-400/60 transition group-hover:translate-x-0.5" />
                    </button>
                </section>
            </main>
        </div>
    );
}

function SettingItem({
    icon,
    title,
    subtitle,
    value,
    clickable = true,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    value?: string;
    clickable?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between rounded-xl bg-white/3 p-2.5 border border-white/5 transition ${
                clickable ? "hover:bg-white/10 cursor-pointer active:scale-[0.99]" : ""
            }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white/90">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="truncate text-[10px] text-white/40">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {value && (
                    <span className="text-xs text-white/50">{value}</span>
                )}
                {clickable && <ChevronRight className="h-3.5 w-3.5 text-white/30" />}
            </div>
        </div>
    );
}

function SettingToggle({
    icon,
    title,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    title: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white/3 p-2.5 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                    {icon}
                </div>
                <p className="truncate text-xs font-medium text-white/90">
                    {title}
                </p>
            </div>

            {/* Refined iOS Glass Switch Toggle */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-all duration-300 ease-in-out focus:outline-none active:scale-95 ${
                    checked
                        ? "border-emerald-400/40 bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                        : "border-white/10 bg-white/10"
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-spring ${
                        checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </button>
        </div>
    );
}
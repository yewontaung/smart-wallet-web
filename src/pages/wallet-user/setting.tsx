import { useState } from "react";
import {
  ChevronRight,
//   HelpCircle,
//   KeyRound,
  LogOut,
//   Smartphone,
//   User,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useNavigate } from "react-router-dom";

export function SettingPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    console.log("Logging out...");
    logout();
    navigate("/auth/wallet");
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
      </header>

      {/* Scrollable Main Content */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-16 pb-28 space-y-3">
        {/* 1. Account Profile Section */}
        {/* <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
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
        </section> */}

        {/* 2. Support & App Info Section */}
        {/* <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
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
        </section> */}

        {/* 3. Priority Action: Logout Trigger Button */}
        <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-2.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
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

      {/* Logout Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-neutral-900/90 p-5 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-8 ring-rose-500/10">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-semibold text-white">Log Out</h3>
            <p className="mt-1 text-xs text-white/60">
              Are you sure you want to log out of your wallet session?
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white/10 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-600 active:scale-95 shadow-lg shadow-rose-500/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
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
          <p className="truncate text-xs font-medium text-white/90">{title}</p>
          {subtitle && (
            <p className="truncate text-[10px] text-white/40">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs text-white/50">{value}</span>}
        {clickable && <ChevronRight className="h-3.5 w-3.5 text-white/30" />}
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  ScanFace,
  LayoutDashboard,
  LogIn,
  Eye,
  EyeOff,
  HardDrive,
  CloudUpload,
  History,
  Shield,
  BarChart2,
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  LogOut,
  AlertCircle,
  Lock,
  User,
} from "lucide-react";

import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { FaceRecognitionScreen } from "@/components/screens/FaceRecognitionScreen";
import { LivenessScreen } from "@/components/screens/LivenessScreen";
import { OfflineStorageScreen } from "@/components/screens/OfflineStorageScreen";
import { SyncScreen } from "@/components/screens/SyncScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { SecurityScreen } from "@/components/screens/SecurityScreen";
import { AdminScreen } from "@/components/screens/AdminScreen";
import { DesktopPanel } from "@/components/DesktopPanel";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Sentinel AI — Secure Edge Dashboard" },
      {
        name: "description",
        content:
          "Enterprise-grade offline facial recognition and liveness detection dashboard.",
      },
    ],
  }),
  component: Index,
} as any));

/* ─── Nav items ─────────────────────────────────────────── */
const navItems = [

  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard",        sub: "Officer home" },
  { id: "face",      icon: ScanFace,        label: "Face Recognition", sub: "Edge AI inference" },
  { id: "liveness",  icon: Eye,             label: "Liveness",         sub: "Anti-spoof" },
  { id: "storage",   icon: HardDrive,       label: "Offline Vault",    sub: "Encrypted store" },
  { id: "sync",      icon: CloudUpload,     label: "AWS Sync",         sub: "Cloud upload" },
  { id: "history",   icon: History,         label: "History",          sub: "Verified records" },
  { id: "security",  icon: Shield,          label: "Security Center",  sub: "Posture & threats" },
  { id: "admin",     icon: BarChart2,       label: "Admin Analytics",  sub: "Command console" },
];

const screenMap: Record<string, React.ReactNode> = {
  dashboard: <DesktopPanel dark={false}><DashboardScreen /></DesktopPanel>,
  face:      <DesktopPanel dark={true}><FaceRecognitionScreen /></DesktopPanel>,
  liveness:  <DesktopPanel dark={false}><LivenessScreen /></DesktopPanel>,
  storage:   <DesktopPanel dark={false}><OfflineStorageScreen /></DesktopPanel>,
  sync:      <DesktopPanel dark={true}><SyncScreen /></DesktopPanel>,
  history:   <DesktopPanel dark={false}><HistoryScreen /></DesktopPanel>,
  security:  <DesktopPanel dark={false}><SecurityScreen /></DesktopPanel>,
  admin:     <DesktopPanel dark={false}><AdminScreen /></DesktopPanel>,
};

/* ─── Login Page ─────────────────────────────────────────── */
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username === "admin" && password === "admin@123") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 800);
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#0d2137] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header strip */}
          <div className="bg-navy-radial px-8 pt-10 pb-8 text-center relative">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] shadow-lg shadow-blue-900/50 mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-white text-2xl font-display font-bold tracking-tight">
                Sentinel <span className="text-gradient-blue">AI</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">Secure Edge Authentication</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#2563EB]/60 focus:bg-[#2563EB]/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#2563EB]/60 focus:bg-[#2563EB]/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563EB] text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-center justify-center text-[11px] text-white/25">
              <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
              AES-256 Encrypted · Offline Capable
            </div>
          </form>
        </div>

        <p className="text-center text-white/20 text-[11px] mt-6">
          Sentinel AI v2.4.1 · Edge Build · © 2026
        </p>
      </div>
    </div>
  );
}

/* ─── Dashboard Shell ────────────────────────────────────── */
function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sentinel_active_tab") || "dashboard";
    }
    return "dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const current = navItems.find((n) => n.id === active)!;

  const handleNav = (id: string) => {
    setActive(id);
    localStorage.setItem("sentinel_active_tab", id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A192F] font-sans">

      {/* ── Mobile overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          flex flex-col h-full bg-[#0d2137] border-r border-white/10
          transition-all duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarOpen ? "w-64" : "lg:w-[68px] w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${!sidebarOpen ? "lg:hidden" : ""}`}>
            <div className="text-white font-display font-bold text-sm leading-tight whitespace-nowrap">
              Sentinel AI
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest">
              Edge Secure
            </div>
          </div>
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="ml-auto text-white/40 hover:text-white transition-colors hidden lg:block"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          {/* Mobile close */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto text-white/40 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-[#2563EB]/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive
                      ? "bg-[#2563EB] shadow-lg shadow-blue-800/40"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className={`flex-1 overflow-hidden transition-all duration-300 ${!sidebarOpen ? "lg:hidden" : ""}`}>
                  <div className="text-sm font-medium truncate leading-tight">{item.label}</div>
                  <div className="text-[10px] text-white/30 truncate">{item.sub}</div>
                </div>
                {sidebarOpen && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0 hidden lg:block" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? "lg:justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className={`flex-1 overflow-hidden transition-all duration-300 ${!sidebarOpen ? "lg:hidden" : ""}`}>
              <div className="text-white text-xs font-semibold truncate">Admin</div>
              <div className="text-white/40 text-[10px] truncate">Super Admin</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className={`text-white/30 hover:text-red-400 transition-colors ${!sidebarOpen ? "lg:hidden" : ""}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 md:px-6 py-3.5 bg-[#0d2137] border-b border-white/10 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-white/50 hover:text-white transition-colors mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-white font-display font-semibold text-base leading-tight">
              {current.label}
            </h1>
            <div className="text-white/40 text-[11px]">{current.sub}</div>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Search — hidden on xs */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/50 text-sm hover:border-white/20 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-xs hidden lg:block">Search…</span>
              <kbd className="hidden lg:block text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>

            {/* Bell */}
            <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0d2137]" />
            </button>

            {/* Status badge — hidden on xs */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline">Edge AI Active</span>
              <span className="md:hidden">Active</span>
            </div>

            {/* Logout on mobile topbar */}
            <button
              onClick={onLogout}
              title="Logout"
              className="lg:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-white/10 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#0A192F]">
          <div className="min-h-full">
            {screenMap[active]}
          </div>
        </main>

        {/* Bottom status bar */}
        <div className="shrink-0 flex flex-wrap items-center justify-between px-4 md:px-6 py-2 bg-[#0d2137] border-t border-white/10 text-[10px] text-white/30 gap-2">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
              <span className="hidden sm:inline">Sentinel AI v2.4.1</span>
              <span className="sm:hidden">v2.4.1</span>
            </span>
            <span className="hidden md:inline">Edge Build · AES-256</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline">Offline · Last sync 2h ago</span>
            </span>
            <span className="hidden md:inline">© 2026 Sentinel AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────── */
function Index() {
  const [loggedIn, setLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sentinel_admin_logged") === "true";
    }
    return false;
  });

  const handleLogin = () => {
    localStorage.setItem("sentinel_admin_logged", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("sentinel_admin_logged");
    localStorage.removeItem("sentinel_active_tab");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardShell onLogout={handleLogout} />;
}

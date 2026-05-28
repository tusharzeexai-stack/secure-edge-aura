import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { SplashScreen } from "@/components/screens/SplashScreen";
import { LoginScreen } from "@/components/screens/LoginScreen";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { FaceRecognitionScreen } from "@/components/screens/FaceRecognitionScreen";
import { LivenessScreen } from "@/components/screens/LivenessScreen";
import { OfflineStorageScreen } from "@/components/screens/OfflineStorageScreen";
import { SyncScreen } from "@/components/screens/SyncScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { SecurityScreen } from "@/components/screens/SecurityScreen";
import { AdminScreen } from "@/components/screens/AdminScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel AI — Offline Facial Recognition & Liveness Detection" },
      {
        name: "description",
        content:
          "Premium navy-blue enterprise mobile UI for an AI-powered offline facial recognition and liveness detection system built for secure field operations.",
      },
      { property: "og:title", content: "Sentinel AI — Offline Secure Authentication" },
      {
        property: "og:description",
        content:
          "Enterprise-grade mobile UI showcase: facial recognition, liveness detection, AWS sync, and admin analytics.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const screens = [
    { t: "01 · Splash", s: "Launch + AI scan", c: <SplashScreen />, dark: true },
    { t: "02 · Login", s: "Face or PIN fallback", c: <LoginScreen />, dark: true },
    { t: "03 · Dashboard", s: "Field officer home", c: <DashboardScreen /> },
    { t: "04 · Face Recognition", s: "Edge AI inference", c: <FaceRecognitionScreen />, dark: true },
    { t: "05 · Liveness", s: "Anti-spoof challenge", c: <LivenessScreen />, dark: true },
    { t: "06 · Offline Vault", s: "Encrypted local store", c: <OfflineStorageScreen /> },
    { t: "07 · AWS Sync", s: "Secure cloud upload", c: <SyncScreen />, dark: true },
    { t: "08 · History", s: "Verified records", c: <HistoryScreen /> },
    { t: "09 · Security Center", s: "Posture & threats", c: <SecurityScreen /> },
    { t: "10 · Admin Analytics", s: "Command console", c: <AdminScreen /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-navy-radial text-white">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/60">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
            Government-grade · Edge AI
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-display font-bold tracking-tight max-w-3xl">
            Sentinel <span className="text-gradient-blue">AI</span> — Offline Facial Recognition & Liveness Detection
          </h1>
          <p className="mt-4 max-w-2xl text-white/70 text-base md:text-lg">
            A premium navy-blue mobile experience designed for secure field operations in zero-network environments. Ten production-ready screens, one cohesive enterprise system.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
            {["AES-256 Encrypted", "Zero Network", "Anti-Spoof AI", "AWS Sync", "Liveness 3D", "Edge Inference 38ms"].map((b) => (
              <span key={b} className="px-3 py-1.5 rounded-full glass-card flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent-blue" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Screens grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent-blue">Mobile UI Showcase</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold text-navy-deep">
              Ten screens. One secure system.
            </h2>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground max-w-xs text-right">
            iOS + Android. Built on a single navy/white design system with glassmorphism, soft shadows, and sophisticated motion.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
          {screens.map((s) => (
            <MobileFrame key={s.t} title={s.t} subtitle={s.s} dark={s.dark}>
              {s.c}
            </MobileFrame>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-blue" />
            <span className="font-semibold text-navy-deep">SENTINEL AI</span>
            <span>· Offline Secure Authentication System</span>
          </div>
          <span>v2.4.1 · Edge Build · © 2026</span>
        </div>
      </footer>
    </div>
  );
}

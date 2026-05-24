"use client";

import { ExternalLink, Globe, GlobeLock, CalendarDays, TrendingUp, TrendingDown } from "lucide-react";
import { Social, delta } from "@/lib/demoData";

// ── Metric card with real delta ──────────────────
export function Metric({
  icon: Icon, label, value, current, prev, format = "num",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  current?: number;
  prev?: number;
  format?: "num" | "pct" | "dollar";
}) {
  const d = current !== undefined && prev !== undefined ? delta(current, prev) : null;
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025))] p-5 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#2b161c] text-[#f1889e]">
          <Icon className="h-5 w-5" />
        </div>
        {d !== null && (
          <span className={`flex items-center gap-1 text-xs font-bold ${d.positive ? "text-emerald-400" : "text-rose-400"}`}>
            {d.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {d.positive ? "+" : "-"}{d.pct}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-[#b8a8a4]">{label}</p>
    </div>
  );
}

// ── Panel wrapper ────────────────────────────────
export function Panel({
  title, children, action = true, onViewAll,
}: {
  title: string;
  children: React.ReactNode;
  action?: boolean;
  onViewAll?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111010]/80 p-5 shadow-[0_25px_80px_rgba(0,0,0,.38)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        {action && (
          <button onClick={onViewAll} className="rounded-full px-3 py-1 text-xs font-bold text-[#f1889e] hover:bg-[#2a151a]">
            View all
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

// ── Progress bar ─────────────────────────────────
export function ProgressBar({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  return (
    <div className={`overflow-hidden rounded-full bg-[#2a151a] ${size === "md" ? "h-3" : "h-2"}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#e66f8e] to-[#f4a27c] transition-all duration-500"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

// ── Hero banner ──────────────────────────────────
export function Hero({ title, subtitle, tag }: { title: string; subtitle: string; tag?: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025))] p-6 shadow-[0_25px_90px_rgba(0,0,0,.45)] md:p-8">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(230,111,142,.20),transparent_24rem)]" />
      <div className="relative">
        <p className="mb-3 inline-flex rounded-full border border-[#ffb7c42e] bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#f1889e]">
          {tag ?? "Hair Journey"}
        </p>
        <h1 className="text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-[#b8a8a4]">{subtitle}</p>
      </div>
    </section>
  );
}

// ── Empty state ───────────────────────────────────
export function EmptyState({
  icon: Icon, title, subtitle, action, onAction,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ff8fab33] bg-[#151011] px-6 py-10 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#2a151a] text-[#f1889e]">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-black text-[#f3b4c1]">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-[#b8a8a4]">{subtitle}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-5 py-2 text-sm font-black text-[#17090d]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
      <div className="mb-3 h-4 w-1/3 rounded-full bg-[#2a151a]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`mb-2 h-3 rounded-full bg-[#1e1013]`} style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}

// ── Snapshot tile ─────────────────────────────────
export function Snapshot({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-[#151011] p-4">
      <p className="text-xs text-[#b8a8a4]">{label}</p>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-[#b8a8a4]">{sub}</p>
    </div>
  );
}

// ── Priority badge ────────────────────────────────
export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high:   "bg-[#3d1419] text-rose-400",
    medium: "bg-[#2d2210] text-[#dca669]",
    low:    "bg-[#122418] text-emerald-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${map[priority]}`}>
      {priority}
    </span>
  );
}

// ── Status badge ──────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "On track":       "bg-[#122418] text-emerald-400",
    "Needs focus":    "bg-[#2d2210] text-[#dca669]",
    "Getting started":"bg-[#1a1230] text-[#a78bfa]",
    "Photo due":      "bg-[#2d2210] text-[#dca669]",
    "Needs review":   "bg-[#3d1419] text-rose-400",
    "Plan completed": "bg-[#122418] text-emerald-400",
    "Updated today":  "bg-[#122418] text-emerald-400",
    "Intake pending": "bg-[#1a1230] text-[#a78bfa]",
    "completed":      "bg-[#122418] text-emerald-400",
    "upcoming":       "bg-[#1a1230] text-[#a78bfa]",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${map[status] ?? "bg-[#2a151a] text-[#f3b4c1]"}`}>
      {status}
    </span>
  );
}

// ── Social connections list ───────────────────────
export function SocialList({ socials, showClientLinks }: { socials: Social[]; showClientLinks?: boolean }) {
  const iconMap: Record<string, React.ElementType> = {
    Instagram: Globe,
    Facebook: GlobeLock,
    TikTok: Globe,
    Booking: CalendarDays,
  };
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {socials.map((s) => {
        const Icon = iconMap[s.platform] ?? Globe;
        return (
          <div key={s.platform} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2a151a] text-[#f1889e]">
                <Icon className="h-5 w-5" />
              </div>
              <a href={`https://${s.url}`} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 text-[#dca669]" />
              </a>
            </div>
            <p className="font-black">{s.platform}</p>
            <p className="text-sm text-[#f3b4c1]">{s.handle}</p>
            <p className="mt-1 text-xs text-[#b8a8a4]">{s.url}</p>
            {s.followers > 0 && (
              <p className="mt-2 text-xs font-bold text-[#b8a8a4]">
                {s.followers.toLocaleString()} followers
                {s.followersPrev > 0 && (
                  <span className={`ml-2 ${s.followers >= s.followersPrev ? "text-emerald-400" : "text-rose-400"}`}>
                    {s.followers >= s.followersPrev ? "+" : ""}{s.followers - s.followersPrev}
                  </span>
                )}
              </p>
            )}
            {showClientLinks && <p className="mt-2 text-xs font-bold text-[#dca669]">Visible to clients</p>}
          </div>
        );
      })}
    </div>
  );
}

// ── Work tabs ─────────────────────────────────────
export function WorkTabs({
  tab, setTab,
}: {
  tab: "business" | "mentorship";
  setTab: (t: "business" | "mentorship") => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {(["business", "mentorship"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
            tab === t
              ? "bg-[#f1889e] text-[#17090d]"
              : "border border-[#ff8fab33] bg-[#171112] text-[#f3b4c1] hover:bg-[#2a151a]"
          }`}
        >
          {t === "business" ? "Client + Business Management" : "Mentorship + Growth"}
        </button>
      ))}
    </div>
  );
}

// ── Booking platform CTA ──────────────────────────
export function BookingCTA({ url, label = "Open Booking Platform" }: { url: string; label?: string }) {
  return (
    <div className="rounded-3xl border border-[#e66f8e]/25 bg-[#241218] p-5 text-center">
      <CalendarDays className="mx-auto mb-3 h-8 w-8 text-[#f1889e]" />
      <p className="font-black text-[#f3b4c1]">Schedule is managed in your booking platform</p>
      <p className="mt-1 text-sm text-[#b8a8a4]">Appointments, reminders, and calendar sync live there.</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-5 py-2.5 text-sm font-black text-[#17090d]"
      >
        {label}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

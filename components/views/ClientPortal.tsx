"use client";

import { useState, useRef } from "react";
import { CalendarDays, Camera, CheckCircle2, Clock, Droplets, ExternalLink, Lightbulb, PackageCheck } from "lucide-react";
import { ProgressBar } from "@/components/ui/base";
import { menteeKia, computeProgress, journeyDays, lowestFactor } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const CLIENT  = menteeKia.clients[0];
const STYLIST = menteeKia;
const OVERALL = computeProgress(CLIENT.progressFactors);
const DAYS    = journeyDays(CLIENT.locStartDate);
const LOWEST  = lowestFactor(CLIENT.progressFactors);

type Tab = "Timeline" | "Photos" | "Plans" | "Appointments" | "Notes";

function CircularProgress({ value, size = 88 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]" style={{ position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a1520" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#c4687a" strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-lg font-black leading-none">{value}%</p>
        <p className="text-[8px] text-[#6b5a63]">Progress</p>
      </div>
    </div>
  );
}

function WashDayForm() {
  const [form, setForm] = useState({ date: "2026-05-24", shampoo: "", conditioner: "", oils: "", dryingMethod: "Air dry", scalpCondition: "Good", buildupLevel: "None", notes: "" });
  const up = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="space-y-3">
      <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Date</label><input type="date" value={form.date} onChange={up("date")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Shampoo</label><input value={form.shampoo} onChange={up("shampoo")} placeholder="e.g. Mielle Rosemary Mint" className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Conditioner</label><input value={form.conditioner} onChange={up("conditioner")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Oils / moisturizers</label><input value={form.oils} onChange={up("oils")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Drying method</label>
          <select value={form.dryingMethod} onChange={up("dryingMethod")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none">
            <option>Air dry</option><option>Hooded dryer</option><option>Diffuser</option>
          </select></div>
        <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Scalp condition</label>
          <select value={form.scalpCondition} onChange={up("scalpCondition")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none">
            <option>Good</option><option>Dry</option><option>Flaky</option><option>Itchy</option>
          </select></div>
        <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Buildup</label>
          <select value={form.buildupLevel} onChange={up("buildupLevel")} className="w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none">
            <option>None</option><option>Light</option><option>Moderate</option><option>Heavy</option>
          </select></div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#e8909e]">Notes</label><textarea value={form.notes} onChange={up("notes")} rows={3} className="w-full resize-none rounded-xl border border-white/[0.06] bg-[#0d0b0c] px-4 py-2.5 text-sm text-white outline-none" /></div>
      <button className="w-full rounded-xl bg-[#c4687a] py-2.5 font-black text-white">Save wash day</button>
    </div>
  );
}

const PHOTO_LABELS = ["Starter locs", "Budding phase", "Current progress"];
function PhotoGrid() {
  const [urls, setUrls] = useState(["", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PHOTO_LABELS.map((label, i) => (
        <div key={label} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-dashed border-white/[0.08] bg-[#131013]">
          {urls[i] ? <img src={urls[i]} alt={label} className="h-full w-full object-cover" />
            : <div className="flex h-full flex-col items-center justify-center gap-1.5"><Camera className="h-6 w-6 text-[#3a2530]" /><p className="text-xs text-[#3a2530]">{label}</p></div>}
          <button onClick={() => refs[i].current?.click()} className="absolute inset-0 flex items-end justify-center bg-black/50 pb-3 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-[#c4687a] px-3 py-1 text-xs font-black text-white">{urls[i] ? "Replace" : "Upload"}</span>
          </button>
          <input ref={refs[i]} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setUrls(p => p.map((u, j) => j === i ? URL.createObjectURL(f) : u)); }} />
        </div>
      ))}
    </div>
  );
}

export default function ClientPortal({ openModal }: { openModal: ModalOpener }) {
  const [tab, setTab] = useState<Tab>("Timeline");
  const tabs: Tab[] = ["Timeline", "Photos", "Plans", "Appointments", "Notes"];

  return (
    <div className="flex min-h-screen">
      {/* Left — overview */}
      <div className="w-full p-6 xl:w-[340px] xl:border-r xl:border-white/[0.06]">
        <div className="mb-5">
          <p className="text-2xl font-black">Hey, Layla! 👋</p>
          <p className="text-sm text-[#6b5a63]">Stay consistent. You got this.</p>
        </div>

        {/* Progress */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-3 text-sm font-black">My Progress</p>
          <div className="flex items-center gap-4">
            <CircularProgress value={OVERALL} size={88} />
            <div>
              <p className="text-xs text-[#6b5a63]">Overall Progress</p>
              <p className="flex items-center gap-1 text-xs font-bold text-emerald-400">↑ 8% this month</p>
              <p className="mt-2 text-xs text-[#6b5a63]">{DAYS} days on journey</p>
              <p className="text-xs text-[#6b5a63]">{CLIENT.locPhase}</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-[#1e1011] p-2.5">
            <p className="flex items-start gap-1.5 text-xs text-[#a09099]">
              <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-[#dca669]" />
              <span><span className="font-bold text-[#dca669]">Tip: </span>{LOWEST.tip}</span>
            </p>
          </div>
        </div>

        {/* Next appointment */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-2 text-sm font-black">Next Appointment</p>
          <p className="text-xs text-[#6b5a63]">May 28, 2025 · 10:00 AM</p>
          <p className="mt-1 font-bold">{CLIENT.service}</p>
          <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#c4687a] py-2 text-xs font-black text-white">
            <CalendarDays className="h-3.5 w-3.5" /> View Details <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Wash days */}
        <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black">Recent Wash Days</p>
            <button onClick={() => openModal({ title: "Log Wash Day", content: <WashDayForm /> })} className="text-xs font-bold text-[#c4687a]">+ Log</button>
          </div>
          {CLIENT.washDays.slice(0, 2).map(w => (
            <div key={w.id} className="mb-2 flex items-start gap-2 rounded-xl bg-[#0d0b0c] p-2.5">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c4687a]" />
              <div>
                <p className="text-xs font-bold">{w.date}</p>
                <p className="text-[10px] text-[#6b5a63]">{w.shampoo}</p>
                <span className={`text-[10px] font-bold ${w.scalpCondition === "Good" ? "text-emerald-400" : "text-[#dca669]"}`}>{w.scalpCondition} scalp</span>
              </div>
            </div>
          ))}
        </div>

        {/* Connect with stylist */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
          <p className="mb-3 text-sm font-black">Connect with {STYLIST.name.split(" ")[0]}</p>
          {STYLIST.socials.slice(0, 2).map(s => (
            <a key={s.platform} href={`https://${s.url}`} target="_blank" rel="noreferrer" className="mb-2 flex items-center justify-between rounded-xl bg-[#0d0b0c] px-3 py-2 hover:bg-white/[0.03]">
              <div><p className="text-xs font-bold">{s.platform}</p><p className="text-[10px] text-[#6b5a63]">{s.handle}</p></div>
              <ExternalLink className="h-3 w-3 text-[#dca669]" />
            </a>
          ))}
          <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer" className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#c4687a] to-[#dca669] py-2 text-xs font-black text-white">
            <CalendarDays className="h-3.5 w-3.5" /> Book appointment
          </a>
        </div>
      </div>

      {/* Right — My Journey tabbed area */}
      <div className="hidden flex-1 p-6 xl:block">
        <div className="mb-5">
          <h2 className="text-xl font-black">My Journey</h2>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-2xl border border-white/[0.06] bg-[#131013] p-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-xl py-2 text-xs font-black transition ${tab === t ? "bg-[#c4687a] text-white" : "text-[#6b5a63] hover:text-[#a09099]"}`}>{t}</button>
          ))}
        </div>

        {tab === "Timeline" && (
          <div className="space-y-3">
            {CLIENT.timeline.map(t => (
              <div key={t.id} className="flex gap-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#c4687a] shadow-[0_0_8px_rgba(196,104,122,.6)]" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#c4687a]">{t.date}</p>
                  <p className="font-bold">{t.title}</p>
                  <p className="text-sm text-[#6b5a63]">{t.body}</p>
                </div>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#dca669]" />
              </div>
            ))}
          </div>
        )}

        {tab === "Photos" && (
          <div>
            <p className="mb-4 text-sm text-[#6b5a63]">Upload progress photos to track your loc journey visually.</p>
            <PhotoGrid />
          </div>
        )}

        {tab === "Plans" && (
          <div className="space-y-3">
            {CLIENT.carePlan.map(c => (
              <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c4687a]/10 text-[#c4687a]"><Droplets className="h-4 w-4" /></div>
                <div>
                  <p className="font-bold">{c.category}</p>
                  <p className="text-sm text-[#6b5a63]">{c.instruction}</p>
                  <p className="mt-1 text-xs font-bold text-[#dca669]">{c.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Appointments" && (
          <div>
            <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
              <p className="mb-1 text-xs text-[#6b5a63]">Upcoming</p>
              <p className="font-black">May 28, 2025 · 10:00 AM</p>
              <p className="text-sm text-[#a09099]">{CLIENT.service}</p>
              <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#c4687a]">Manage booking <ExternalLink className="h-3 w-3" /></a>
            </div>
            {CLIENT.timeline.filter(t => t.type === "appointment").map(a => (
              <div key={a.id} className="mb-2 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div><p className="font-bold">{a.title}</p><p className="text-xs text-[#6b5a63]">{a.date}</p><p className="text-sm text-[#a09099]">{a.body}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab === "Notes" && (
          <div className="space-y-3">
            {CLIENT.products.map(p => (
              <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#131013] p-4">
                <PackageCheck className={`mt-0.5 h-4 w-4 shrink-0 ${p.status === "avoid" ? "text-rose-400" : "text-emerald-400"}`} />
                <div>
                  <div className="flex items-center gap-2"><p className="font-bold">{p.name}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.status === "recommended" ? "bg-emerald-900/40 text-emerald-400" : "bg-rose-900/40 text-rose-400"}`}>{p.status}</span></div>
                  <p className="text-xs text-[#6b5a63]">{p.result}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

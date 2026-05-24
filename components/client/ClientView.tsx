"use client";

import { useState, useRef } from "react";
import {
  Camera, CalendarDays, CheckCircle2, Droplets,
  PackageCheck, ExternalLink, Lightbulb, ArrowUpRight, Clock,
} from "lucide-react";
import { Panel, ProgressBar, SocialList } from "@/components/ui/base";
import { menteeKia, computeProgress, journeyDays, lowestFactor } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const CLIENT  = menteeKia.clients[0]; // Layla M.
const STYLIST = menteeKia;
const OVERALL = computeProgress(CLIENT.progressFactors);
const DAYS    = journeyDays(CLIENT.locStartDate);
const LOWEST  = lowestFactor(CLIENT.progressFactors);

// ── Progress breakdown (used inside modal) ────────────────────────────────────
export function ProgressBreakdown() {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-[#e66f8e]/25 bg-[#241218] p-5">
        <p className="text-sm text-[#b8a8a4]">Overall journey progress score</p>
        <p className="mt-1 text-5xl font-black">{OVERALL}%</p>
        <p className="mt-2 text-sm leading-6 text-[#b8a8a4]">Weighted across 5 categories tracking how actively you're participating in your journey.</p>
      </div>
      <div className="rounded-2xl border border-[#dca669]/30 bg-[#1e1a0a] p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#dca669]" />
          <div>
            <p className="text-sm font-black text-[#dca669]">Focus area: {LOWEST.label} ({LOWEST.score}%)</p>
            <p className="mt-0.5 text-sm text-[#b8a8a4]">{LOWEST.tip}</p>
          </div>
        </div>
      </div>
      {CLIENT.progressFactors.map(f => (
        <div key={f.label} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="font-black">{f.label}</p>
              <p className="text-xs text-[#b8a8a4]">{f.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-[#f1889e]">{f.score}%</p>
              <p className="text-xs text-[#b8a8a4]">Weight {f.weight}%</p>
            </div>
          </div>
          <ProgressBar value={f.score} />
        </div>
      ))}
    </div>
  );
}

// ── Wash day log form ──────────────────────────────────────────────────────────
export function WashDayForm({ onClose }: { onClose?: () => void }) {
  const [form, setForm] = useState({
    date: "2026-05-24", shampoo: "", conditioner: "", oils: "",
    dryingMethod: "Air dry", scalpCondition: "Good", buildupLevel: "None", notes: "",
  });
  const up = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-4">
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Date</label>
        <input type="date" value={form.date} onChange={up("date")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Shampoo used</label>
        <input value={form.shampoo} onChange={up("shampoo")} placeholder="e.g. Mielle Rosemary Mint" className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Conditioner / masque</label>
        <input value={form.conditioner} onChange={up("conditioner")} placeholder="e.g. As I Am Hydration Masque" className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Oils / moisturizers</label>
        <input value={form.oils} onChange={up("oils")} placeholder="e.g. Jamaican Black Castor Oil" className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Drying method</label>
          <select value={form.dryingMethod} onChange={up("dryingMethod")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none">
            <option>Air dry</option><option>Hooded dryer</option><option>Diffuser</option><option>Blow dry</option>
          </select></div>
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Scalp condition</label>
          <select value={form.scalpCondition} onChange={up("scalpCondition")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none">
            <option>Good</option><option>Dry</option><option>Flaky</option><option>Itchy</option>
          </select></div>
        <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Buildup level</label>
          <select value={form.buildupLevel} onChange={up("buildupLevel")} className="w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none">
            <option>None</option><option>Light</option><option>Moderate</option><option>Heavy</option>
          </select></div>
      </div>
      <div><label className="mb-1 block text-xs font-bold text-[#f3b4c1]">Notes</label>
        <textarea value={form.notes} onChange={up("notes")} rows={3} placeholder="How did your hair feel? Anything unusual?" className="w-full resize-none rounded-2xl border border-[#ff8fab33] bg-[#171112] px-4 py-2.5 text-sm text-[#fff7f4] outline-none" /></div>
      <button className="w-full rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-2.5 font-black text-[#17090d]">Save wash day</button>
    </div>
  );
}

// ── Progress photo upload (refs outside map) ───────────────────────────────────
const PHOTO_LABELS = ["Starter locs", "Budding phase", "Current progress"];

function PhotoSection() {
  const [urls, setUrls] = useState(["", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function handleUpload(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUrls(prev => prev.map((u, i) => (i === idx ? url : u)));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PHOTO_LABELS.map((label, i) => (
        <div key={label} className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-dashed border-[#ffb7c42e] bg-[#171112]">
          {urls[i]
            ? <img src={urls[i]} alt={label} className="h-full w-full object-cover" />
            : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <Camera className="h-8 w-8 text-[#f1889e]" />
                <p className="text-sm font-bold text-[#b8a8a4]">{label}</p>
                <p className="text-xs text-[#76676a]">Tap to upload</p>
              </div>
            )}
          <button
            onClick={() => refs[i].current?.click()}
            className="absolute inset-0 flex items-end justify-center bg-black/50 pb-4 opacity-0 transition group-hover:opacity-100"
          >
            <span className="rounded-full bg-[#f1889e] px-3 py-1 text-xs font-black text-[#17090d]">
              {urls[i] ? "Replace" : "Upload"}
            </span>
          </button>
          <input ref={refs[i]} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(i, e)} />
          {urls[i] && <p className="absolute bottom-2 left-3 text-xs font-bold text-white drop-shadow">{label}</p>}
        </div>
      ))}
    </div>
  );
}

// ── Main client view ───────────────────────────────────────────────────────────
export default function ClientView({ openModal }: { openModal: ModalOpener }) {
  return (
    <div className="space-y-7">
      {/* Personalized hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025))] p-6 shadow-[0_25px_90px_rgba(0,0,0,.45)] md:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(230,111,142,.20),transparent_24rem)]" />
        <div className="relative">
          <p className="mb-3 inline-flex rounded-full border border-[#ffb7c42e] bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#f1889e]">Hair Journey</p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Hey, Layla! 👋</h1>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-[#1e1013] px-4 py-2">
              <p className="text-xs text-[#b8a8a4]">Days on journey</p>
              <p className="text-2xl font-black text-[#f1889e]">{DAYS}</p>
            </div>
            <div className="rounded-2xl bg-[#1e1013] px-4 py-2">
              <p className="text-xs text-[#b8a8a4]">Loc phase</p>
              <p className="text-2xl font-black">{CLIENT.locPhase}</p>
            </div>
            <div className="rounded-2xl bg-[#1e1013] px-4 py-2">
              <p className="text-xs text-[#b8a8a4]">Progress score</p>
              <p className="text-2xl font-black">{OVERALL}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect with stylist */}
      <Panel title={`Connect with ${STYLIST.name.split(" ")[0]}`} action={false}>
        <div className="mb-4"><SocialList socials={STYLIST.socials} showClientLinks /></div>
        <a
          href={STYLIST.bookingUrl} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-3 font-black text-[#17090d]"
        >
          <CalendarDays className="h-5 w-5" /> Book your next appointment
          <ExternalLink className="h-4 w-4" />
        </a>
      </Panel>

      {/* Progress + next appointment */}
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel
          title="Your Progress Overview"
          onViewAll={() => openModal({ title: "Progress Breakdown", content: <ProgressBreakdown /> })}
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-5xl font-black">{OVERALL}%</p>
              <p className="text-sm text-[#b8a8a4]">Weighted journey score</p>
            </div>
            <button
              onClick={() => openModal({ title: "Progress Breakdown", content: <ProgressBreakdown /> })}
              className="rounded-full border border-[#e66f8e]/40 bg-[#171112] px-3 py-2 text-xs font-bold text-[#f1889e] hover:bg-[#2a151a]"
            >
              What counts?
            </button>
          </div>
          <ProgressBar value={OVERALL} size="md" />
          <div className="mt-4 rounded-2xl border border-[#dca669]/30 bg-[#1e1a0a] p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#dca669]" />
              <p className="text-sm text-[#b8a8a4]">
                <span className="font-black text-[#dca669]">Tip: </span>{LOWEST.tip}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Next Appointment" action={false}>
          <div className="rounded-3xl border border-[#e66f8e]/25 bg-[#241218] p-5">
            <p className="text-sm text-[#b8a8a4]">May 28, 2026 · 10:00 AM</p>
            <p className="mt-2 text-2xl font-black">Check-in & Photo Update</p>
            <p className="mt-2 text-sm text-[#b8a8a4]">Front/back photos, scalp notes, and maintenance plan review.</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-[#f3b4c1]">Come prepared:</p>
              {["Clean + dry locs before appointment", "Bring your current product list", "Have wash day log ready to share"].map(t => (
                <p key={t} className="flex items-start gap-2 text-xs text-[#b8a8a4]">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#dca669]" />{t}
                </p>
              ))}
            </div>
            <a href={STYLIST.bookingUrl} target="_blank" rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-3 font-black text-[#17090d]">
              Manage booking <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Panel>
      </div>

      {/* Timeline + care plan */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.7fr]">
        <Panel
          title="Hair Journey Timeline"
          onViewAll={() => openModal({
            title: "Full Journey Timeline",
            content: (
              <div className="space-y-3">
                {CLIENT.timeline.map(t => (
                  <div key={t.id} className="flex gap-4 rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#e66f8e] shadow-[0_0_12px_rgba(230,111,142,.8)]" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#f1889e]">{t.date}</p>
                      <p className="font-black">{t.title}</p>
                      <p className="text-sm text-[#b8a8a4]">{t.body}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#dca669]" />
                  </div>
                ))}
              </div>
            ),
          })}
        >
          <div className="space-y-3">
            {CLIENT.timeline.slice(0, 4).map(t => (
              <div key={t.id} className="flex gap-4 rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#e66f8e] shadow-[0_0_12px_rgba(230,111,142,.8)]" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#f1889e]">{t.date}</p>
                  <p className="font-black">{t.title}</p>
                  <p className="text-sm text-[#b8a8a4]">{t.body}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#dca669]" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Care Plan" action={false}>
          <div className="space-y-3">
            {CLIENT.carePlan.map(c => (
              <div key={c.id} className="flex items-start gap-3 rounded-2xl bg-[#151011] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#2a151a] text-[#f1889e]">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black">{c.category}</p>
                  <p className="text-xs text-[#b8a8a4]">{c.instruction}</p>
                  <p className="mt-1 text-xs font-bold text-[#dca669]">{c.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Wash day log */}
      <Panel
        title="Wash Day Log"
        onViewAll={() => openModal({ title: "Log a Wash Day", content: <WashDayForm /> })}
      >
        <div className="mb-4 space-y-3">
          {CLIENT.washDays.map(w => (
            <div key={w.id} className="rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
                <p className="flex items-center gap-1.5 text-sm font-black">
                  <Clock className="h-4 w-4 text-[#f1889e]" />{w.date}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${w.scalpCondition === "Good" ? "bg-[#122418] text-emerald-400" : "bg-[#2d2210] text-[#dca669]"}`}>
                    {w.scalpCondition} scalp
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${w.buildupLevel === "None" ? "bg-[#122418] text-emerald-400" : "bg-[#2d2210] text-[#dca669]"}`}>
                    {w.buildupLevel} buildup
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#b8a8a4]">{w.shampoo} · {w.conditioner}</p>
              {w.notes && <p className="mt-1 text-xs italic text-[#76676a]">"{w.notes}"</p>}
            </div>
          ))}
        </div>
        <button
          onClick={() => openModal({ title: "Log a Wash Day", content: <WashDayForm /> })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] py-3 font-black text-[#17090d]"
        >
          <Droplets className="h-4 w-4" /> Log today's wash day
        </button>
      </Panel>

      {/* Progress photos */}
      <Panel title="Progress Photos" action={false}>
        <PhotoSection />
      </Panel>

      {/* Products */}
      <Panel title="Product Tracker" action={false}>
        <div className="space-y-3">
          {CLIENT.products.map(p => (
            <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-[#ff8fab33] bg-[#151011] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#2a151a] text-[#f1889e]">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-black">{p.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    p.status === "recommended" ? "bg-[#122418] text-emerald-400"
                    : p.status === "avoid"     ? "bg-[#3d1419] text-rose-400"
                    :                            "bg-[#2a151a] text-[#b8a8a4]"
                  }`}>{p.status}</span>
                </div>
                <p className="text-xs text-[#b8a8a4]">{p.category} · {p.frequency}</p>
                <p className="mt-0.5 text-xs text-[#76676a]">{p.result}</p>
                {p.notes && <p className="mt-0.5 text-xs italic text-[#76676a]">{p.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import {
  Bell, Crown, Home, LineChart, Plus, Search,
  Sparkles, Users, X, CalendarDays, Camera,
  FileText, PackageCheck, Share2, ClipboardList,
  UserRound, Droplets,
} from "lucide-react";
import { View, ModalState, ModalOpener } from "@/lib/types";

// ── View-aware Add Record options ─────────────────────────────────────────────
function AddRecordOptions({ view }: { view: View }) {
  const allOptions = {
    mentor: [
      ["Mentee", Users] as const,
      ["Coaching Session", ClipboardList] as const,
      ["Client", UserRound] as const,
      ["Appointment", CalendarDays] as const,
    ],
    mentee: [
      ["Client", UserRound] as const,
      ["Appointment", CalendarDays] as const,
      ["Wash Day", Droplets] as const,
      ["Progress Photo", Camera] as const,
      ["Care Note", FileText] as const,
      ["Product Entry", PackageCheck] as const,
    ],
    client: [
      ["Wash Day", Droplets] as const,
      ["Progress Photo", Camera] as const,
    ],
    admin: [
      ["Mentor", Crown] as const,
      ["Mentee", Users] as const,
      ["Client", UserRound] as const,
    ],
  };

  const options = allOptions[view] ?? allOptions.mentor;

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {options.map(([label, Icon]) => (
        <button
          key={label}
          className="rounded-2xl border border-[#ff8fab33] bg-[#171112] p-4 text-left transition hover:bg-[#2a151a]"
        >
          <Icon className="mb-3 h-5 w-5 text-[#f1889e]" />
          <p className="text-sm font-black text-[#f3b4c1]">{label}</p>
          <p className="mt-1 text-xs text-[#b8a8a4]">Tap to create</p>
        </button>
      ))}
    </div>
  );
}

// ── App Modal ─────────────────────────────────────────────────────────────────
export function AppModal({
  modal,
  close,
  view,
}: {
  modal: ModalState;
  close: () => void;
  view: View;
}) {
  if (!modal) return null;

  // Determine if this is an "add record" modal (no content provided)
  const isAddRecord = !modal.content;

  const sizeClass =
    modal.size === "sm" ? "max-w-xl"
    : modal.size === "lg" ? "max-w-5xl"
    : "max-w-3xl";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start overflow-y-auto bg-black/70 p-4 backdrop-blur-sm pt-[8vh]"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className={`mx-auto w-full ${sizeClass} rounded-[2rem] border border-[#ffb7c42e] bg-[#111010] p-6 shadow-[0_30px_100px_rgba(0,0,0,.75)]`}>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-[#2a151a] px-3 py-1 text-xs font-black uppercase tracking-[.2em] text-[#f1889e]">
              {isAddRecord ? "Add" : "Details"}
            </p>
            <h2 className="text-3xl font-black">{modal.title}</h2>
            {modal.subtitle && (
              <p className="mt-2 text-sm leading-6 text-[#b8a8a4]">{modal.subtitle}</p>
            )}
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 rounded-full border border-[#ff8fab33] bg-[#171112] p-3 transition hover:bg-[#2a151a]"
          >
            <X className="h-5 w-5 text-[#f1889e]" />
          </button>
        </div>

        {/* Body */}
        {isAddRecord ? <AddRecordOptions view={view} /> : modal.content}

        {/* Footer close */}
        <button
          onClick={close}
          className="mt-6 w-full rounded-2xl border border-[#ff8fab33] bg-[#171112] py-3 text-sm font-black text-[#f3b4c1] transition hover:bg-[#2a151a]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Shell nav ─────────────────────────────────────────────────────────────────
export function Shell({
  view,
  setView,
  children,
  openModal,
}: {
  view: View;
  setView: (v: View) => void;
  children: ReactNode;
  openModal: ModalOpener;
}) {
  const nav = [
    ["mentor", "Mentor", Home],
    ["mentee", "Mentee", Users],
    ["client", "Client", Sparkles],
    ["admin", "Admin", LineChart],
  ] as const;

  return (
    <main className="min-h-screen bg-[#070708] text-[#fff7f4]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-[#ffb7c42e] bg-black/50 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-10">
          <div className="font-serif text-3xl italic tracking-wide text-[#f7a0af]">Hair Journey</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.35em] text-[#dca669]">Mentor HQ</div>
        </div>

        <nav className="flex-1 space-y-2">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                view === id
                  ? "bg-gradient-to-r from-[#f1889e] to-[#dca669] text-[#17090d] shadow-[0_0_30px_rgba(230,111,142,.24)]"
                  : "text-[#f3b4c1] hover:bg-[#251319] hover:text-[#ffd6de]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label} View
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-[#151011] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#e66f8e] to-[#dca669] text-sm font-black text-[#17090d]">SB</div>
            <div>
              <p className="font-bold">Steph B.</p>
              <p className="text-xs text-[#b8a8a4]">Mentor account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070708]/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            {/* Mobile tabs */}
            <div className="flex gap-1.5 lg:hidden">
              {nav.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                    view === id ? "bg-[#f1889e] text-[#17090d]" : "bg-[#171112] text-[#f3b4c1]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative hidden w-full max-w-md md:block">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#b8a8a4]" />
              <input
                className="w-full rounded-2xl border border-white/10 bg-[#171112] py-3 pl-11 pr-4 text-sm text-[#fff7f4] outline-none placeholder:text-[#76676a]"
                placeholder="Search mentees, clients, appointments…"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => openModal({ title: "Add Record", content: null })}
                className="rounded-2xl bg-gradient-to-r from-[#f1889e] to-[#dca669] px-4 py-2 text-sm font-black text-[#17090d] shadow-[0_0_30px_rgba(230,111,142,.3)]"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Add Record
              </button>
              <button className="relative rounded-full border border-[#ff8fab33] bg-[#171112] p-3">
                <Bell className="h-4 w-4 text-[#f3b4c1]" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f1889e] text-xs font-bold text-[#17090d]">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">{children}</div>
      </section>
    </main>
  );
}

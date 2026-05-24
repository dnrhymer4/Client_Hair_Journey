"use client";

import { useState } from "react";
import { CalendarDays, Camera, Droplets, PackageCheck, Plus, Search, Sparkles, UserRound } from "lucide-react";

const demoClients = [
  {
    id: "1",
    name: "Ariana Miles",
    locStartDate: "2024-09-14",
    phase: "Teen Locs",
    method: "Two-strand twists",
    nextAppointment: "Jun 28",
    nextWashDay: "Jun 19",
    scalpStatus: "Healthy / mild dryness",
  },
  {
    id: "2",
    name: "Brielle Carter",
    locStartDate: "2025-02-03",
    phase: "Starter Locs",
    method: "Comb coils",
    nextAppointment: "Jul 2",
    nextWashDay: "Jun 22",
    scalpStatus: "Flaking noted",
  },
];

const appointments = [
  {
    date: "Jun 7, 2026",
    service: "Retwist + barrel style",
    products: "Rosewater mist, lightweight oil, loc gel",
    notes: "Good moisture retention. Client wants less tension around edges.",
  },
  {
    date: "May 10, 2026",
    service: "Wash + retwist",
    products: "Clarifying shampoo, aloe leave-in",
    notes: "Minor buildup near crown. Recommended satin bonnet nightly.",
  },
];

const washDays = [
  {
    date: "Jun 15",
    shampoo: "Moisturizing shampoo",
    products: "Rosewater + jojoba oil",
    scalp: "Mild dryness",
  },
  {
    date: "Jun 1",
    shampoo: "Clarifying shampoo",
    products: "Aloe leave-in",
    scalp: "Clean, no flakes",
  },
];

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3">
        <Icon className="h-5 w-5 text-slate-800" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default function ClientJourneyPage() {
  const [selectedClient, setSelectedClient] = useState(demoClients[0]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">Client Portal</p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">Client hair journey</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Track each client’s loc history, appointments, wash days, products, photos, and care recommendations.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
            <Plus className="mr-2 h-4 w-4" /> Add client entry
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Clients</h2>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input className="w-full rounded-2xl border border-slate-200 px-9 py-2.5 text-sm outline-none" placeholder="Search clients" />
            </div>
            <div className="mt-4 space-y-3">
              {demoClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedClient.id === client.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold">{client.name}</p>
                  <p className={`mt-1 text-sm ${selectedClient.id === client.id ? "text-slate-300" : "text-slate-500"}`}>
                    {client.phase} · {client.method}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-300">Client profile</p>
                <h2 className="mt-1 text-3xl font-bold">{selectedClient.name}</h2>
                <p className="mt-2 text-slate-300">Started: {selectedClient.locStartDate}</p>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-4">
                <Stat icon={UserRound} label="Loc method" value={selectedClient.method} />
                <Stat icon={CalendarDays} label="Next appointment" value={selectedClient.nextAppointment} />
                <Stat icon={Droplets} label="Next wash day" value={selectedClient.nextWashDay} />
                <Stat icon={Sparkles} label="Scalp status" value={selectedClient.scalpStatus} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Appointment history</h2>
                <div className="mt-4 space-y-3">
                  {appointments.map((a) => (
                    <div key={a.date} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold">{a.service}</p>
                        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{a.date}</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Products: {a.products}</p>
                      <p className="mt-1 text-sm text-slate-600">{a.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Wash day log</h2>
                <div className="mt-4 space-y-3">
                  {washDays.map((w) => (
                    <div key={w.date} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-bold">{w.date}</p>
                      <p className="mt-2 text-sm text-slate-500">Shampoo: {w.shampoo}</p>
                      <p className="text-sm text-slate-500">Products: {w.products}</p>
                      <p className="mt-2 text-sm font-semibold">Scalp: {w.scalp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Progress photos</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {["Starter locs", "Budding phase", "Current progress"].map((label) => (
                  <div key={label} className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100">
                    <div className="text-center text-slate-500">
                      <Camera className="mx-auto mb-2 h-8 w-8" />
                      <p className="text-sm font-semibold">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Product tracker</h2>
              <div className="mt-4 grid gap-3">
                {[
                  ["Rosewater mist", "Hydration", "Use 3x weekly", "Works well"],
                  ["Jojoba oil", "Sealant", "Use after misting", "No irritation"],
                  ["Heavy beeswax gel", "Styling", "Avoid", "Buildup risk"],
                ].map(([name, type, cadence, result]) => (
                  <div key={name} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-4">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm text-slate-500">{type}</p>
                    <p className="text-sm text-slate-500">{cadence}</p>
                    <p className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

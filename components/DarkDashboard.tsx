"use client";

import { useState } from "react";
import { Role, View, ModalState, ModalOpener } from "@/lib/types";
import { Sidebar } from "@/components/ui/Sidebar";
import { AppModal } from "@/components/ui/AppModal";
import BusinessDashboard from "@/components/views/BusinessDashboard";
import MentorshipView from "@/components/views/MentorshipView";
import ClientPortal from "@/components/views/ClientPortal";
import AnalyticsView from "@/components/views/AnalyticsView";

// Role switcher — dev tool shown at top until auth is wired
function RoleSwitcher({ role, setRole, setView }: { role: Role; setRole: (r: Role) => void; setView: (v: View) => void }) {
  const roles: Role[] = ["mentor", "mentee", "client", "admin"];
  return (
    <div className="flex items-center gap-1 border-b border-white/[0.06] bg-[#0a0809] px-5 py-2">
      <span className="mr-2 text-[10px] font-black uppercase tracking-widest text-[#3a2530]">Preview as:</span>
      {roles.map(r => (
        <button key={r} onClick={() => { setRole(r); setView(r === "client" ? "client-portal" : "dashboard"); }}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${role === r ? "bg-[#c4687a] text-white" : "text-[#6b5a63] hover:text-[#a09099]"}`}>
          {r}
        </button>
      ))}
    </div>
  );
}

export default function DarkDashboard({ initialView = "dashboard" }: { initialView?: View }) {
  const [role, setRole] = useState<Role>("mentor");
  const [view, setView] = useState<View>(initialView);
  const [modal, setModal] = useState<ModalState>(null);

  const openModal: ModalOpener = (m) => setModal(m);

  function renderView() {
    if (view === "client-portal" || role === "client") return <ClientPortal openModal={openModal} />;
    if (view === "mentorship") return <MentorshipView openModal={openModal} />;
    if (view === "analytics" || role === "admin") return <AnalyticsView openModal={openModal} />;
    return <BusinessDashboard openModal={openModal} role={role === "mentor" ? "mentor" : "mentee"} />;
  }

  return (
    <div className="min-h-screen bg-[#0d0b0c] text-[#f0d0d8]">
      <RoleSwitcher role={role} setRole={setRole} setView={setView} />
      <div className="flex">
        <Sidebar view={view} setView={setView} role={role} />
        <main className="min-h-screen flex-1 pl-[230px]">
          {renderView()}
        </main>
      </div>
      <AppModal modal={modal} close={() => setModal(null)} />
    </div>
  );
}

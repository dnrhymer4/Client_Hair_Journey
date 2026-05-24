"use client";

import {
  BarChart3, CalendarDays, Crown, LayoutDashboard,
  Settings, Sparkles, Users, ChevronDown,
} from "lucide-react";
import { Role, View } from "@/lib/types";

type NavItem = { id: View; label: string; icon: React.ElementType; badge?: number };

const NAV_MENTOR: NavItem[] = [
  { id: "dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { id: "clients",      label: "Clients",      icon: Users           },
  { id: "appointments", label: "Appointments", icon: CalendarDays    },
  { id: "mentorship",   label: "Mentorship",   icon: Crown           },
  { id: "analytics",    label: "Analytics",    icon: BarChart3       },
  { id: "settings",     label: "Settings",     icon: Settings        },
];

const NAV_CLIENT: NavItem[] = [
  { id: "client-portal", label: "My Journey",   icon: Sparkles     },
  { id: "appointments",  label: "Appointments", icon: CalendarDays  },
  { id: "settings",      label: "Settings",     icon: Settings      },
];

export function Sidebar({ view, setView, role }: { view: View; setView: (v: View) => void; role: Role }) {
  const nav = role === "client" ? NAV_CLIENT : NAV_MENTOR;
  const names: Record<Role, string> = { mentor: "Steph B.", mentee: "Kia Johnson", client: "Layla M.", admin: "Admin" };
  const roleLabel: Record<Role, string> = { mentor: "Mentor", mentee: "Mentee", client: "Client", admin: "Admin" };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[230px] flex-col border-r border-white/[0.06] bg-[#0d0b0c]">
      <div className="px-5 pb-6 pt-7">
        <div className="font-serif text-2xl italic leading-none tracking-wide text-[#e8a0b0]">Hair Journey</div>
        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#dca669]">Mentor HQ</div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
              view === id
                ? "bg-[#c4687a] text-white shadow-[0_4px_20px_rgba(196,104,122,.35)]"
                : "text-[#a09099] hover:bg-white/[0.05] hover:text-[#f0d0d8]"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${view === id ? "text-white" : "text-[#7a6070]"}`} />
            {label}
            {badge != null && (
              <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-[#c4687a] text-[10px] font-black text-white">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mx-3 mb-4 mt-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c4687a] to-[#dca669] text-xs font-black text-white">
            {names[role].split(" ").map(n => n[0]).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#f0d0d8]">{names[role]}</p>
            <p className="text-xs text-[#7a6070]">{roleLabel[role]}</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-[#7a6070]" />
        </div>
      </div>
    </aside>
  );
}

"use client";

import { X } from "lucide-react";
import { ModalState } from "@/lib/types";

export function AppModal({ modal, close }: { modal: ModalState; close: () => void }) {
  if (!modal) return null;
  const sizeClass = modal.size === "sm" ? "max-w-lg" : modal.size === "lg" ? "max-w-4xl" : "max-w-2xl";
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-[8vh] backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className={`w-full ${sizeClass} rounded-2xl border border-white/[0.06] bg-[#131013] p-5 shadow-[0_30px_80px_rgba(0,0,0,.7)]`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">{modal.title}</h2>
            {modal.subtitle && <p className="mt-1 text-sm text-[#6b5a63]">{modal.subtitle}</p>}
          </div>
          <button onClick={close} className="rounded-xl border border-white/[0.06] bg-[#0d0b0c] p-2 hover:bg-white/[0.05]">
            <X className="h-4 w-4 text-[#a09099]" />
          </button>
        </div>
        {modal.content}
        <button onClick={close} className="mt-5 w-full rounded-xl border border-white/[0.06] bg-[#0d0b0c] py-2.5 text-sm font-black text-[#a09099] hover:bg-white/[0.03]">
          Close
        </button>
      </div>
    </div>
  );
}

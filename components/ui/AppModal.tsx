"use client";
import { X } from "lucide-react";
import { ModalState } from "@/lib/types";

export function AppModal({ modal, close }: { modal:ModalState; close:()=>void }) {
  if (!modal) return null;
  const maxW = modal.size==="sm"?"480px":modal.size==="lg"?"900px":"680px";
  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) close(); }} style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"8vh", paddingLeft:16, paddingRight:16, background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)", overflowY:"auto" }}>
      <div style={{ width:"100%", maxWidth:maxW, background:"#161113", border:"1px solid rgba(255,255,255,.08)", borderRadius:18, padding:20, boxShadow:"0 30px 80px rgba(0,0,0,.7)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:18 }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#f2e8ea", margin:0 }}>{modal.title}</h2>
            {modal.subtitle && <p style={{ fontSize:13, color:"#6e5a66", marginTop:4 }}>{modal.subtitle}</p>}
          </div>
          <button onClick={close} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:9, padding:8, cursor:"pointer", color:"#9a8690", display:"flex", flexShrink:0 }}>
            <X size={15} />
          </button>
        </div>
        {modal.content}
        <button onClick={close} style={{ marginTop:18, width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:"9px 0", fontSize:12, fontWeight:700, color:"#9a8690", cursor:"pointer" }}>
          Close
        </button>
      </div>
    </div>
  );
}

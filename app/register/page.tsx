"use client";
import { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabaseClient";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.08)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:"11px 14px", fontSize:14, color:"#f2e8ea", outline:"none", marginTop:6 };
const label: CSSProperties = { fontSize:12, fontWeight:600, color:"#9a8690" };

function Field({ name, label: lbl, type="text", placeholder, value, onChange, required }:
  { name:string; label:string; type?:string; placeholder?:string; value:string; onChange:(v:string)=>void; required?:boolean }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={label}>{lbl}{required&&<span style={{ color:C.accent }}> *</span>}</label>
      <input type={type} name={name} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required} style={inp} />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, profile, role, refreshProfile } = useAuth();

  const [form, setForm] = useState({
    full_name:     profile?.full_name     ?? "",
    phone:         profile?.phone         ?? "",
    city:          profile?.city          ?? "",
    state:         profile?.state         ?? "",
    business_name: profile?.business_name ?? "",
    niche:         profile?.niche         ?? "",
    booking_url:   profile?.booking_url   ?? "",
    instagram:     profile?.instagram     ?? "",
    hair_texture:  profile?.hair_texture  ?? "",
    loc_goals:     profile?.loc_goals     ?? "",
  });
  const up = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const isMentorMentee = role === "mentor" || role === "mentee";
  const isClient       = role === "client";
  const isAdmin        = role === "admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) { setError("Full name is required."); return; }
    setSaving(true);
    setError("");

    const { error: err } = await supabase
      .from("profiles")
      .update({ ...form, profile_complete: true, updated_at: new Date().toISOString() })
      .eq("id", user!.id);

    if (err) { setError(err.message); setSaving(false); return; }
    await refreshProfile();
    router.push("/");
  }

  const brandTitle = isMentorMentee ? "Mentor HQ" : isAdmin ? "Admin" : "Hair Journey";

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:560 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:28, color:"#e8a0b0" }}>Hair Journey</div>
          {isMentorMentee && <div style={{ fontSize:9, fontWeight:800, letterSpacing:".25em", color:C.gold, marginTop:3, textTransform:"uppercase" }}>Mentor HQ</div>}
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
          <h1 style={{ fontSize:20, fontWeight:800, margin:"0 0 4px" }}>Complete your profile</h1>
          <p style={{ fontSize:13, color:C.dim, margin:"0 0 24px" }}>
            {isMentorMentee ? "Tell us about you and your business." : isClient ? "A little about your hair journey." : "Fill in your details to get started."}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Everyone */}
            <div style={{ marginBottom:8, fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:".06em" }}>Basic Info</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              <Field name="full_name" label="Full name" value={form.full_name} onChange={up("full_name")} required placeholder="Jane Smith" />
              <Field name="phone" label="Phone" type="tel" value={form.phone} onChange={up("phone")} placeholder="(404) 555-0100" />
              <Field name="city" label="City" value={form.city} onChange={up("city")} placeholder="Atlanta" />
              <Field name="state" label="State" value={form.state} onChange={up("state")} placeholder="GA" />
            </div>

            {/* Mentor / Mentee */}
            {isMentorMentee && (
              <>
                <div style={{ margin:"16px 0 8px", fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:".06em" }}>Business Info</div>
                <Field name="business_name" label="Business name" value={form.business_name} onChange={up("business_name")} required placeholder="Locs by Steph B." />
                <Field name="niche" label="Niche / speciality" value={form.niche} onChange={up("niche")} placeholder="Locs + protective styles" />
                <Field name="booking_url" label="Booking platform URL" value={form.booking_url} onChange={up("booking_url")} placeholder="glossgenius.com/yourbusiness" />
                <Field name="instagram" label="Instagram handle" value={form.instagram} onChange={up("instagram")} placeholder="@yourbusiness" />
              </>
            )}

            {/* Client */}
            {isClient && (
              <>
                <div style={{ margin:"16px 0 8px", fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:".06em" }}>Hair Journey</div>
                <Field name="hair_texture" label="Hair texture" value={form.hair_texture} onChange={up("hair_texture")} placeholder="4C Coily" />
                <div style={{ marginBottom:14 }}>
                  <label style={label}>Loc goals</label>
                  <textarea value={form.loc_goals} onChange={e=>up("loc_goals")(e.target.value)} placeholder="What are you hoping to achieve on your hair journey?" rows={3} style={{ ...inp, resize:"none" as const }} />
                </div>
              </>
            )}

            {error && <div style={{ background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.25)", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16 }}>{error}</div>}

            <button type="submit" disabled={saving} style={{ width:"100%", background:saving?"rgba(196,104,122,.5)":C.accent, border:"none", borderRadius:10, padding:"12px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:saving?"not-allowed":"pointer", marginTop:8 }}>
              {saving ? "Saving…" : "Save & continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

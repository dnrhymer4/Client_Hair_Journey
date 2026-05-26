"use client";
import { useEffect, useState, CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const C = { bg:"#0c0a0b", card:"#161113", border:"rgba(255,255,255,.08)", accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea", muted:"#9a8690", dim:"#6e5a66" };
const inp: CSSProperties = { width:"100%", background:"#0c0a0b", border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:"11px 14px", fontSize:14, color:"#f2e8ea", outline:"none", marginTop:6 };
const fieldLabel: CSSProperties = { fontSize:12, fontWeight:600, color:"#9a8690" };

interface Invite { id:string; invited_by:string; email:string|null; expires_at:string; used_at:string|null }

export default function JoinContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get("token");

  const [invite, setInvite] = useState<Invite|null>(null);
  const [status, setStatus] = useState<"loading"|"valid"|"invalid"|"done">("loading");
  const [form, setForm] = useState({ full_name:"", email:"", password:"", confirm:"", phone:"", hair_texture:"", loc_goals:"" });
  const up = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    supabase.from("client_invites").select("*").eq("token", token).single()
      .then(({ data, error }) => {
        if (error || !data) { setStatus("invalid"); return; }
        if (data.used_at)   { setStatus("invalid"); return; }
        if (new Date(data.expires_at) < new Date()) { setStatus("invalid"); return; }
        setInvite(data as Invite);
        if (data.email) setForm(p=>({...p, email: data.email ?? ""}));
        setStatus("valid");
      });
  }, [token]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8)       { setError("Password must be at least 8 characters."); return; }
    setSaving(true); setError("");

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });

    if (authErr || !authData.user) { setError(authErr?.message ?? "Sign-up failed."); setSaving(false); return; }

    await supabase.from("profiles").update({
      full_name: form.full_name, phone: form.phone, hair_texture: form.hair_texture,
      loc_goals: form.loc_goals, invited_by: invite?.invited_by ?? null,
      role: "client", profile_complete: true,
    }).eq("id", authData.user.id);

    await supabase.from("client_invites").update({ used_at: new Date().toISOString() }).eq("token", token!);
    setStatus("done");
    setTimeout(() => router.push("/"), 2000);
  }

  if (status === "loading") return <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:C.dim, fontSize:13, fontFamily:"system-ui" }}>Checking invite…</p></div>;

  if (status === "invalid") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:26, color:"#e8a0b0", marginBottom:12 }}>Hair Journey</div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🔗</div>
          <p style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Invalid or expired link</p>
          <p style={{ fontSize:13, color:C.dim }}>This invite link has already been used or has expired. Ask your stylist to send a new one.</p>
        </div>
      </div>
    </div>
  );

  if (status === "done") return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>✓</div>
        <p style={{ fontSize:16, fontWeight:700, color:C.text }}>Account created! Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 20px", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ width:"100%", maxWidth:520 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:26, color:"#e8a0b0" }}>Hair Journey</div>
          <div style={{ fontSize:12, color:C.dim, marginTop:6 }}>You've been invited to join your stylist's client portal</div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:28 }}>
          <h1 style={{ fontSize:20, fontWeight:800, margin:"0 0 4px" }}>Create your account</h1>
          <p style={{ fontSize:13, color:C.dim, margin:"0 0 24px" }}>Track your hair journey, view your care plan, and stay connected with your stylist.</p>
          <form onSubmit={handleSignUp}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              <div style={{ marginBottom:14, gridColumn:"1/-1" }}>
                <label style={fieldLabel}>Full name <span style={{ color:C.accent }}>*</span></label>
                <input type="text" value={form.full_name} onChange={up("full_name")} required placeholder="Jane Smith" style={inp} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={fieldLabel}>Email <span style={{ color:C.accent }}>*</span></label>
                <input type="email" value={form.email} onChange={up("email")} required placeholder="you@example.com" style={{ ...inp, opacity: !!invite?.email ? 0.7 : 1 }} readOnly={!!invite?.email} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={fieldLabel}>Phone</label>
                <input type="tel" value={form.phone} onChange={up("phone")} placeholder="(404) 555-0100" style={inp} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={fieldLabel}>Password <span style={{ color:C.accent }}>*</span></label>
                <input type="password" value={form.password} onChange={up("password")} required placeholder="At least 8 characters" style={inp} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={fieldLabel}>Confirm password <span style={{ color:C.accent }}>*</span></label>
                <input type="password" value={form.confirm} onChange={up("confirm")} required placeholder="Re-enter password" style={inp} />
              </div>
            </div>
            <div style={{ margin:"4px 0 14px", fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase" as const, letterSpacing:".06em" }}>Hair journey info (optional)</div>
            <div style={{ marginBottom:14 }}>
              <label style={fieldLabel}>Hair texture</label>
              <input value={form.hair_texture} onChange={up("hair_texture")} placeholder="e.g. 4C Coily" style={inp} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={fieldLabel}>Loc / hair goals</label>
              <textarea value={form.loc_goals} onChange={up("loc_goals")} placeholder="What are you hoping to achieve on your hair journey?" rows={3} style={{ ...inp, resize:"none" as const }} />
            </div>
            {error && <div style={{ background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.25)", borderRadius:9, padding:"10px 14px", fontSize:13, color:"#f87171", marginBottom:16 }}>{error}</div>}
            <button type="submit" disabled={saving} style={{ width:"100%", background:saving?"rgba(196,104,122,.5)":C.accent, border:"none", borderRadius:10, padding:"12px 0", fontSize:14, fontWeight:700, color:"#fff", cursor:saving?"not-allowed":"pointer" }}>
              {saving ? "Creating account…" : "Create account & join"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

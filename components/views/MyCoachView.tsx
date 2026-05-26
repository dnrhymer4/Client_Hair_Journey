"use client";
import { useState, CSSProperties } from "react";
import {
  CheckCircle2, Circle, Target, TrendingUp, BarChart2,
  CalendarDays, Award, ChevronDown, ChevronUp,
  Users, Eye, ExternalLink,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import { menteeKia, delta } from "@/lib/demoData";
import { ModalOpener } from "@/lib/types";

const ME = menteeKia;
const C = {
  card:"#161113", card2:"#1a1318", border:"rgba(255,255,255,.07)",
  accent:"#c4687a", gold:"#d4956a", text:"#f2e8ea",
  muted:"#9a8690", dim:"#6e5a66", success:"#34d399",
};

function PBar({ value, color=C.accent }:{ value:number; color?:string }) {
  return (
    <div style={{ height:6, background:"rgba(255,255,255,.07)", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:6, width:`${Math.min(100,value)}%`, background:color, borderRadius:3, transition:"width .5s ease" }}/>
    </div>
  );
}

// Weekly post counts for the bar chart (last 8 weeks, derived from weekly data)
const WEEKLY_POSTS = [
  { week:"Apr 6",  posts:2 }, { week:"Apr 13", posts:3 },
  { week:"Apr 20", posts:2 }, { week:"Apr 27", posts:4 },
  { week:"May 4",  posts:3 }, { week:"May 11", posts:4 },
  { week:"May 18", posts:5 }, { week:"May 24", posts:4 },
];

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#e4405f",
  Facebook:  "#1877f2",
  TikTok:    "#00f2ea",
  Booking:   C.gold,
};

// ── Social media analytics ────────────────────────────────────────────────────
function SocialAnalytics() {
  const viewsD = delta(ME.socialViews, ME.socialViewsPrev);
  const socials = ME.socials.filter(s => s.platform !== "Booking");
  const bookingSocial = ME.socials.find(s => s.platform === "Booking");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Total social views summary */}
      <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 16px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 4px" }}>Total Social Views</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontSize:28, fontWeight:900, lineHeight:1 }}>{(ME.socialViews / 1000).toFixed(1)}K</span>
              <span style={{ fontSize:12, fontWeight:700, color:viewsD.positive ? C.success : "#f87171" }}>
                {viewsD.positive ? "+" : "-"}{viewsD.pct}% vs last month
              </span>
            </div>
          </div>
          <div style={{ textAlign:"right" as const }}>
            <p style={{ fontSize:11, color:C.muted, margin:"0 0 2px" }}>Content score</p>
            <p style={{ fontSize:22, fontWeight:900, color:ME.contentScore >= 70 ? C.success : ME.contentScore >= 50 ? C.gold : C.accent, margin:0 }}>
              {ME.contentScore}<span style={{ fontSize:13, fontWeight:600, color:C.dim }}>/100</span>
            </p>
          </div>
        </div>

        {/* Posts per week bar chart */}
        <p style={{ fontSize:10, fontWeight:700, color:C.dim, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Posts per week</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={WEEKLY_POSTS} margin={{ top:0, right:0, left:0, bottom:0 }}>
            <Bar dataKey="posts" fill={C.accent} radius={[3,3,0,0]}/>
            <XAxis dataKey="week" tick={{ fill:"#6e5a66", fontSize:9 }} tickLine={false} axisLine={false}/>
            <Tooltip
              formatter={(v) => [v, "Posts"]}
              contentStyle={{ background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:11 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-platform cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {socials.map(s => {
          const color = PLATFORM_COLORS[s.platform] ?? C.accent;
          const follD = s.followersPrev > 0 ? delta(s.followers, s.followersPrev) : null;
          return (
            <div key={s.platform} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:14 }}>
              {/* Platform header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Users size={15} style={{ color }}/>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{s.platform}</p>
                    <p style={{ fontSize:11, color:C.accent, margin:0 }}>{s.handle}</p>
                  </div>
                </div>
                <a href={`https://${s.url}`} target="_blank" rel="noreferrer" style={{ color:C.dim, display:"flex" }}>
                  <ExternalLink size={13}/>
                </a>
              </div>

              {/* Metrics */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                <div style={{ background:"#0c0a0b", borderRadius:9, padding:"8px 10px" }}>
                  <p style={{ fontSize:16, fontWeight:900, lineHeight:1, margin:"0 0 2px" }}>
                    {s.followers >= 1000 ? `${(s.followers/1000).toFixed(1)}K` : s.followers}
                  </p>
                  <p style={{ fontSize:9, color:C.dim, margin:0, textTransform:"uppercase" as const }}>Followers</p>
                  {follD && (
                    <p style={{ fontSize:10, fontWeight:700, color:follD.positive ? C.success : "#f87171", margin:"3px 0 0" }}>
                      {follD.positive ? "+" : "-"}{follD.pct}%
                    </p>
                  )}
                </div>
                <div style={{ background:"#0c0a0b", borderRadius:9, padding:"8px 10px" }}>
                  <p style={{ fontSize:16, fontWeight:900, lineHeight:1, margin:"0 0 2px" }}>
                    {s.views}
                  </p>
                  <p style={{ fontSize:9, color:C.dim, margin:0, textTransform:"uppercase" as const }}>Views</p>
                  <p style={{ fontSize:10, color:C.muted, margin:"3px 0 0" }}>{s.posts} posts</p>
                </div>
              </div>

              {/* Follower growth bar */}
              {follD && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.dim, marginBottom:4 }}>
                    <span>Follower growth</span>
                    <span style={{ color:follD.positive ? C.success : "#f87171", fontWeight:700 }}>
                      +{s.followers - s.followersPrev} new
                    </span>
                  </div>
                  <PBar value={Math.min(100, ((s.followers - s.followersPrev) / s.followersPrev) * 100 * 5)} color={color}/>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Booking platform views */}
      {bookingSocial && (
        <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${C.gold}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <CalendarDays size={15} style={{ color:C.gold }}/>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, margin:0 }}>{bookingSocial.platform}</p>
                <p style={{ fontSize:11, color:C.dim, margin:0 }}>{bookingSocial.handle}</p>
              </div>
            </div>
            <div style={{ textAlign:"right" as const }}>
              <p style={{ fontSize:20, fontWeight:900, color:C.gold, margin:0 }}>{bookingSocial.views}</p>
              <p style={{ fontSize:10, color:C.dim, margin:0 }}>profile visits</p>
            </div>
          </div>
        </div>
      )}

      {/* Content consistency coaching tip */}
      <div style={{ background:`${C.accent}08`, border:`1px solid ${C.accent}20`, borderRadius:14, padding:"14px 16px" }}>
        <p style={{ fontSize:11, fontWeight:700, color:C.accent, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 8px" }}>
          Mentor Insight
        </p>
        {ME.contentScore < 50 ? (
          <p style={{ fontSize:12, color:C.muted, margin:0, lineHeight:1.6 }}>
            Your content score is <strong style={{ color:C.accent }}>{ME.contentScore}/100</strong>. Posting consistency is the #1 driver of organic client growth. Aim for <strong style={{ color:C.text }}>3 posts/week</strong> minimum — even simple before/afters count.
          </p>
        ) : ME.contentScore < 75 ? (
          <p style={{ fontSize:12, color:C.muted, margin:0, lineHeight:1.6 }}>
            Good momentum at <strong style={{ color:C.gold }}>{ME.contentScore}/100</strong>. Your last reel hit{" "}
            <strong style={{ color:C.text }}>4.2K views</strong> — double down on transformation reels and client spotlights for the highest reach.
          </p>
        ) : (
          <p style={{ fontSize:12, color:C.muted, margin:0, lineHeight:1.6 }}>
            Strong content game at <strong style={{ color:C.success }}>{ME.contentScore}/100</strong>! Focus now on converting viewers to bookings — add your booking link in every caption and bio.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Business progress panel ───────────────────────────────────────────────────
function BusinessProgress() {
  const revD = delta(ME.revenue, ME.revenuePrev);
  const goalPct = Math.round((ME.revenue / ME.goal) * 100);
  const [showSocial, setShowSocial] = useState(true);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Revenue sparkline card */}
      <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 16px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 4px" }}>Revenue Progress</p>
            <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
              <span style={{ fontSize:28, fontWeight:900, lineHeight:1 }}>${ME.revenue.toLocaleString()}</span>
              <span style={{ fontSize:12, fontWeight:700, color:revD.positive ? C.success : "#f87171" }}>{revD.positive ? "+" : "-"}{revD.pct}% vs last month</span>
            </div>
          </div>
          <div style={{ textAlign:"right" as const }}>
            <p style={{ fontSize:11, color:C.muted, margin:"0 0 2px" }}>Monthly goal</p>
            <p style={{ fontSize:14, fontWeight:800, color:C.gold, margin:0 }}>${ME.goal.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.muted, marginBottom:6 }}>
          <span>{goalPct}% of goal reached</span>
          <span style={{ color:goalPct>=100?C.success:goalPct>=75?C.gold:C.accent, fontWeight:700 }}>${(ME.goal - ME.revenue).toLocaleString()} to go</span>
        </div>
        <PBar value={goalPct} color={goalPct>=100?C.success:`linear-gradient(90deg,${C.accent},${C.gold})`}/>
        <ResponsiveContainer width="100%" height={52} style={{ marginTop:12 }}>
          <AreaChart data={ME.weeklyData} margin={{ top:2, right:0, left:0, bottom:0 }}>
            <defs>
              <linearGradient id="mcg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c4687a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#c4687a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="revenue" stroke="#c4687a" fill="url(#mcg)" strokeWidth={2} dot={false}/>
            <XAxis dataKey="week" tick={{ fill:"#6e5a66", fontSize:9 }} tickLine={false} axisLine={false}/>
            <Tooltip formatter={(v)=>[`$${Number(v).toLocaleString()}`,""]} contentStyle={{ background:"#161113", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, fontSize:11 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Business health metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {[
          { icon:BarChart2,    label:"Business Health", value:String(ME.businessHealth), sub:"/100",             color:ME.businessHealth>=75?C.success:ME.businessHealth>=50?C.gold:C.accent },
          { icon:TrendingUp,   label:"Content Score",   value:String(ME.contentScore),   sub:"/100",             color:ME.contentScore>=75?C.success:ME.contentScore>=50?C.gold:C.accent },
          { icon:CalendarDays, label:"Bookings",        value:String(ME.bookings),        sub:`prev ${ME.bookingsPrev}`, color:C.text },
        ].map(s=>(
          <div key={s.label} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
            <s.icon size={15} style={{ color:s.color, marginBottom:6 }}/>
            <p style={{ fontSize:20, fontWeight:900, color:s.color, lineHeight:1, margin:"0 0 2px" }}>{s.value}</p>
            <p style={{ fontSize:9, color:C.dim, margin:0, textTransform:"uppercase" as const, letterSpacing:".05em" }}>{s.sub}</p>
            <p style={{ fontSize:10, color:C.muted, margin:"4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Social media analytics — collapsible section */}
      <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <button
          onClick={() => setShowSocial(p => !p)}
          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", borderBottom: showSocial ? `1px solid ${C.border}` : "none" }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Eye size={15} style={{ color:C.accent }}/>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Social Media Analytics</span>
            <span style={{ fontSize:10, fontWeight:700, color:C.success, background:"rgba(52,211,153,.12)", padding:"2px 7px", borderRadius:20 }}>
              +{delta(ME.socialViews, ME.socialViewsPrev).pct}% views
            </span>
          </div>
          {showSocial ? <ChevronUp size={14} style={{ color:C.dim }}/> : <ChevronDown size={14} style={{ color:C.dim }}/>}
        </button>
        {showSocial && (
          <div style={{ padding:"0 16px 16px" }}>
            <SocialAnalytics/>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Goals panel ───────────────────────────────────────────────────────────────
function GoalsPanel() {
  const catColors:Record<string,string> = { revenue:C.accent, content:"#a78bfa", clients:C.success, pricing:C.gold };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {ME.goals.map(g=>{
        const color = catColors[g.category] ?? C.accent;
        return (
          <div key={g.id} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
              <div>
                <p style={{ fontSize:13, fontWeight:700, margin:"0 0 3px" }}>{g.title}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, color, background:`${color}15`, padding:"2px 7px", borderRadius:20, textTransform:"capitalize" as const }}>{g.category}</span>
                  <span style={{ fontSize:10, color:C.dim }}>Target: {g.targetDate}</span>
                </div>
              </div>
              <span style={{ fontSize:20, fontWeight:900, color, flexShrink:0 }}>{g.progress}%</span>
            </div>
            <PBar value={g.progress} color={`linear-gradient(90deg,${color},${color}88)`}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <span style={{ fontSize:10, color:C.dim }}>{g.progress < 100 ? `${100 - g.progress}% remaining` : "Completed! 🎉"}</span>
              {g.progress >= 75 && g.progress < 100 && <span style={{ fontSize:10, fontWeight:700, color:C.success }}>Almost there!</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tasks panel ───────────────────────────────────────────────────────────────
function TasksPanel() {
  const completed = ME.actionItems.filter(a=>a.status==="done");
  const pending   = ME.actionItems.filter(a=>a.status==="open");
  const [showDone, setShowDone] = useState(false);
  const priBg:Record<string,string> = { high:"rgba(248,113,113,.15)", medium:"rgba(212,149,106,.15)", low:"rgba(52,211,153,.1)" };
  const priFg:Record<string,string> = { high:"#f87171", medium:C.gold, low:C.success };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <p style={{ fontSize:13, fontWeight:700, margin:0 }}>To-Do</p>
          <span style={{ fontSize:11, fontWeight:700, color:C.accent, background:`${C.accent}15`, padding:"2px 8px", borderRadius:20 }}>{pending.length} remaining</span>
        </div>
        {pending.length === 0
          ? <div style={{ textAlign:"center" as const, padding:"16px 0", color:C.success }}><CheckCircle2 size={28} style={{ margin:"0 auto 8px" }}/><p style={{ fontSize:13, fontWeight:700, margin:0 }}>All tasks complete! 🎉</p></div>
          : pending.map(a=>(
            <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 0", borderBottom:`1px solid rgba(255,255,255,.04)` }}>
              <Circle size={15} style={{ color:C.dim, flexShrink:0, marginTop:2 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, margin:"0 0 3px" }}>{a.title}</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const }}>
                  <span style={{ fontSize:10, color:C.dim }}>Due {a.dueDate}</span>
                  <span style={{ fontSize:10, color:a.source==="mentor"?"#a78bfa":C.muted }}>{a.source==="mentor"?"From mentor":"Self-set"}</span>
                </div>
              </div>
              <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20, background:priBg[a.priority], color:priFg[a.priority], flexShrink:0 }}>{a.priority}</span>
            </div>
          ))
        }
      </div>
      {completed.length > 0 && (
        <div style={{ background:"rgba(52,211,153,.06)", border:"1px solid rgba(52,211,153,.15)", borderRadius:14, padding:"14px 16px" }}>
          <button onClick={()=>setShowDone(p=>!p)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:showDone?12:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <CheckCircle2 size={16} style={{ color:C.success }}/>
              <span style={{ fontSize:13, fontWeight:700, color:C.success }}>Completed ({completed.length})</span>
            </div>
            {showDone ? <ChevronUp size={14} style={{ color:C.success }}/> : <ChevronDown size={14} style={{ color:C.success }}/>}
          </button>
          {showDone && completed.map(a=>(
            <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:`1px solid rgba(52,211,153,.08)` }}>
              <CheckCircle2 size={15} style={{ color:C.success, flexShrink:0, marginTop:2 }}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:600, margin:"0 0 2px", textDecoration:"line-through", color:C.muted }}>{a.title}</p>
                <span style={{ fontSize:10, color:C.success }}>Completed · {a.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Coaching sessions panel ───────────────────────────────────────────────────
function SessionsPanel() {
  const upcoming  = ME.coachingSessions.filter(s=>s.status==="upcoming");
  const completed = ME.coachingSessions.filter(s=>s.status==="completed");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {upcoming.map(s=>(
        <div key={s.id} style={{ background:`${C.accent}10`, border:`1px solid ${C.accent}25`, borderRadius:14, padding:"14px 16px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:C.accent, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Upcoming Session</p>
          <p style={{ fontSize:15, fontWeight:800, margin:"0 0 2px" }}>{s.topic}</p>
          <p style={{ fontSize:11, color:C.dim, margin:"0 0 10px" }}>{s.date}</p>
          <div style={{ background:"rgba(255,255,255,.05)", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Come prepared with:</p>
            {["Your latest revenue and booking numbers","2–3 wins from this period","1–2 blockers you're facing","Questions you want feedback on"].map(i=>(
              <p key={i} style={{ fontSize:11, color:C.muted, margin:"0 0 3px", display:"flex", gap:6 }}>
                <span style={{ color:C.accent, flexShrink:0 }}>·</span>{i}
              </p>
            ))}
          </div>
        </div>
      ))}
      {completed.slice(0,2).map(s=>(
        <div key={s.id} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, margin:"0 0 2px" }}>{s.topic}</p>
              <p style={{ fontSize:10, color:C.dim, margin:0 }}>{s.date}</p>
            </div>
            <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20, background:"rgba(52,211,153,.12)", color:C.success, flexShrink:0 }}>completed</span>
          </div>
          {s.wins.length > 0 && (
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:C.success, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Your wins</p>
              {s.wins.map(w=>(
                <div key={w} style={{ display:"flex", gap:7, marginBottom:4 }}>
                  <Award size={12} style={{ color:C.gold, flexShrink:0, marginTop:1 }}/>
                  <span style={{ fontSize:11, color:C.muted }}>{w}</span>
                </div>
              ))}
            </div>
          )}
          {s.homework.length > 0 && (
            <div style={{ marginTop:8 }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.gold, textTransform:"uppercase" as const, letterSpacing:".07em", margin:"0 0 6px" }}>Homework assigned</p>
              {s.homework.map(h=>(
                <div key={h} style={{ display:"flex", gap:7, marginBottom:4 }}>
                  <span style={{ color:C.gold, fontSize:10, flexShrink:0, marginTop:1 }}>→</span>
                  <span style={{ fontSize:11, color:C.muted }}>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MyCoachView({ openModal }: { openModal: ModalOpener }) {
  const [section, setSection] = useState<"progress"|"tasks"|"goals"|"sessions">("progress");
  const tabs: { key: typeof section; label: string; icon: React.ElementType }[] = [
    { key:"progress", label:"Progress",  icon:TrendingUp   },
    { key:"tasks",    label:"Tasks",     icon:CheckCircle2  },
    { key:"goals",    label:"Goals",     icon:Target        },
    { key:"sessions", label:"Sessions",  icon:CalendarDays  },
  ];
  const completedCount = ME.actionItems.filter(a=>a.status==="done").length;
  const totalCount     = ME.actionItems.length;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", minHeight:0 }}>
      <div style={{ padding:"14px 20px 0", borderBottom:`1px solid rgba(255,255,255,.06)`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
          <div>
            <h1 style={{ fontSize:17, fontWeight:800, margin:"0 0 3px" }}>My Coach</h1>
            <p style={{ fontSize:11.5, color:C.dim, margin:0 }}>
              {ME.businessName} · Next session: {ME.coachingSessions.find(s=>s.status==="upcoming")?.date ?? "TBD"}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 12px", marginBottom:14 }}>
            <CheckCircle2 size={13} style={{ color:C.success }}/>
            <span style={{ fontSize:12, fontWeight:700 }}>{completedCount}/{totalCount} tasks done</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:2 }}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setSection(t.key)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:"9px 9px 0 0", border:`1px solid ${section===t.key?C.border:"transparent"}`, borderBottom:section===t.key?`1px solid ${C.card}`:"none", fontSize:12.5, fontWeight:600, cursor:"pointer", background:section===t.key?C.card:"transparent", color:section===t.key?C.text:C.dim, marginBottom:section===t.key?-1:0 }}>
              <t.icon size={13}/>{t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
        {section === "progress"  && <BusinessProgress/>}
        {section === "tasks"     && <TasksPanel/>}
        {section === "goals"     && <GoalsPanel/>}
        {section === "sessions"  && <SessionsPanel/>}
      </div>
    </div>
  );
}

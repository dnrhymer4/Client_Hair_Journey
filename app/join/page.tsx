import { Suspense } from "react";
import JoinContent from "./JoinContent";
export default function JoinPage() {
  return <Suspense fallback={<div style={{ minHeight:"100vh", background:"#0c0a0b", display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#6e5a66", fontSize:13, fontFamily:"system-ui" }}>Loading…</p></div>}><JoinContent /></Suspense>;
}

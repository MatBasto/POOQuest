"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Challenge } from "@/lib/types";
const Editor = dynamic(()=>import("@monaco-editor/react"),{ssr:false});
export function CodeChallenge({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [code,setCode]=useState(challenge.starter_code); const [out,setOut]=useState("Listo para ejecutar."); const [loading,setLoading]=useState(false); const [passed,setPassed]=useState<boolean|null>(null);
  async function run(){setLoading(true);setOut("Ejecutando...");setPassed(null); try{const r=await fetch("/api/execute",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challengeId:challenge.id,sourceCode:code})}); const data=await r.json(); if(!r.ok) throw new Error(data.error||"Error de ejecución"); setOut(data.output||data.status); setPassed(data.passed); router.refresh();}catch(e:any){setOut(e.message);}finally{setLoading(false)}}
  return <div className="card stack"><div><div className="kicker">Reto de programación</div><h3>{challenge.title}</h3><p className="muted">{challenge.statement}</p><span className="badge">Salida esperada: {challenge.expected_output}</span></div><div style={{border:"1px solid #223c5f",borderRadius:14,overflow:"hidden"}}><Editor height="360px" defaultLanguage="java" theme="vs-dark" value={code} onChange={v=>setCode(v||"")} options={{fontSize:14,minimap:{enabled:false},automaticLayout:true}}/></div><button className="btn" onClick={run} disabled={loading}>{loading?"Ejecutando...":"▶ Ejecutar código Java"}</button><div className="console">{out}</div>{passed!==null&&<div className={`card ${passed?"feedback ok":"feedback bad"}`}>{passed?`✓ Reto superado. +${challenge.xp_reward} XP (solo la primera vez).`:"La salida todavía no coincide con la esperada."}</div>}</div>;
}

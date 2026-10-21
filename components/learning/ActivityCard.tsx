"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Activity } from "@/lib/types";
export function ActivityCard({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [loading,setLoading]=useState(false); const [result,setResult]=useState<{correct:boolean;feedback:string;xp_awarded:number}|null>(null);
  async function answer(optionId:number){ setLoading(true); const {data,error}=await createClient().rpc("submit_activity",{p_activity_id:activity.id,p_option_id:optionId}); if(error) setResult({correct:false,feedback:error.message,xp_awarded:0}); else { setResult(data as any); router.refresh(); } setLoading(false); }
  return <div className={`card stack ${result ? result.correct?"feedback ok":"feedback bad":""}`}><div className="kicker">Actividad</div><h3>{activity.question}</h3>{activity.activity_options.map(o=><button className="option" disabled={loading||!!result} onClick={()=>answer(o.id)} key={o.id}>{o.option_text}</button>)}{result&&<div><strong>{result.correct?"✓ Correcto":"✕ Intenta de nuevo"}</strong><p>{result.feedback}</p>{result.xp_awarded>0&&<span className="badge">+{result.xp_awarded} XP</span>} {!result.correct&&<button className="btn secondary" onClick={()=>setResult(null)}>Reintentar</button>}</div>}</div>;
}

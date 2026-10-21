import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { levelUnlocked } from "@/lib/gamification";

export default async function ModulePage({ params }: { params: Promise<{ moduleId:string }> }) {
  const { moduleId } = await params; const supabase = await createClient(); const { data:{user} } = await supabase.auth.getUser();
  const [{data:mod},{data:levels},{data:profile},{data:progress}] = await Promise.all([
    supabase.from("modules").select("*").eq("id", Number(moduleId)).single(),
    supabase.from("levels").select("*").eq("module_id", Number(moduleId)).order("sort_order"),
    supabase.from("profiles").select("xp").eq("id", user!.id).single(),
    supabase.from("level_progress").select("level_id,status,percentage")
  ]); if(!mod) notFound(); const xp=profile?.xp||0;
  return <div className="page"><div className="kicker">Módulo {mod.sort_order}</div><h1 className="title">{mod.icon} {mod.name}</h1><p className="subtitle">{mod.description}</p><div className="stack" style={{marginTop:28}}>{(levels||[]).map((l:any)=>{ const unlocked=levelUnlocked(l.required_xp,xp); const pg=progress?.find((p:any)=>p.level_id===l.id); return <div className="level-row" key={l.id}><div className="level-index">{l.sort_order}</div><div><strong>{l.name}</strong><div className="muted">{l.description}</div><small className="muted">{pg?.status==="completed"?"Completado":pg?`${pg.percentage}% completado`:unlocked?"Disponible":`Requiere ${l.required_xp} XP`}</small></div>{unlocked?<Link className="btn" href={`/levels/${l.id}`}>{pg?"Continuar":"Comenzar"}</Link>:<span className="badge">🔒 Bloqueado</span>}</div>})}</div></div>;
}

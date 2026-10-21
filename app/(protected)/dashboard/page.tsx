import { createClient } from "@/lib/supabase/server";
import { ModuleCard } from "@/components/learning/ModuleCard";
import { StatCard } from "@/components/ui/StatCard";
import { xpToNextMilestone } from "@/lib/gamification";

export default async function DashboardPage() {
  const supabase = await createClient(); const { data:{ user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: modules }, { data: progress }, { count: rewardCount }] = await Promise.all([
    supabase.from("profiles").select("name,xp").eq("id", user!.id).single(),
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("level_progress").select("level_id,percentage,status,levels(module_id)"),
    supabase.from("user_rewards").select("*", { count:"exact", head:true })
  ]);
  const xp = profile?.xp || 0; const ms = xpToNextMilestone(xp); const completed = progress?.filter(p=>p.status==="completed").length || 0;
  return <div className="page"><section className="hero"><div className="hero-panel"><div className="kicker">Tu aventura continúa</div><h1 className="title">¡Hola, {profile?.name || "estudiante"}!</h1><p className="subtitle">Aprende un concepto, pruébalo en Java y avanza al siguiente nivel.</p><div className="row" style={{marginTop:22}}><span className="badge">⚡ {xp} XP</span><span className="badge">🎯 {ms.remaining} XP para el próximo logro</span></div></div><div className="grid"><StatCard label="Niveles completados" value={completed}/><StatCard label="Insignias" value={rewardCount || 0}/></div></section><div className="space"><div><div className="kicker">Ruta de aprendizaje</div><h2>Los cuatro pilares de POO</h2></div></div><div className="grid grid-4">{(modules||[]).map((m:any)=>{ const rows=(progress||[]).filter((p:any)=>p.levels?.module_id===m.id); const avg=rows.length?rows.reduce((acc:number,p:any)=>acc+(p.percentage||0),0)/5:0; return <ModuleCard key={m.id} module={m} progress={avg}/>; })}</div></div>;
}

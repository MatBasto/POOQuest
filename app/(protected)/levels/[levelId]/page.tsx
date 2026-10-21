import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LevelTabs } from "@/components/learning/LevelTabs";
export default async function LevelPage({params}:{params:Promise<{levelId:string}>}){
  const {levelId}=await params; const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
  const [{data:level},{data:profile},{data:contents},{data:activities},{data:challenges}] = await Promise.all([
    supabase.from("levels").select("*,modules(name,icon)").eq("id",Number(levelId)).single(),
    supabase.from("profiles").select("xp").eq("id",user!.id).single(),
    supabase.from("contents").select("*").eq("level_id",Number(levelId)).order("sort_order"),
    supabase.from("activities").select("id,level_id,question,feedback_correct,feedback_incorrect,xp_reward,activity_options(id,activity_id,option_text,sort_order)").eq("level_id",Number(levelId)),
    supabase.from("programming_challenges").select("*").eq("level_id",Number(levelId))
  ]);
  if(!level) notFound(); if((profile?.xp||0)<level.required_xp) redirect(`/modules/${level.module_id}`);
  return <div className="page"><div className="kicker">{(level as any).modules?.name} · Nivel {level.sort_order}</div><h1 className="title">{level.name}</h1><p className="subtitle">{level.description}</p><LevelTabs contents={(contents||[]) as any} activities={(activities||[]) as any} challenges={(challenges||[]) as any}/></div>;
}

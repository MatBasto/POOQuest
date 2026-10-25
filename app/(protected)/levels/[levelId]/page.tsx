import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LevelTabs } from "@/components/learning/LevelTabs";
import { getTerritory } from "@/lib/game";
import type { Activity, Challenge, ContentRow } from "@/lib/types";

type LevelWithModule = {
  id: number;
  module_id: number;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  required_xp: number;
  xp_reward: number;
  modules: { name: string; slug: string; icon: string; sort_order: number } | null;
};

type NextDestination = {
  href: string;
  eyebrow: string;
  title: string;
  actionLabel: string;
  kind: "level" | "territory" | "finish";
};

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: level }, { data: profile }, { data: contents }, { data: activities }, { data: challenges }, { data: levelScore }] = await Promise.all([
    supabase.from("levels").select("*,modules(name,slug,icon,sort_order)").eq("id", Number(levelId)).single(),
    supabase.from("profiles").select("xp").eq("id", user!.id).single(),
    supabase.from("contents").select("*").eq("level_id", Number(levelId)).order("sort_order"),
    supabase.from("activities").select("id,level_id,question,feedback_correct,feedback_incorrect,xp_reward,activity_options(id,activity_id,option_text,sort_order,is_correct)").eq("level_id", Number(levelId)),
    supabase.from("programming_challenges").select("*").eq("level_id", Number(levelId)),
    supabase.from("level_scores").select("best_stars").eq("level_id", Number(levelId)).maybeSingle(),
  ]);

  if (!level) notFound();
  const typedLevel = level as LevelWithModule;
  if ((profile?.xp || 0) < typedLevel.required_xp) redirect(`/modules/${typedLevel.module_id}`);

  const activityIds = (activities || []).map((activity) => activity.id);
  const challengeIds = (challenges || []).map((challenge) => challenge.id);
  const [{ data: activityAttempts }, { data: executions }] = await Promise.all([
    activityIds.length
      ? supabase.from("activity_attempts").select("activity_id,is_correct").in("activity_id", activityIds).eq("is_correct", true)
      : Promise.resolve({ data: [] }),
    challengeIds.length
      ? supabase.from("code_executions").select("challenge_id,passed").in("challenge_id", challengeIds).eq("passed", true)
      : Promise.resolve({ data: [] }),
  ]);

  const { data: nextLevel } = await supabase
    .from("levels")
    .select("id,name,sort_order")
    .eq("module_id", typedLevel.module_id)
    .gt("sort_order", typedLevel.sort_order)
    .order("sort_order")
    .limit(1)
    .maybeSingle();

  let nextDestination: NextDestination | null = null;

  if (nextLevel) {
    nextDestination = {
      href: `/levels/${nextLevel.id}`,
      eyebrow: `Misión ${String(nextLevel.sort_order).padStart(2, "0")}`,
      title: nextLevel.name,
      actionLabel: "Siguiente misión →",
      kind: "level",
    };
  } else if (typedLevel.modules?.sort_order) {
    const { data: nextModule } = await supabase
      .from("modules")
      .select("id,name,slug,sort_order")
      .gt("sort_order", typedLevel.modules.sort_order)
      .order("sort_order")
      .limit(1)
      .maybeSingle();

    if (nextModule) {
      const { data: firstLevel } = await supabase
        .from("levels")
        .select("id,name,sort_order")
        .eq("module_id", nextModule.id)
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      if (firstLevel) {
        const nextTerritory = getTerritory(nextModule.slug);
        nextDestination = {
          href: `/levels/${firstLevel.id}`,
          eyebrow: `${nextTerritory.icon} Siguiente territorio`,
          title: `${nextModule.name} · ${firstLevel.name}`,
          actionLabel: "Entrar al territorio →",
          kind: "territory",
        };
      }
    } else {
      nextDestination = {
        href: "/rewards",
        eyebrow: "Aventura completada",
        title: "Has recorrido los cuatro territorios de POOQuest",
        actionLabel: "Ver mis logros →",
        kind: "finish",
      };
    }
  }

  const territory = getTerritory(typedLevel.modules?.slug);
  return (
    <div className="page level-page" style={{ "--territory": territory.accent, "--territory-rgb": territory.glow } as React.CSSProperties}>
      <div className="level-breadcrumb">{territory.icon} {typedLevel.modules?.name} <span>→</span> Misión {typedLevel.sort_order}</div>
      <div className="level-heading">
        <div>
          <div className="kicker">Misión {String(typedLevel.sort_order).padStart(2, "0")}</div>
          <h1 className="title">{typedLevel.name}</h1>
          <p className="subtitle">{typedLevel.description}</p>
        </div>
        <div className="mission-reward-chip"><small>RECOMPENSA DE NIVEL</small><strong>+{typedLevel.xp_reward} XP</strong></div>
      </div>
      <LevelTabs
        levelId={typedLevel.id}
        levelSlug={typedLevel.slug}
        moduleSlug={typedLevel.modules?.slug || "abstraccion"}
        contents={(contents || []) as ContentRow[]}
        activities={(activities || []) as Activity[]}
        challenges={(challenges || []) as Challenge[]}
        completedActivityIds={(activityAttempts || []).map((row) => row.activity_id)}
        passedChallengeIds={(executions || []).map((row) => row.challenge_id)}
        initialBestStars={levelScore?.best_stars || 0}
        nextDestination={nextDestination}
      />
    </div>
  );
}

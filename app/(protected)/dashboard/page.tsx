import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdventureMap } from "@/components/game/AdventureMap";
import { xpToNextMilestone } from "@/lib/gamification";
import type { LevelRow, ModuleRow } from "@/lib/types";
import { buildAdventureRewards } from "@/lib/achievements";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: modules },
    { data: levels },
    { data: progress },
    { data: scores },
    { data: passedExecutions },
  ] = await Promise.all([
    supabase.from("profiles").select("name,xp").eq("id", user!.id).single(),
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("levels").select("*").order("sort_order"),
    supabase.from("level_progress").select("level_id,percentage,status"),
    supabase.from("level_scores").select("level_id,best_stars"),
    supabase.from("code_executions").select("challenge_id").eq("passed", true),
  ]);

  const xp = profile?.xp || 0;
  const milestone = xpToNextMilestone(xp);
  const completed = progress?.filter((item) => item.status === "completed").length || 0;
  const moduleRows = (modules || []) as ModuleRow[];
  const levelRows = (levels || []) as LevelRow[];
  const uniqueBosses = new Set((passedExecutions || []).map((row) => row.challenge_id)).size;
  const rewardState = buildAdventureRewards({
    modules: moduleRows,
    levels: levelRows,
    progress: progress || [],
    scores: scores || [],
    passedBosses: uniqueBosses,
  });

  const adventureModules = moduleRows.map((module) => {
    const moduleLevels = levelRows.filter((level) => level.module_id === module.id);
    const total = moduleLevels.reduce((sum, level) => {
      const row = progress?.find((item) => item.level_id === level.id);
      return sum + (row?.percentage || 0);
    }, 0);
    const percentage = moduleLevels.length ? Math.round(total / moduleLevels.length) : 0;
    const nextLevel = moduleLevels.find((level) => {
      const row = progress?.find((item) => item.level_id === level.id);
      return level.required_xp <= xp && row?.status !== "completed";
    }) || moduleLevels.find((level) => level.required_xp <= xp);

    return {
      ...module,
      progress: percentage,
      unlocked: moduleLevels.some((level) => level.required_xp <= xp),
      nextLevelId: nextLevel?.id,
    };
  });

  const nextMission = levelRows.find((level) => {
    const row = progress?.find((item) => item.level_id === level.id);
    return level.required_xp <= xp && row?.status !== "completed";
  });
  const nextModule = nextMission ? moduleRows.find((module) => module.id === nextMission.module_id) : undefined;

  return (
    <div className="page adventure-home">
      <section className="adventure-hero">
        <div className="adventure-hero-copy">
          <div className="kicker">El Núcleo POO te necesita</div>
          <h1>Continúa tu aventura, <span>{profile?.name || "estudiante"}</span></h1>
          <p>Recupera los cuatro pilares resolviendo misiones interactivas y demostrando lo aprendido con Java real.</p>
          <div className="hero-metrics">
            <span><b>⚡ {xp}</b> XP</span>
            <span><b>✓ {completed}</b> misiones</span>
            <span><b>★ {rewardState.unlockedCount}</b> logros</span>
          </div>
          {nextMission ? (
            <div className="next-mission-card">
              <div><small>SIGUIENTE MISIÓN</small><strong>{nextModule?.name} · {nextMission.name}</strong><span>{nextMission.description}</span></div>
              <Link className="btn" href={`/levels/${nextMission.id}`}>Continuar →</Link>
            </div>
          ) : (
            <div className="next-mission-card"><div><small>RUTA COMPLETADA</small><strong>Has recorrido todas las misiones disponibles</strong><span>Puedes revisitar cualquier territorio para practicar.</span></div><Link className="btn" href="/modules">Explorar territorios</Link></div>
          )}
        </div>
        <div className="core-visual" aria-hidden="true">
          <div className="core-ring ring-one" />
          <div className="core-ring ring-two" />
          <div className="core-center">POO</div>
          <span className="core-node n1">◇</span>
          <span className="core-node n2">⬡</span>
          <span className="core-node n3">⌘</span>
          <span className="core-node n4">✦</span>
        </div>
      </section>

      <section className="mission-meter">
        <div><div className="kicker">Próximo hito</div><strong>{milestone.next} XP</strong><span>Te faltan {milestone.remaining} XP para alcanzar el siguiente logro.</span></div>
        <div className="progress"><span style={{ width: `${Math.max(8, Math.min(100, ((milestone.next - milestone.remaining) / milestone.next) * 100))}%` }} /></div>
        <Link href="/rewards">Ver logros →</Link>
      </section>

      <div className="map-heading">
        <div><div className="kicker">Mapa de POOQuest</div><h2>Los cuatro territorios</h2></div>
        <Link href="/how-to-play" className="btn secondary">? Cómo se juega</Link>
      </div>
      <AdventureMap modules={adventureModules} />
    </div>
  );
}

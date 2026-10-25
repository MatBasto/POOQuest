import { createClient } from "@/lib/supabase/server";
import { buildAdventureRewards } from "@/lib/achievements";
import type { LevelRow, ModuleRow } from "@/lib/types";

type ProgressRow = { level_id: number; percentage: number; status: string };
type ScoreRow = { level_id: number; best_stars: number };

export default async function RewardsPage() {
  const supabase = await createClient();
  const [
    { data: profile },
    { data: modules },
    { data: levels },
    { data: progress },
    { data: scores },
    { data: passedExecutions },
  ] = await Promise.all([
    supabase.from("profiles").select("xp").single(),
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("levels").select("*").order("module_id").order("sort_order"),
    supabase.from("level_progress").select("level_id,percentage,status"),
    supabase.from("level_scores").select("level_id,best_stars"),
    supabase.from("code_executions").select("challenge_id").eq("passed", true),
  ]);

  const moduleRows = (modules || []) as ModuleRow[];
  const levelRows = (levels || []) as LevelRow[];
  const progressRows = (progress || []) as ProgressRow[];
  const scoreRows = (scores || []) as ScoreRow[];
  const uniqueBosses = new Set((passedExecutions || []).map((row) => row.challenge_id)).size;
  const { achievements, fragments, unlockedCount } = buildAdventureRewards({
    modules: moduleRows,
    levels: levelRows,
    progress: progressRows,
    scores: scoreRows,
    passedBosses: uniqueBosses,
  });

  return (
    <div className="page rewards-page-v5">
      <div className="kicker">Sala de logros</div>
      <h1 className="title">Recompensas de aventura</h1>
      <p className="subtitle lead">Aquí no se premia solo acumular XP. Cada distintivo representa algo concreto que hiciste durante tu recorrido por POOQuest.</p>

      <section className="rewards-v5-summary">
        <div><small>LOGROS DESBLOQUEADOS</small><strong>{unlockedCount}/{achievements.length}</strong></div>
        <div><small>EXPERIENCIA TOTAL</small><strong>{profile?.xp || 0} XP</strong></div>
        <div><small>FRAGMENTOS RECUPERADOS</small><strong>{fragments.filter((fragment) => fragment.recovered).length}/4</strong></div>
      </section>

      <section className="core-fragments-panel">
        <div className="core-fragments-copy">
          <div className="kicker">Núcleo POO</div>
          <h2>Recupera los cuatro fragmentos</h2>
          <p>Cada territorio completado restaura una parte del Núcleo. No necesitas gastar nada: los fragmentos se obtienen demostrando dominio de cada pilar.</p>
        </div>
        <div className="fragment-grid">
          {fragments.map((fragment) => (
            <article className={`fragment-card ${fragment.recovered ? "recovered" : "locked"}`} key={fragment.slug}>
              <div className="fragment-symbol">{fragment.icon}</div>
              <div>
                <small>{fragment.recovered ? "FRAGMENTO RECUPERADO" : "FRAGMENTO INESTABLE"}</small>
                <strong>{fragment.name}</strong>
                <span>{fragment.completed}/{fragment.total} misiones</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="reward-section-heading">
        <div><div className="kicker">Colección</div><h2>Logros desbloqueables</h2></div>
        <span className="reward-counter">{unlockedCount} obtenidos</span>
      </div>

      <div className="grid grid-2 rewards-grid-v5">
        {achievements.map((achievement) => {
          const percentage = Math.min(100, Math.round((achievement.current / Math.max(achievement.target, 1)) * 100));
          return (
            <article className={`achievement-card-v5 ${achievement.unlocked ? "obtained" : "locked"}`} key={achievement.id}>
              <div className="achievement-v5-icon">{achievement.icon}</div>
              <div className="achievement-v5-copy">
                <div className="achievement-v5-top"><span>{achievement.category}</span><b>{achievement.unlocked ? "✓ DESBLOQUEADO" : `${percentage}%`}</b></div>
                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>
                <div className="achievement-v5-progress"><i style={{ width: `${percentage}%` }} /></div>
                <small>{achievement.progressLabel}</small>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

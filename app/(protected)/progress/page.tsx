import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTerritory } from "@/lib/game";
import type { LevelRow, ModuleRow } from "@/lib/types";

type ProgressRow = { level_id: number; percentage: number; status: string };
type ScoreRow = { level_id: number; best_stars: number; best_errors: number; best_hints: number; plays: number };
type ChallengeRow = { id: number; level_id: number };

export default async function ProgressPage() {
  const supabase = await createClient();
  const [
    { data: profile },
    { data: modules },
    { data: levels },
    { data: progress },
    { data: scores },
    { data: challenges },
    { data: passedExecutions },
  ] = await Promise.all([
    supabase.from("profiles").select("xp").single(),
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("levels").select("*").order("module_id").order("sort_order"),
    supabase.from("level_progress").select("level_id,percentage,status"),
    supabase.from("level_scores").select("level_id,best_stars,best_errors,best_hints,plays"),
    supabase.from("programming_challenges").select("id,level_id"),
    supabase.from("code_executions").select("challenge_id").eq("passed", true),
  ]);

  const moduleRows = (modules || []) as ModuleRow[];
  const levelRows = (levels || []) as LevelRow[];
  const progressRows = (progress || []) as ProgressRow[];
  const scoreRows = (scores || []) as ScoreRow[];
  const challengeRows = (challenges || []) as ChallengeRow[];
  const passedChallengeIds = new Set((passedExecutions || []).map((row) => row.challenge_id));
  const completedIds = new Set(progressRows.filter((row) => row.status === "completed").map((row) => row.level_id));
  const progressByLevel = new Map(progressRows.map((row) => [row.level_id, row]));
  const scoreByLevel = new Map(scoreRows.map((row) => [row.level_id, row]));
  const totalLevels = levelRows.length;
  const completed = completedIds.size;
  const globalPercentage = totalLevels
    ? Math.round(levelRows.reduce((sum, level) => sum + (progressByLevel.get(level.id)?.percentage || 0), 0) / totalLevels)
    : 0;
  const totalStars = scoreRows.reduce((sum, score) => sum + (completedIds.has(score.level_id) ? score.best_stars : 0), 0);
  const maxStars = totalLevels * 3;

  const territoryStats = moduleRows.map((module) => {
    const territory = getTerritory(module.slug);
    const moduleLevels = levelRows.filter((level) => level.module_id === module.id);
    const moduleCompleted = moduleLevels.filter((level) => completedIds.has(level.id)).length;
    const moduleProgress = moduleLevels.length
      ? Math.round(moduleLevels.reduce((sum, level) => sum + (progressByLevel.get(level.id)?.percentage || 0), 0) / moduleLevels.length)
      : 0;
    const moduleStars = moduleLevels.reduce((sum, level) => sum + (scoreByLevel.get(level.id)?.best_stars || 0), 0);
    const moduleChallengeIds = challengeRows.filter((challenge) => moduleLevels.some((level) => level.id === challenge.level_id)).map((challenge) => challenge.id);
    const bossDefeated = moduleChallengeIds.length > 0 && moduleChallengeIds.every((id) => passedChallengeIds.has(id));
    return { module, territory, moduleLevels, moduleCompleted, moduleProgress, moduleStars, bossDefeated };
  });

  const completedTerritories = territoryStats.filter((item) => item.moduleLevels.length > 0 && item.moduleCompleted === item.moduleLevels.length).length;

  return (
    <div className="page progress-page-v5">
      <div className="kicker">Bitácora del explorador</div>
      <h1 className="title">Mi progreso</h1>
      <p className="subtitle lead">Consulta cuánto has avanzado, qué tan bien dominaste cada misión y cuál es el siguiente territorio que todavía puedes mejorar.</p>

      <section className="progress-v5-overview">
        <div><small>MISIONES COMPLETADAS</small><strong>{completed}/{totalLevels}</strong><span>{totalLevels - completed} pendientes</span></div>
        <div><small>PROGRESO GLOBAL</small><strong>{globalPercentage}%</strong><span>Los cuatro pilares combinados</span></div>
        <div><small>EXPERIENCIA</small><strong>{profile?.xp || 0} XP</strong><span>Acumulada en la aventura</span></div>
        <div><small>TERRITORIOS SUPERADOS</small><strong>{completedTerritories}/4</strong><span>{totalStars}/{maxStars} estrellas</span></div>
      </section>

      <div className="progress-section-heading">
        <div><div className="kicker">Mapa de dominio</div><h2>Avance por territorio</h2></div>
        <Link href="/modules" className="btn secondary">Ver territorios</Link>
      </div>

      <section className="territory-progress-grid">
        {territoryStats.map(({ module, territory, moduleLevels, moduleCompleted, moduleProgress, moduleStars, bossDefeated }) => (
          <article className="territory-progress-card" style={{ "--territory": territory.accent, "--territory-rgb": territory.glow } as React.CSSProperties} key={module.id}>
            <div className="territory-progress-top"><span className="territory-progress-icon">{territory.icon}</span><div><small>{territory.name}</small><h3>{module.name}</h3></div><b>{moduleProgress}%</b></div>
            <ProgressBar value={moduleProgress} />
            <div className="territory-progress-stats"><span><b>{moduleCompleted}/{moduleLevels.length}</b> misiones</span><span><b>★ {moduleStars}/{moduleLevels.length * 3}</b> dominio</span><span className={bossDefeated ? "boss-ok" : ""}><b>{bossDefeated ? "✓" : "○"}</b> Jefe Java</span></div>
          </article>
        ))}
      </section>

      <section className="star-guide-card">
        <div><div className="kicker">Sistema de dominio</div><h2>¿Qué significan las estrellas?</h2><p>Las estrellas califican tu mejor partida en la misión interactiva. El Jefe Java se registra aparte.</p></div>
        <div className="star-guide-rules">
          <span><b>★★★</b><small>Sin errores y sin pistas</small></span>
          <span><b>★★☆</b><small>Hasta 2 errores y máximo 1 pista</small></span>
          <span><b>★☆☆</b><small>Más errores o más ayuda</small></span>
        </div>
        <p className="star-guide-note">Puedes usar <strong>Repasar misión</strong> para mejorar tu récord. El repaso nunca vuelve a sumar XP.</p>
      </section>

      <div className="progress-section-heading"><div><div className="kicker">Registro detallado</div><h2>Misiones</h2></div></div>
      <div className="stack progress-list-v5">
        {territoryStats.flatMap(({ module, territory, moduleLevels }) => moduleLevels.map((level) => {
          const row = progressByLevel.get(level.id);
          const score = scoreByLevel.get(level.id);
          const percentage = row?.percentage || 0;
          const completedLevel = row?.status === "completed";
          return (
            <article className={`progress-mission-v5 ${completedLevel ? "complete" : ""}`} key={level.id}>
              <div className="progress-mission-v5-main">
                <div className="progress-mission-v5-title"><span style={{ color: territory.accent }}>{territory.icon}</span><div><small>{module.name} · MISIÓN {String(level.sort_order).padStart(2, "0")}</small><strong>{level.name}</strong></div></div>
                <div className="progress-mission-v5-stars" aria-label={`${score?.best_stars || 0} de 3 estrellas`}>
                  {[1, 2, 3].map((star) => <b className={star <= (score?.best_stars || 0) ? "earned" : ""} key={star}>★</b>)}
                </div>
              </div>
              <div className="progress-mission-v5-bar"><ProgressBar value={percentage} /><span>{percentage}%</span></div>
              <div className="progress-mission-v5-meta">
                <span>{completedLevel ? "✓ Completada" : percentage > 0 ? "En progreso" : "Sin iniciar"}</span>
                {score ? <span>Mejor partida: {score.best_errors} error{score.best_errors === 1 ? "" : "es"} · {score.best_hints} pista{score.best_hints === 1 ? "" : "s"} · {score.plays} partida{score.plays === 1 ? "" : "s"}</span> : completedLevel ? <span>Repasa la misión para registrar tu dominio</span> : <span>Las estrellas aparecerán al superarla</span>}
                <Link href={`/levels/${level.id}`}>{completedLevel ? "Repasar →" : "Abrir →"}</Link>
              </div>
            </article>
          );
        }))}
      </div>
    </div>
  );
}

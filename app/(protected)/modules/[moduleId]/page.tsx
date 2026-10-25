import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { levelUnlocked } from "@/lib/gamification";
import { getTerritory } from "@/lib/game";
import type { LevelRow, ModuleRow } from "@/lib/types";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: mod }, { data: levels }, { data: profile }, { data: progress }] = await Promise.all([
    supabase.from("modules").select("*").eq("id", Number(moduleId)).single(),
    supabase.from("levels").select("*").eq("module_id", Number(moduleId)).order("sort_order"),
    supabase.from("profiles").select("xp").eq("id", user!.id).single(),
    supabase.from("level_progress").select("level_id,status,percentage"),
  ]);
  if (!mod) notFound();

  const moduleRow = mod as ModuleRow;
  const levelRows = (levels || []) as LevelRow[];
  const xp = profile?.xp || 0;
  const territory = getTerritory(moduleRow.slug);
  const avg = levelRows.length ? Math.round(levelRows.reduce((sum, level) => sum + (progress?.find((row) => row.level_id === level.id)?.percentage || 0), 0) / levelRows.length) : 0;

  return (
    <div className="page territory-page" style={{ "--territory": territory.accent, "--territory-rgb": territory.glow } as React.CSSProperties}>
      <section className="territory-hero">
        <div className="territory-hero-emblem">{territory.icon}</div>
        <div>
          <div className="kicker">Territorio {moduleRow.sort_order} · {moduleRow.name}</div>
          <h1>{territory.name}</h1>
          <p>{territory.lore}</p>
          <div className="territory-hero-progress"><div className="progress"><span style={{ width: `${avg}%` }} /></div><b>{avg}% restaurado</b></div>
        </div>
      </section>

      <div className="mission-path-heading"><div><div className="kicker">Ruta de misiones</div><h2>Avanza nodo por nodo</h2></div><span className="badge">⚡ {xp} XP</span></div>
      <div className="mission-path">
        {levelRows.map((level, index) => {
          const unlocked = levelUnlocked(level.required_xp, xp);
          const pg = progress?.find((row) => row.level_id === level.id);
          const complete = pg?.status === "completed";
          const stars = complete ? 3 : pg?.percentage ? 1 : 0;
          return (
            <div className={`mission-node ${complete ? "complete" : ""} ${!unlocked ? "locked" : ""}`} key={level.id}>
              <div className="mission-node-marker">{complete ? "✓" : unlocked ? index + 1 : "🔒"}</div>
              <div className="mission-node-card">
                <div className="space mission-node-top"><div><small>MISIÓN {String(index + 1).padStart(2, "0")}</small><h3>{level.name}</h3></div><div className="mission-stars" aria-label={`${stars} estrellas`}>{[0, 1, 2].map((star) => <span key={star} className={star < stars ? "on" : ""}>★</span>)}</div></div>
                <p>{level.description}</p>
                <div className="space mission-node-bottom">
                  <span className="muted">{complete ? "Completada" : pg ? `${pg.percentage}% completado` : unlocked ? "Lista para jugar" : `Requiere ${level.required_xp} XP`}</span>
                  {unlocked ? <Link className="btn" href={`/levels/${level.id}`}>{complete ? "Repetir" : pg ? "Continuar" : "Comenzar misión"}</Link> : <span className="badge">Bloqueada</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

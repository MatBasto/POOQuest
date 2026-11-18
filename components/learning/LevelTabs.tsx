"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ConceptVisual } from "./ConceptVisual";
import { CodeChallenge } from "./CodeChallenge";
import { MissionActivity } from "@/components/game/MissionActivity";
import { Celebration, type CelebrationKind } from "@/components/game/Celebration";
import { getTerritory } from "@/lib/game";
import { playGameSound } from "@/lib/sound";
import type { ContentRow, Activity, Challenge } from "@/lib/types";

type Stage = "contenido" | "actividad" | "reto";
type NextDestination = {
  href: string;
  eyebrow: string;
  title: string;
  actionLabel: string;
  kind: "level" | "territory" | "finish";
};

export function LevelTabs({
  levelId,
  levelSlug,
  moduleSlug,
  contents,
  activities,
  challenges,
  completedActivityIds,
  passedChallengeIds,
  initialBestStars,
  nextDestination,
}: {
  levelId: number;
  levelSlug: string;
  moduleSlug: string;
  contents: ContentRow[];
  activities: Activity[];
  challenges: Challenge[];
  completedActivityIds: number[];
  passedChallengeIds: number[];
  initialBestStars: number;
  nextDestination: NextDestination | null;
}) {
  const [tab, setTab] = useState<Stage>("contenido");
  const [missionDone, setMissionDone] = useState(() => activities.length === 0 || activities.every((a) => completedActivityIds.includes(a.id)));
  const [bossDone, setBossDone] = useState(() => challenges.length > 0 && challenges.every((c) => passedChallengeIds.includes(c.id)));
  const [celebration, setCelebration] = useState<CelebrationKind | null>(null);
  const hasChallenge = challenges.length > 0;
  const levelDone = missionDone && (!hasChallenge || bossDone);
  const territory = useMemo(() => getTerritory(moduleSlug), [moduleSlug]);

  const stages = [
    { id: "contenido" as Stage, number: "01", label: "Descubre", done: tab !== "contenido" || missionDone },
    { id: "actividad" as Stage, number: "02", label: "Misión", done: missionDone },
    ...(hasChallenge ? [{ id: "reto" as Stage, number: "BOSS", label: "Jefe Java", done: bossDone }] : []),
  ];

  function go(stage: Stage) {
    if (stage === "reto" && !missionDone) return;
    setTab(stage);
  }

  function celebrate(kind: CelebrationKind) {
    setCelebration(kind);
    if (kind === "unlock") playGameSound("unlock");
    else if (kind === "territory" || kind === "boss") playGameSound("victory");
    else if (kind === "finish") playGameSound("finish");
    else playGameSound("success");
  }

  function handleMissionCompleted() {
    setMissionDone(true);
    if (hasChallenge) {
      celebrate("unlock");
      return;
    }
    if (nextDestination?.kind === "territory") celebrate("territory");
    else if (nextDestination?.kind === "finish") celebrate("finish");
    else celebrate("mission");
  }

  function handleBossPassed() {
    setBossDone(true);
    if (nextDestination?.kind === "territory") celebrate("territory");
    else if (nextDestination?.kind === "finish") celebrate("finish");
    else celebrate("boss");
  }

  return (
    <>
      <Celebration kind={celebration} onDone={() => setCelebration(null)} />
      <div className="mission-stage-nav">
        {stages.map((stage, index) => (
          <div className="stage-wrap" key={stage.id}>
            <button
              className={`stage-button ${tab === stage.id ? "active" : ""} ${stage.done ? "done" : ""} ${stage.id === "reto" && !missionDone ? "locked" : ""}`}
              aria-current={tab === stage.id ? "step" : undefined}
              onClick={() => go(stage.id)}
              disabled={stage.id === "reto" && !missionDone}
            >
              <span>{stage.number}</span>
              <strong>{stage.label}</strong>
              <small>{stage.done ? "Completado" : stage.id === "reto" && !missionDone ? "Bloqueado" : "Disponible"}</small>
            </button>
            {index < stages.length - 1 && <div className={`stage-line ${stage.done ? "done" : ""}`} />}
          </div>
        ))}
      </div>

      {hasChallenge && !missionDone && <p className="subtitle">Completa la actividad para desbloquear el Jefe Java.</p>}

      {tab === "contenido" && (
        <div className="stack mission-content-stack">
          <section className="mission-briefing">
            <div className="mission-briefing-icon" style={{ color: territory.accent }}>{territory.icon}</div>
            <div><div className="kicker">Briefing de misión</div><h2>Antes de jugar, entiende la herramienta que vas a usar</h2><p>La teoría aquí es corta a propósito. Lee el concepto, observa el ejemplo y continúa cuando puedas explicarlo con tus propias palabras.</p></div>
          </section>
          {contents.map((content) => (
            <section className="card learning-card" key={content.id}>
              <div className="kicker">Concepto desbloqueado</div>
              <h2>{content.title}</h2>
              {content.body.split("\n").map((paragraph, index) => <p className="subtitle" key={index}>{paragraph}</p>)}
              {content.code_example && <div className="code-frame"><div className="code-frame-bar"><span /><span /><span /><small>JAVA // EJEMPLO</small></div><pre className="code">{content.code_example}</pre></div>}
              <ConceptVisual type={content.visual_type} />
            </section>
          ))}
          {!contents.length && <div className="empty card">No hay contenido configurado.</div>}
          <div className="stage-next"><span>¿Listo para comprobarlo?</span><button className="btn" onClick={() => setTab("actividad")}>Ir a la misión →</button></div>
        </div>
      )}

      {tab === "actividad" && (
        <div className="stack">
          {activities.map((activity) => (
            <MissionActivity
              activity={activity}
              levelId={levelId}
              levelSlug={levelSlug}
              initiallyCompleted={completedActivityIds.includes(activity.id)}
              initialBestStars={initialBestStars}
              onCompleted={handleMissionCompleted}
              key={activity.id}
            />
          ))}
          {!activities.length && <div className="empty card">Este nivel no tiene una misión interactiva.</div>}
          {missionDone && hasChallenge && !bossDone && <div className="boss-unlocked"><div><div className="kicker">Acceso concedido</div><h3>Jefe Java desbloqueado</h3><p>Ya demostraste el concepto. Ahora úsalo escribiendo código real.</p></div><button className="btn boss-button" onClick={() => setTab("reto")}>Entrar al jefe →</button></div>}
        </div>
      )}

      {tab === "reto" && hasChallenge && missionDone && (
        <div className="stack">
          {challenges.map((challenge) => (
            <CodeChallenge challenge={challenge} initiallyPassed={passedChallengeIds.includes(challenge.id)} onPassed={handleBossPassed} key={challenge.id} />
          ))}
        </div>
      )}

      {levelDone && nextDestination && (
        <section className={`level-complete-nav ${nextDestination.kind}`}>
          <div className="level-complete-icon">{nextDestination.kind === "finish" ? "★" : nextDestination.kind === "territory" ? "↗" : "→"}</div>
          <div className="level-complete-copy">
            <div className="kicker">{nextDestination.eyebrow}</div>
            <h3>{nextDestination.title}</h3>
            <p>{nextDestination.kind === "level" ? "Tu progreso está guardado. Puedes continuar sin volver a Territorios." : nextDestination.kind === "territory" ? "Terminaste este pilar. El siguiente territorio ya te espera." : "Puedes revisar tus recompensas y repetir cualquier misión cuando quieras."}</p>
          </div>
          <Link className="btn level-complete-button" href={nextDestination.href}>{nextDestination.actionLabel}</Link>
        </section>
      )}
    </>
  );
}

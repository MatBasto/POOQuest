"use client";

import { useState } from "react";
import { ConceptVisual } from "./ConceptVisual";
import { ActivityCard } from "./ActivityCard";
import { CodeChallenge } from "./CodeChallenge";
import type { ContentRow, Activity, Challenge } from "@/lib/types";

export function LevelTabs({
  contents,
  activities,
  challenges,
}: {
  contents: ContentRow[];
  activities: Activity[];
  challenges: Challenge[];
}) {
  const [tab, setTab] = useState<"contenido" | "actividad" | "reto">("contenido");
  const hasChallenge = challenges.length > 0;

  return (
    <>
      <div className="tabs">
        <button
          className={`tab ${tab === "contenido" ? "active" : ""}`}
          onClick={() => setTab("contenido")}
        >
          Contenido
        </button>

        <button
          className={`tab ${tab === "actividad" ? "active" : ""}`}
          onClick={() => setTab("actividad")}
        >
          Actividad
        </button>

        {hasChallenge && (
          <button
            className={`tab ${tab === "reto" ? "active" : ""}`}
            onClick={() => setTab("reto")}
          >
            Reto Java
          </button>
        )}
      </div>

      {tab === "contenido" && (
        <div className="stack">
          {contents.map((c) => (
            <section className="card" key={c.id}>
              <div className="kicker">Concepto</div>
              <h2>{c.title}</h2>
              {c.body.split("\n").map((p, i) => (
                <p className="subtitle" key={i}>
                  {p}
                </p>
              ))}
              {c.code_example && <pre className="code">{c.code_example}</pre>}
              <ConceptVisual type={c.visual_type} />
            </section>
          ))}
          {!contents.length && <div className="empty card">No hay contenido configurado.</div>}
        </div>
      )}

      {tab === "actividad" && (
        <div className="stack">
          {activities.map((a) => (
            <ActivityCard activity={a} key={a.id} />
          ))}
          {!activities.length && <div className="empty card">Este nivel no tiene actividad.</div>}
        </div>
      )}

      {tab === "reto" && hasChallenge && (
        <div className="stack">
          {challenges.map((c) => (
            <CodeChallenge challenge={c} key={c.id} />
          ))}
        </div>
      )}
    </>
  );
}

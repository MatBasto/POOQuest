import Link from "next/link";
import { getTerritory } from "@/lib/game";
import type { ModuleRow } from "@/lib/types";

type AdventureModule = ModuleRow & {
  progress: number;
  unlocked: boolean;
  nextLevelId?: number;
};

export function AdventureMap({ modules, showActions = true }: { modules: AdventureModule[]; showActions?: boolean }) {
  return (
    <div className="adventure-map">
      <div className="map-line" aria-hidden="true" />
      {modules.map((module, index) => {
        const territory = getTerritory(module.slug);
        return (
          <div className={`territory-row ${index % 2 ? "right" : "left"}`} key={module.id}>
            <div className="territory-node" style={{ "--territory": territory.accent, "--territory-rgb": territory.glow } as React.CSSProperties}>
              <div className="territory-emblem">{territory.icon}</div>
              <div className="territory-copy">
                <div className="kicker">Territorio {index + 1} · {territory.subtitle}</div>
                <h3>{territory.name}</h3>
                <p>{territory.lore}</p>
                <div className="territory-progress-row">
                  <div className="progress"><span style={{ width: `${module.progress}%` }} /></div>
                  <strong>{module.progress}%</strong>
                </div>
                {module.unlocked ? showActions && (
                  <Link className="btn territory-button" href={module.nextLevelId ? `/levels/${module.nextLevelId}` : `/modules/${module.id}`}>
                    {module.progress >= 100 ? "Revisitar territorio" : module.progress > 0 ? "Continuar misión" : "Entrar al territorio"}
                  </Link>
                ) : (
                  <span className="territory-locked">🔒 Completa el camino anterior para reunir suficiente XP</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

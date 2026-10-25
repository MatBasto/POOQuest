import Link from "next/link";
import type { ModuleRow } from "@/lib/types";
import { getTerritory } from "@/lib/game";

export function ModuleCard({ module, progress = 0 }: { module: ModuleRow; progress?: number }) {
  const territory = getTerritory(module.slug);
  return (
    <Link
      className="card module-card territory-module-card"
      href={`/modules/${module.id}`}
      style={{ "--territory": territory.accent, "--territory-rgb": territory.glow } as React.CSSProperties}
    >
      <div className="module-icon">{territory.icon}</div>
      <div className="kicker">Territorio {module.sort_order} · {module.name}</div>
      <h3>{territory.name}</h3>
      <p className="muted">{territory.lore}</p>
      <div className="space"><small>{Math.round(progress)}% restaurado</small><span className="badge">Entrar →</span></div>
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
    </Link>
  );
}

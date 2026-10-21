import Link from "next/link";
import type { ModuleRow } from "@/lib/types";
export function ModuleCard({ module, progress = 0 }: { module: ModuleRow; progress?: number }) {
  return <Link className="card module-card" href={`/modules/${module.id}`}><div className="module-icon">{module.icon}</div><div className="kicker">Pilar {module.sort_order}</div><h3>{module.name}</h3><p className="muted">{module.description}</p><div className="space"><small>{Math.round(progress)}%</small><span className="badge">Explorar →</span></div><div className="progress" style={{marginTop:10}}><span style={{width:`${progress}%`}}/></div></Link>;
}

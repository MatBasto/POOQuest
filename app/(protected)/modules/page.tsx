import { createClient } from "@/lib/supabase/server";
import { ModuleCard } from "@/components/learning/ModuleCard";
import type { LevelRow, ModuleRow } from "@/lib/types";

export default async function ModulesPage() {
  const supabase = await createClient();
  const [{ data: modules }, { data: levels }, { data: progress }] = await Promise.all([
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("levels").select("*").order("sort_order"),
    supabase.from("level_progress").select("level_id,percentage,status"),
  ]);
  const moduleRows = (modules || []) as ModuleRow[];
  const levelRows = (levels || []) as LevelRow[];

  return (
    <div className="page">
      <div className="kicker">Mapa completo</div>
      <h1 className="title">Territorios de POOQuest</h1>
      <p className="subtitle lead">Cada territorio transforma un pilar de POO en una ruta de misiones. Entra, descubre el concepto, supera la actividad y enfréntate al jefe final.</p>
      <div className="grid grid-2 territory-grid">
        {moduleRows.map((module) => {
          const moduleLevels = levelRows.filter((level) => level.module_id === module.id);
          const total = moduleLevels.reduce((sum, level) => {
            const levelProgress = progress?.find((item) => item.level_id === level.id);
            return sum + (levelProgress?.percentage || 0);
          }, 0);
          const percentage = moduleLevels.length ? Math.round(total / moduleLevels.length) : 0;
          return <ModuleCard key={module.id} module={module} progress={percentage} />;
        })}
      </div>
    </div>
  );
}

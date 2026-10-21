import { createClient } from "@/lib/supabase/server";
import { ModuleCard } from "@/components/learning/ModuleCard";

export default async function ModulesPage() {
  const supabase = await createClient();

  const [
    { data: modules },
    { data: levels },
    { data: progress },
  ] = await Promise.all([
    supabase
      .from("modules")
      .select("*")
      .order("sort_order"),

    supabase
      .from("levels")
      .select("id, module_id"),

    supabase
      .from("level_progress")
      .select("level_id, percentage, status"),
  ]);

  return (
    <div className="page">
      <div className="kicker">Módulos</div>

      <h1 className="title">Elige un pilar</h1>

      <p className="subtitle">
        Cada módulo combina explicación, actividad y práctica en código.
      </p>

      <div
        className="grid grid-4"
        style={{ marginTop: 28 }}
      >
        {(modules || []).map((module: any) => {
          // Niveles que pertenecen a este módulo
          const moduleLevels = (levels || []).filter(
            (level: any) => level.module_id === module.id
          );

          // Suma del progreso de todos los niveles del módulo
          const totalProgress = moduleLevels.reduce(
            (sum: number, level: any) => {
              const levelProgress = (progress || []).find(
                (item: any) => item.level_id === level.id
              );

              return sum + (levelProgress?.percentage || 0);
            },
            0
          );

          // Promedio dinámico según la cantidad real de niveles
          const percentage =
            moduleLevels.length > 0
              ? Math.round(totalProgress / moduleLevels.length)
              : 0;

          return (
            <ModuleCard
              key={module.id}
              module={module}
              progress={percentage}
            />
          );
        })}
      </div>
    </div>
  );
}
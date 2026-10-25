import type { LevelRow, ModuleRow } from "@/lib/types";

type ProgressRow = { level_id: number; percentage: number; status: string };
type ScoreRow = { level_id: number; best_stars: number };

export type Achievement = {
  id: string;
  icon: string;
  category: string;
  title: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  progressLabel: string;
};

export type Fragment = {
  slug: string;
  icon: string;
  name: string;
  completed: number;
  total: number;
  recovered: boolean;
};

export function buildAdventureRewards({
  modules,
  levels,
  progress,
  scores,
  passedBosses,
}: {
  modules: ModuleRow[];
  levels: LevelRow[];
  progress: ProgressRow[];
  scores: ScoreRow[];
  passedBosses: number;
}) {
  const completedIds = new Set(progress.filter((row) => row.status === "completed").map((row) => row.level_id));
  const completed = completedIds.size;
  const perfect = scores.filter((row) => completedIds.has(row.level_id) && row.best_stars === 3).length;

  const fragments: Fragment[] = modules.map((module) => {
    const moduleLevels = levels.filter((level) => level.module_id === module.id);
    const moduleCompleted = moduleLevels.filter((level) => completedIds.has(level.id)).length;
    return {
      slug: module.slug,
      icon: module.icon,
      name: module.name,
      completed: moduleCompleted,
      total: moduleLevels.length,
      recovered: moduleLevels.length > 0 && moduleCompleted === moduleLevels.length,
    };
  });

  const moduleAchievement = (slug: string, id: string, icon: string, title: string, description: string): Achievement => {
    const fragment = fragments.find((item) => item.slug === slug);
    const current = fragment?.completed || 0;
    const target = fragment?.total || 5;
    return {
      id,
      icon,
      category: "Territorio",
      title,
      description,
      unlocked: Boolean(fragment?.recovered),
      current,
      target,
      progressLabel: `${current}/${target} misiones`,
    };
  };

  const totalLevels = levels.length;
  const achievements: Achievement[] = [
    {
      id: "primer-paso",
      icon: "🚩",
      category: "Exploración",
      title: "Primer paso",
      description: "Completa tu primera misión de POOQuest.",
      unlocked: completed >= 1,
      current: Math.min(completed, 1),
      target: 1,
      progressLabel: completed >= 1 ? "Primera misión completada" : "Completa 1 misión",
    },
    {
      id: "dominio-perfecto",
      icon: "✨",
      category: "Dominio",
      title: "Dominio perfecto",
      description: "Consigue ★★★ en una misión sin errores ni pistas.",
      unlocked: perfect >= 1,
      current: Math.min(perfect, 1),
      target: 1,
      progressLabel: perfect >= 1 ? "Misión perfecta conseguida" : "Consigue ★★★",
    },
    {
      id: "jefe-derrotado",
      icon: "⚔️",
      category: "Java",
      title: "Primer jefe derrotado",
      description: "Supera tu primer Jefe Java con una ejecución correcta.",
      unlocked: passedBosses >= 1,
      current: Math.min(passedBosses, 1),
      target: 1,
      progressLabel: passedBosses >= 1 ? "Primer jefe superado" : "Derrota 1 jefe",
    },
    {
      id: "explorador-constante",
      icon: "🧭",
      category: "Exploración",
      title: "Explorador constante",
      description: "Completa cinco misiones durante tu recorrido.",
      unlocked: completed >= 5,
      current: Math.min(completed, 5),
      target: 5,
      progressLabel: `${Math.min(completed, 5)}/5 misiones`,
    },
    moduleAchievement("abstraccion", "arquitecto-abstraccion", "◇", "Arquitecto de abstracción", "Recupera por completo el territorio de Abstracción."),
    moduleAchievement("encapsulamiento", "guardian-datos", "⬡", "Guardián de datos", "Completa las cinco misiones de Encapsulamiento."),
    moduleAchievement("herencia", "maestro-linaje", "⌘", "Maestro del linaje", "Completa las cinco misiones de Herencia."),
    moduleAchievement("polimorfismo", "maestro-formas", "✦", "Maestro de las formas", "Completa las cinco misiones de Polimorfismo."),
    {
      id: "cinco-perfectas",
      icon: "🌟",
      category: "Dominio",
      title: "Precisión avanzada",
      description: "Consigue ★★★ en cinco misiones diferentes.",
      unlocked: perfect >= 5,
      current: Math.min(perfect, 5),
      target: 5,
      progressLabel: `${Math.min(perfect, 5)}/5 misiones perfectas`,
    },
    {
      id: "maestro-poo",
      icon: "🏆",
      category: "Aventura",
      title: "Maestro POO",
      description: "Completa todas las misiones y derrota los cuatro Jefes Java.",
      unlocked: totalLevels > 0 && completed === totalLevels && passedBosses >= 4,
      current: Math.min(completed + Math.min(passedBosses, 4), totalLevels + 4),
      target: totalLevels + 4,
      progressLabel: `${completed}/${totalLevels} misiones · ${Math.min(passedBosses, 4)}/4 jefes`,
    },
  ];

  return {
    achievements,
    fragments,
    unlockedCount: achievements.filter((achievement) => achievement.unlocked).length,
    completed,
    perfect,
  };
}

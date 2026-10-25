"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export type CelebrationKind = "mission" | "unlock" | "boss" | "territory" | "finish";

type CelebrationCopy = {
  icon: string;
  eyebrow: string;
  title: string;
  message: string;
};

const copy: Record<CelebrationKind, CelebrationCopy> = {
  mission: {
    icon: "✓",
    eyebrow: "Misión superada",
    title: "¡Buen trabajo!",
    message: "El progreso quedó guardado. La siguiente misión ya está disponible.",
  },
  unlock: {
    icon: "⚡",
    eyebrow: "Acceso concedido",
    title: "Jefe Java desbloqueado",
    message: "Ya dominaste la misión. Ahora demuestra el concepto escribiendo código real.",
  },
  boss: {
    icon: "★",
    eyebrow: "Jefe derrotado",
    title: "¡Código validado!",
    message: "La salida coincide con el objetivo y el reto quedó superado.",
  },
  territory: {
    icon: "◇",
    eyebrow: "Territorio superado",
    title: "¡Pilar completado!",
    message: "Terminaste todas las misiones de este territorio y recuperaste un Fragmento del Núcleo. El siguiente ya está abierto.",
  },
  finish: {
    icon: "✦",
    eyebrow: "Aventura completada",
    title: "¡Dominaste los cuatro pilares!",
    message: "Recuperaste los cuatro Fragmentos del Núcleo y completaste el recorrido principal de POOQuest. Puedes volver a cualquier misión para perfeccionar tu dominio.",
  },
};

const particlePositions = [
  [8, 18], [18, 72], [30, 34], [42, 80], [53, 15], [64, 62], [76, 27], [89, 74],
  [13, 46], [37, 12], [58, 88], [82, 48],
];

export function Celebration({ kind, onDone }: { kind: CelebrationKind | null; onDone: () => void }) {
  useEffect(() => {
    if (!kind) return;
    const timeout = window.setTimeout(onDone, kind === "finish" || kind === "territory" ? 4200 : 3000);
    return () => window.clearTimeout(timeout);
  }, [kind, onDone]);

  return (
    <AnimatePresence>
      {kind && (
        <motion.div
          className={`celebration-toast ${kind}`}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          role="status"
          aria-live="polite"
          onClick={onDone}
        >
          <div className="celebration-particles" aria-hidden="true">
            {particlePositions.map(([left, top], index) => (
              <motion.i
                key={`${left}-${top}`}
                style={{ left: `${left}%`, top: `${top}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.3, 1.15, 0.5], y: [0, -10, -18] }}
                transition={{ duration: 1.6, delay: index * 0.045, repeat: 1, repeatDelay: 0.1 }}
              />
            ))}
          </div>
          <motion.div
            className="celebration-icon"
            initial={{ rotate: -12, scale: 0.7 }}
            animate={{ rotate: [0, 7, -4, 0], scale: [0.7, 1.12, 1] }}
            transition={{ duration: 0.65 }}
          >
            {copy[kind].icon}
          </motion.div>
          <div className="celebration-copy">
            <small>{copy[kind].eyebrow}</small>
            <strong>{copy[kind].title}</strong>
            <p>{copy[kind].message}</p>
          </div>
          <span className="celebration-dismiss">Toca para cerrar</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type CoachMode = "objetivo" | "pasos" | "pista";

export function P00Avatar({ small = false }: { small?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={small ? "v7-p00-avatar small" : "v7-p00-avatar"}
      aria-hidden="true"
      animate={reduced ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 92 92" fill="none" focusable="false">
        <path d="M27 8 19 22m46-14 8 14" stroke="#6AE0C4" strokeWidth="4" strokeLinecap="round"/>
        <path d="M45 10v12" stroke="#F3CD84" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="45" cy="8" r="5" fill="#F3CD84"/>
        <rect x="9" y="20" width="74" height="61" rx="24" fill="#152C38" stroke="#87D8C3" strokeWidth="3"/>
        <rect x="16" y="28" width="60" height="40" rx="15" fill="#0A1724"/>
        <rect x="25" y="37" width="16" height="12" rx="6" fill="#89F5DD"/>
        <rect x="51" y="37" width="16" height="12" rx="6" fill="#89F5DD"/>
        <path d="M35 58c6 7 15 7 21 0" stroke="#F3CD84" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="8" cy="49" r="5" fill="#F3CD84"/>
        <circle cx="84" cy="49" r="5" fill="#F3CD84"/>
      </svg>
    </motion.span>
  );
}

/**
 * Ayuda contextual. Abrir "cómo empezar" no penaliza; revelar la pista
 * específica notifica al juego para conservar las reglas de estrellas.
 */
export function P00Coach({
  title = "P00 te acompaña",
  instruction,
  steps,
  hint,
  onHintUsed,
  outcome,
  compact = false,
}: {
  title?: string;
  instruction: string;
  steps: string;
  hint?: string;
  onHintUsed?: () => void;
  outcome?: string | null;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<CoachMode>("objetivo");
  const [hasSeenHint, setHasSeenHint] = useState(false);
  const reduced = useReducedMotion();
  const message = mode === "pasos" ? steps : mode === "pista" ? hint || steps : instruction;

  function revealHint() {
    if (!hasSeenHint) {
      onHintUsed?.();
      setHasSeenHint(true);
    }
    setMode("pista");
  }

  return (
    <section className={compact ? "v7-p00-coach compact" : "v7-p00-coach"} aria-label="Ayuda del asistente P00">
      <div className="v7-p00-header">
        <P00Avatar small={compact}/>
        <div>
          <span className="v7-eyebrow">GUÍA DE CAMPO · P00</span>
          <strong>{title}</strong>
          <small>Estoy aquí para ayudarte a comprender, no para darte todas las respuestas.</small>
        </div>
      </div>
      <div className="v7-coach-bubble" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={mode} initial={reduced ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}>{message}</motion.p>
        </AnimatePresence>
        {outcome && <p className="v7-coach-outcome"><strong>Para revisar:</strong> {outcome}</p>}
      </div>
      <div className="v7-coach-actions" aria-label="Opciones de ayuda">
        <button type="button" className={mode === "objetivo" ? "active" : ""} aria-pressed={mode === "objetivo"} onClick={() => setMode("objetivo")}>Objetivo</button>
        <button type="button" className={mode === "pasos" ? "active" : ""} aria-pressed={mode === "pasos"} onClick={() => setMode("pasos")}>Cómo empezar</button>
        {hint && <button type="button" className={mode === "pista" ? "active" : ""} aria-pressed={mode === "pista"} onClick={revealHint}>Pista específica</button>}
      </div>
      {hint && <p className="v7-coach-note">{onHintUsed ? "La pista específica cuenta para la valoración de estrellas; «Cómo empezar» es gratis." : "Puedes consultar las pistas cuando lo necesites."}</p>}
    </section>
  );
}

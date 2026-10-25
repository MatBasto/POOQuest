"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const steps = [
  {
    eyebrow: "Bienvenido a POOQuest",
    title: "Tu misión es restaurar los cuatro pilares",
    text: "Cada territorio representa un pilar de Programación Orientada a Objetos. Avanza superando misiones y retos Java.",
    visual: "◇  ⬡  ⌘  ✦",
  },
  {
    eyebrow: "Cómo avanzar",
    title: "Descubre → juega → programa",
    text: "Cada misión empieza con una explicación breve, continúa con una actividad interactiva y algunos niveles terminan con un jefe Java.",
    visual: "01  →  02  →  BOSS",
  },
  {
    eyebrow: "Tu progreso importa",
    title: "Gana XP y abre nuevos caminos",
    text: "La experiencia desbloquea nuevas misiones. Si ya superaste una actividad, puedes repetirla sin recibir XP duplicado.",
    visual: "⚡ XP   ★ LOGROS   🔓 RUTAS",
  },
  {
    eyebrow: "P00 te acompaña",
    title: "No tienes que adivinar qué hacer",
    text: "P00 aparecerá con pistas cortas. Si quieres consultar las reglas otra vez, usa “Cómo jugar” en el menú.",
    visual: "P00  >  SISTEMA LISTO",
  },
];

export function AdventureOnboarding({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = window.localStorage.getItem("pooquest:onboarding:v2");
    if (!seen) setOpen(true);
  }, []);

  function finish() {
    window.localStorage.setItem("pooquest:onboarding:v2", "seen");
    setOpen(false);
    setStep(0);
  }

  if (!open) return null;
  const current = steps[step];

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Introducción a POOQuest">
      <div className="onboarding-card">
        <div className="onboarding-orb" aria-hidden="true">P00</div>
        <div className="kicker">{current.eyebrow}</div>
        <h2>{step === 0 ? `${current.title}, ${name}` : current.title}</h2>
        <p className="subtitle">{current.text}</p>
        <div className="onboarding-visual">{current.visual}</div>
        <div className="onboarding-dots" aria-label={`Paso ${step + 1} de ${steps.length}`}>
          {steps.map((_, index) => <span key={index} className={index === step ? "active" : ""} />)}
        </div>
        <div className="space onboarding-actions">
          <button className="btn ghost" onClick={finish}>Omitir</button>
          <div className="row">
            {step > 0 && <button className="btn secondary" onClick={() => setStep(step - 1)}>Atrás</button>}
            {step < steps.length - 1 ? (
              <button className="btn" onClick={() => setStep(step + 1)}>Siguiente</button>
            ) : (
              <button className="btn" onClick={finish}>Comenzar aventura</button>
            )}
          </div>
        </div>
        <Link className="onboarding-help" href="/how-to-play" onClick={finish}>Ver guía completa</Link>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Challenge } from "@/lib/types";
import { playGameSound, primeSound } from "@/lib/sound";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type ExecuteResult = { output?: string; status?: string; passed?: boolean; error?: string };

export function CodeChallenge({
  challenge,
  initiallyPassed = false,
  onPassed,
}: {
  challenge: Challenge;
  initiallyPassed?: boolean;
  onPassed?: () => void;
}) {
  const router = useRouter();
  const [code, setCode] = useState(challenge.starter_code);
  const [out, setOut] = useState(initiallyPassed
    ? "Jefe derrotado anteriormente. Puedes modificar el código y volver a ejecutarlo como repaso."
    : "Consola preparada. Ejecuta cuando tu solución esté lista.");
  const [status, setStatus] = useState(initiallyPassed ? "Superado" : "Listo");
  const [loading, setLoading] = useState(false);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [hasEverPassed, setHasEverPassed] = useState(initiallyPassed);
  const [rewardGranted, setRewardGranted] = useState(false);

  async function run() {
    primeSound();
    setLoading(true);
    setOut("Compilando y ejecutando en Judge0...");
    setStatus("Procesando");
    setPassed(null);
    setRewardGranted(false);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, sourceCode: code }),
      });
      const data = await response.json() as ExecuteResult;
      if (!response.ok) throw new Error(data.error || "Error de ejecución");
      const didPass = Boolean(data.passed);
      const firstPass = didPass && !hasEverPassed;
      setOut(data.output || data.status || "Sin salida");
      setStatus(data.status || "Procesado");
      setPassed(didPass);
      if (didPass) {
        setRewardGranted(firstPass);
        setHasEverPassed(true);
        if (firstPass) onPassed?.();
        else playGameSound("review");
      } else {
        playGameSound("error");
      }
      router.refresh();
    } catch (error: unknown) {
      playGameSound("error");
      setOut(error instanceof Error ? error.message : "No fue posible ejecutar el código.");
      setStatus("Error de servicio");
      setPassed(false);
    } finally {
      setLoading(false);
    }
  }

  const compileError = /compilation|compile|error/i.test(status) && !passed;

  return (
    <div className="boss-arena">
      <div className="boss-banner">
        <div className="boss-skull">BOSS</div>
        <div><div className="kicker">Jefe de territorio</div><h2>{challenge.title}</h2><p>{challenge.statement}</p></div>
        <div className="boss-reward"><small>RECOMPENSA</small><strong>+{challenge.xp_reward} XP</strong></div>
      </div>

      {hasEverPassed && passed === null && (
        <div className="boss-review-notice">
          <span>↻</span>
          <div><strong>Modo repaso disponible</strong><p>Ya superaste este jefe. Puedes volver a programar y ejecutar; los nuevos intentos no duplican la XP.</p></div>
        </div>
      )}

      <div className="boss-objective"><span>OBJETIVO DE SALIDA</span><code>{challenge.expected_output}</code></div>

      <div className="editor-shell">
        <div className="editor-toolbar"><div><span /><span /><span /></div><strong>Main.java</strong><small>{status}</small></div>
        <Editor
          height="390px"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, padding: { top: 14 }, scrollBeyondLastLine: false }}
        />
      </div>

      <button className="btn boss-run" onClick={run} disabled={loading}>{loading ? "ANALIZANDO MISIÓN..." : hasEverPassed ? "↻ EJECUTAR COMO REPASO" : "▶ EJECUTAR CÓDIGO JAVA"}</button>
      <div className="console-shell"><div className="console-title"><span>CONSOLA</span><small>{status}</small></div><div className="console">{out}</div></div>

      {passed !== null && (
        <div className={`boss-result ${passed ? "success" : "failure"}`}>
          <div className="boss-result-icon">{passed ? "★" : "!"}</div>
          <div>
            <strong>{passed ? rewardGranted ? "JEFE DERROTADO" : "REPASO SUPERADO" : compileError ? "EL CÓDIGO NO COMPILA" : "MISIÓN INCOMPLETA"}</strong>
            <p>{passed ? rewardGranted ? "La salida coincide con la esperada. El Núcleo recuperó otro fragmento." : "La solución sigue siendo correcta. Tu progreso se conserva y no se añade XP duplicada." : compileError ? "Revisa el error mostrado en la consola, corrige el código y vuelve a ejecutar." : "El programa se ejecutó, pero la salida todavía no coincide con el objetivo."}</p>
          </div>
          {passed && rewardGranted && <span className="xp-burst">+{challenge.xp_reward} XP</span>}
          {passed && !rewardGranted && <span className="badge">Repaso · sin XP extra</span>}
        </div>
      )}
    </div>
  );
}

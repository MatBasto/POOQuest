"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Challenge } from "@/lib/types";
import { playGameSound, primeSound } from "@/lib/sound";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type ExecuteResult = { output?: string; status?: string; statusId?: number; passed?: boolean; error?: string; feedback?: string };

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

  const [graderFeedback, setGraderFeedback] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<"compile" | "runtime" | "output" | "service" | "session" | "input">("output");

  async function run() {
    primeSound();
    setLoading(true);
    setOut("Compilando y ejecutando en Judge0...");
    setStatus("Procesando");
    setPassed(null);
    setRewardGranted(false);
    setGraderFeedback(null);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, sourceCode: code }),
      });
      const data = await response.json() as ExecuteResult;
      if (!response.ok) {
        setExecutionState(response.status === 401 ? "session" : response.status === 400 ? "input" : "service");
        setOut(response.status === 400 ? data.error || "Revisa el código enviado." : "No se pudo completar la solicitud.");
        setStatus("Ejecución no completada");
        setPassed(false);
        playGameSound("error");
        return;
      }
      setExecutionState(data.statusId === 6 ? "compile" : data.statusId === 3 ? "output" : "runtime");
      const didPass = Boolean(data.passed);
      const firstPass = didPass && !hasEverPassed;
      setOut(data.output || data.status || "Sin salida");
      setStatus(data.status || "Procesado");
      setPassed(didPass);
      setGraderFeedback(data.feedback || null);
      if (didPass) {
        setRewardGranted(firstPass);
        setHasEverPassed(true);
        if (firstPass) onPassed?.();
        else playGameSound("review");
      } else {
        playGameSound("error");
      }
      router.refresh();
    } catch {
      playGameSound("error");
      setExecutionState("service");
      setOut("No se pudo conectar con el servicio de ejecución.");
      setStatus("Error de servicio");
      setPassed(false);
    } finally {
      setLoading(false);
    }
  }

  const recovery = {
    compile: ["El código no compila", "Busca el primer error en la consola, revisa la línea indicada y vuelve a ejecutar."],
    runtime: ["La ejecución no terminó correctamente", "Consulta la consola y revisa la operación que provocó el error o el bucle que no termina."],
    output: ["La salida no coincide", "Compara la consola con el objetivo de salida. Revisa los valores, espacios y saltos de línea."],
    service: ["No pudimos ejecutar Java", "Tu código sigue en el editor. Comprueba tu conexión y vuelve a ejecutar."],
    session: ["Tu sesión ya no está activa", "Copia tu código antes de salir, vuelve a iniciar sesión y pega tu solución para ejecutarla."],
    input: ["Revisa el código enviado", "Consulta la consola. Escribe un programa válido que no supere los 20.000 caracteres y vuelve a ejecutar."],
  } as const;

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

      <p className="exercise-guide"><strong>Reto Java</strong><span>Escribe tu solución en el editor, pulsa el botón de ejecución y compara la consola con la salida esperada. Si estás repasando, usa «Ejecutar como repaso».</span></p>
      <div className="boss-objective"><span>OBJETIVO DE SALIDA</span><code>{challenge.expected_output}</code></div>

      <div className="editor-shell">
        <div className="editor-toolbar"><div><span /><span /><span /></div><strong>Main.java</strong><small>{status}</small></div>
        <Editor
          height="390px"
          defaultLanguage="java"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{ ariaLabel: "Editor de código Java", fontSize: 14, minimap: { enabled: false }, automaticLayout: true, padding: { top: 14 }, scrollBeyondLastLine: false }}
        />
      </div>

      <button className="btn boss-run" onClick={run} disabled={loading || !code.trim()}>{loading ? "ANALIZANDO MISIÓN..." : hasEverPassed ? "↻ EJECUTAR COMO REPASO" : "▶ EJECUTAR CÓDIGO JAVA"}</button>
      <div className="console-shell"><div className="console-title"><span>CONSOLA</span><small>{status}</small></div><div className="console">{out}</div></div>

      <div role="status" aria-live="polite">
      {passed !== null && (
        <div className={`boss-result ${passed ? "success" : "failure"}`}>
          <div className="boss-result-icon">{passed ? "★" : "!"}</div>
          <div>
            <strong>{passed ? rewardGranted ? "JEFE DERROTADO" : "REPASO SUPERADO" : recovery[executionState][0]}</strong>
            <p>{passed ? rewardGranted ? "Tu salida y las pruebas de comportamiento de POO son correctas. ¡Jefe superado!" : "La solución sigue siendo correcta. Tu progreso se conserva y no se añade XP duplicada." : graderFeedback || recovery[executionState][1]}</p>
          </div>
          {passed && rewardGranted && <span className="xp-burst">+{challenge.xp_reward} XP</span>}
          {passed && !rewardGranted && <span className="badge">Repaso · sin XP extra</span>}
        </div>
      )}
      </div>
    </div>
  );
}

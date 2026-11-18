"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { missionGames } from "@/lib/game";
import { playGameSound, primeSound } from "@/lib/sound";
import type { Activity } from "@/lib/types";

const instructions = {
  select: ["Selección múltiple", "Marca todas las opciones correctas. Puedes desmarcarlas antes de pulsar Comprobar."],
  classify: ["Clasificación", "Elige un grupo para cada tarjeta. Puedes cambiarlo antes de pulsar Comprobar."],
  sequence: ["Ordenar elementos", "Pulsa las tarjetas en el orden que consideres correcto. Puedes deshacer el último paso antes de pulsar Comprobar."],
  duel: ["Selección única", "Elige una sola respuesta. Se comprueba en cuanto la seleccionas."],
} as const;

function ExerciseGuide({ kind }: { kind: keyof typeof instructions }) {
  const [label, instruction] = instructions[kind];
  return <p className="exercise-guide"><strong>{label}</strong><span>{instruction}</span></p>;
}

type ActivityResult = {
  correct: boolean;
  feedback: string;
  xp_awarded: number;
  review?: boolean;
  stars?: number;
  best_stars?: number;
  improved?: boolean;
};

type ScoreResult = {
  stars: number;
  best_stars: number;
  improved: boolean;
};

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

export function MissionActivity({
  activity,
  levelId,
  levelSlug,
  initiallyCompleted = false,
  initialBestStars = 0,
  onCompleted,
}: {
  activity: Activity;
  levelId: number;
  levelSlug: string;
  initiallyCompleted?: boolean;
  initialBestStars?: number;
  onCompleted?: () => void;
}) {
  const router = useRouter();
  const game = missionGames[levelSlug];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivityResult | null>(null);
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [reviewing, setReviewing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [sequence, setSequence] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [bestStars, setBestStars] = useState(initialBestStars);

  const correctOption = useMemo(
    () => activity.activity_options.find((option) => option.is_correct),
    [activity.activity_options]
  );

  const canInteract = !loading && (!completed || reviewing);

  function clearBoard() {
    setSelected([]);
    setAssigned({});
    setSequence([]);
    setMessage("");
    setResult(null);
  }

  function startReview() {
    clearBoard();
    setShowHint(false);
    setMistakes(0);
    setHintsUsed(0);
    setReviewing(true);
  }

  async function saveScore() {
    const { data, error } = await createClient().rpc("record_level_score", {
      p_level_id: levelId,
      p_errors: mistakes,
      p_hints: hintsUsed,
    });
    if (error) {
      console.warn("No se pudo guardar la puntuación de estrellas:", error.message);
      return null;
    }
    const score = data as ScoreResult;
    setBestStars(score.best_stars);
    return score;
  }

  async function finishReview() {
    primeSound();
    playGameSound("review");
    setLoading(true);
    const score = await saveScore();
    setLoading(false);
    setMessage("");
    setReviewing(false);
    setResult({
      correct: true,
      feedback: score?.improved
        ? "Repaso completado y nuevo récord de dominio. Tu XP no cambia, pero mejoraste tu puntuación de estrellas."
        : "Repaso completado. La misión se resolvió correctamente y tu XP, progreso y recompensas permanecen sin cambios.",
      xp_awarded: 0,
      review: true,
      stars: score?.stars,
      best_stars: score?.best_stars,
      improved: score?.improved,
    });
  }

  async function awardCompletion() {
    if (!correctOption) {
      setMessage("No se encontró la opción correcta configurada para esta actividad.");
      return;
    }
    setLoading(true);
    setResult(null);
    const { data, error } = await createClient().rpc("submit_activity", {
      p_activity_id: activity.id,
      p_option_id: correctOption.id,
    });
    if (error) {
      playGameSound("error");
      setResult({ correct: false, feedback: "No se pudo guardar el intento. Comprueba tu conexión y vuelve a intentarlo.", xp_awarded: 0 });
    } else {
      const parsed = data as ActivityResult;
      if (parsed.correct) {
        const score = await saveScore();
        setResult({ ...parsed, stars: score?.stars, best_stars: score?.best_stars, improved: score?.improved });
        setCompleted(true);
        setReviewing(false);
        onCompleted?.();
        router.refresh();
      } else {
        setResult(parsed);
      }
    }
    setLoading(false);
  }

  function completeCorrectly() {
    primeSound();
    if (completed || reviewing) {
      void finishReview();
      return;
    }
    void awardCompletion();
  }

  function fail(text: string) {
    primeSound();
    playGameSound("error");
    setMistakes((value) => value + 1);
    setMessage(text);
    setResult(null);
  }

  function toggleHint() {
    if (!showHint) setHintsUsed((value) => Math.max(value, 1));
    setShowHint((value) => !value);
  }

  function validateSelect() {
    if (!game || game.kind !== "select") return;
    const expected = game.items.filter((item) => item.correct).map((item) => item.id);
    if (sameSet(selected, expected)) completeCorrectly();
    else fail("El escáner todavía detecta una selección incorrecta. Revisa qué elementos sí pertenecen al concepto.");
  }

  function validateClassify() {
    if (!game || game.kind !== "classify") return;
    const correct = game.items.every((item) => assigned[item.id] === item.group);
    if (correct) completeCorrectly();
    else fail("Algunas piezas están en el grupo equivocado. Puedes cambiar el grupo de una tarjeta y volver a comprobar. Si lo necesitas, pide una pista.");
  }

  function validateSequence() {
    if (!game || game.kind !== "sequence") return;
    if (sequence.join("|") === game.order.join("|")) completeCorrectly();
    else fail("La secuencia no activa el sistema. Piensa qué paso debe ocurrir primero. Usa Deshacer último paso o Reiniciar orden para corregirla.");
  }

  function chooseDuel(id: string) {
    if (!game || game.kind !== "duel") return;
    primeSound();
    const choice = game.choices.find((item) => item.id === id);
    if (!choice) return;
    if (choice.correct) {
      setMessage(choice.response);
      completeCorrectly();
    } else {
      fail(choice.response);
    }
  }

  async function answerFallback(optionId: number, isCorrect: boolean) {
    primeSound();
    setMessage("");

    if (completed || reviewing) {
      if (isCorrect) void finishReview();
      else fail(activity.feedback_incorrect);
      return;
    }

    setLoading(true);
    setResult(null);
    const { data, error } = await createClient().rpc("submit_activity", {
      p_activity_id: activity.id,
      p_option_id: optionId,
    });
    if (error) {
      playGameSound("error");
      setResult({ correct: false, feedback: "No se pudo guardar el intento. Comprueba tu conexión y vuelve a intentarlo.", xp_awarded: 0 });
    } else {
      const parsed = data as ActivityResult;
      if (parsed.correct) {
        const score = await saveScore();
        setResult({ ...parsed, stars: score?.stars, best_stars: score?.best_stars, improved: score?.improved });
        setCompleted(true);
        onCompleted?.();
        router.refresh();
      } else {
        setMistakes((value) => value + 1);
        setResult(parsed);
        playGameSound("error");
      }
    }
    setLoading(false);
  }

  if (!game) {
    return (
      <div className="mission-panel">
        <div className="mission-header">
          <div>
            <div className="kicker">Duelo de conocimiento</div>
            <h2>{activity.question}</h2>
          </div>
          <span className={`mission-status ${completed ? "complete" : ""} ${reviewing ? "review" : ""}`}>
            {reviewing ? "↻ Repasando" : completed ? "✓ Superada" : "En curso"}
          </span>
        </div>

        {reviewing && <ReviewNotice />}\n        <ExerciseGuide kind="duel" />

        <div className="mission-choice-grid">
          {activity.activity_options.map((option) => (
            <button
              key={option.id}
              className="mission-choice"
              disabled={!canInteract}
              onClick={() => void answerFallback(option.id, Boolean(option.is_correct))}
            >
              {option.option_text}
            </button>
          ))}
        </div>

        <div role="status">{message && !result && <div className="mission-alert">{message}</div>}</div>
        {result && (
          <MissionFeedback
            result={result}
            completed={completed}
            onReset={clearBoard}
            onReview={completed ? startReview : undefined}
          />
        )}
        {completed && !reviewing && !result && <CompletedReviewBar stars={bestStars} onReview={startReview} />}
      </div>
    );
  }

  return (
    <div className="mission-panel">
      <div className="mission-header">
        <div>
          <div className="kicker">Misión interactiva</div>
          <h2>{game.title}</h2>
          <p className="subtitle">{game.story}</p>
        </div>
        <span className={`mission-status ${completed ? "complete" : ""} ${reviewing ? "review" : ""}`}>
          {reviewing ? "↻ Repasando" : completed ? "✓ Superada" : "En curso"}
        </span>
      </div>

      {reviewing && <ReviewNotice />}

      <ExerciseGuide kind={game.kind} />
      <div className="p00-message">
        <div className="p00-avatar">P00</div>
        <div>
          <strong>{game.instruction}</strong>
          {showHint && <p>{game.hint}</p>}
        </div>
        <button className="btn tiny secondary" aria-expanded={showHint} disabled={!canInteract} onClick={toggleHint}>
          {showHint ? "Ocultar pista" : "Pedir pista"}
        </button>
      </div>

      {game.kind === "select" && (
        <>
          <div className="scan-grid">
            {game.items.map((item) => {
              const active = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  className={`scan-card ${active ? "active" : ""}`} aria-pressed={active}
                  disabled={!canInteract}
                  onClick={() => {
                    setMessage("");
                    setSelected(active ? selected.filter((id) => id !== item.id) : [...selected, item.id]);
                  }}
                >
                  <span className="scan-light" />
                  <strong>{item.label}</strong>
                  {item.detail && <small>{item.detail}</small>}
                </button>
              );
            })}
          </div>
          {canInteract && <button className="btn mission-submit" disabled={loading || selected.length === 0} onClick={validateSelect}>Comprobar</button>}
        </>
      )}

      {game.kind === "classify" && (
        <>
          <div className="classify-grid">
            {game.items.map((item) => (
              <div className="classify-card" key={item.id}>
                <strong>{item.label}</strong>
                <div className="classify-actions">
                  {game.groups.map((group) => (
                    <button
                      key={group}
                      disabled={!canInteract}
                      className={assigned[item.id] === group ? "selected" : ""}
                      aria-pressed={assigned[item.id] === group} aria-label={`${item.label}: ${group}`}
                      onClick={() => {
                        setMessage("");
                        setAssigned({ ...assigned, [item.id]: group });
                      }}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {canInteract && <button className="btn mission-submit" disabled={loading || game.items.some((item) => !assigned[item.id])} onClick={validateClassify}>Comprobar</button>}
        </>
      )}

      {game.kind === "sequence" && (
        <>
          <div className="sequence-zone">
            <div className="sequence-output">
              {sequence.length ? sequence.map((id, index) => {
                const item = game.items.find((entry) => entry.id === id);
                return <span key={id}><b>{index + 1}</b>{item?.label}</span>;
              }) : <div className="muted">Selecciona las etapas para construir la secuencia.</div>}
            </div>
            <div className="sequence-options">
              {game.items.filter((item) => !sequence.includes(item.id)).map((item) => (
                <button key={item.id} disabled={!canInteract} onClick={() => { setMessage(""); setSequence([...sequence, item.id]); }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {canInteract && <div className="row mission-actions"><button className="btn secondary" onClick={() => { setSequence([]); setMessage(""); }} disabled={!sequence.length}>Reiniciar orden</button><button className="btn secondary" disabled={!sequence.length} onClick={() => { setSequence(sequence.slice(0, -1)); setMessage(""); }}>Deshacer último paso</button><button className="btn" disabled={loading || sequence.length !== game.items.length} onClick={validateSequence}>Comprobar</button></div>}
        </>
      )}

      {game.kind === "duel" && (
        <div className="mission-choice-grid">
          {game.choices.map((choice) => (
            <button key={choice.id} className="mission-choice" disabled={!canInteract} onClick={() => chooseDuel(choice.id)}>
              {choice.label}
            </button>
          ))}
        </div>
      )}

      <div role="status">{message && !result && <div className="mission-alert">{message}</div>}</div>
      {result && (
        <MissionFeedback
          result={result}
          completed={completed}
          onReset={clearBoard}
          onReview={completed ? startReview : undefined}
        />
      )}
      {completed && !reviewing && !result && <CompletedReviewBar stars={bestStars} onReview={startReview} />}
    </div>
  );
}

function ReviewNotice() {
  return (
    <div className="review-mode-notice">
      <span>↻</span>
      <div>
        <strong>Modo repaso activo</strong>
        <p>Puedes resolver la misión desde cero. Este intento no suma ni resta XP, no cambia tu progreso y no duplica recompensas.</p>
      </div>
    </div>
  );
}

function CompletedReviewBar({ stars, onReview }: { stars: number; onReview: () => void }) {
  return (
    <div className="mission-feedback success review-ready">
      <div>
        <strong>✓ Misión ya superada</strong>
        <p>Tu progreso está guardado. Puedes volver a jugarla para mejorar tu dominio.</p>
        <StarRating value={stars} label={stars ? "Mejor puntuación" : "Puntuación pendiente"} />
      </div>
      <button className="btn secondary review-button" onClick={onReview}>↻ Repasar misión</button>
    </div>
  );
}

function MissionFeedback({
  result,
  completed,
  onReset,
  onReview,
}: {
  result: ActivityResult;
  completed: boolean;
  onReset: () => void;
  onReview?: () => void;
}) {
  return (
    <div className={`mission-feedback ${result.correct ? "success" : "error"}`}>
      <div role="status">
        <strong>{result.review ? "✓ REPASO COMPLETADO" : result.correct ? "✓ MISIÓN COMPLETADA" : "✕ MISIÓN INCOMPLETA"}</strong>
        <p>{result.feedback}</p>
      </div>
      {result.correct && result.stars && <StarRating value={result.stars} label={result.improved ? "Nuevo récord" : "Resultado de esta partida"} />}
      {result.xp_awarded > 0 && <span className="xp-burst">+{result.xp_awarded} XP</span>}
      {result.correct && result.xp_awarded === 0 && !result.review && <span className="badge">XP ya obtenida</span>}
      {!result.correct && !completed && <button className="btn secondary" onClick={onReset}>Intentar otra vez</button>}
      {result.correct && onReview && <button className="btn secondary review-button" onClick={onReview}>↻ Repasar otra vez</button>}
    </div>
  );
}

function StarRating({ value, label }: { value: number; label: string }) {
  return (
    <div className="mission-star-result" aria-label={`${label}: ${value} de 3 estrellas`}>
      <small>{label}</small>
      <span>{[1, 2, 3].map((star) => <b className={star <= value ? "earned" : ""} key={star}>★</b>)}</span>
    </div>
  );
}

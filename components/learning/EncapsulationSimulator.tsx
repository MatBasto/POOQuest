"use client";

import { useState } from "react";

/**
 * Simulación pedagógica local; no altera el progreso del estudiante.
 * Ayuda a comprobar el significado de encapsulamiento antes del reto Java.
 */
export function EncapsulationSimulator() {
  const [saldo, setSaldo] = useState(100);
  const [notice, setNotice] = useState("El objeto comienza con un saldo protegido de 100.");
  const [lastAction, setLastAction] = useState("new Cuenta(100)");

  function deposit(amount: number) {
    setLastAction("cuenta.consignar(" + amount + ")");
    if (amount <= 0) {
      setNotice("Operación rechazada: el método comprueba el valor y no cambia el atributo privado.");
      return;
    }
    setSaldo((current) => current + amount);
    setNotice("Operación aceptada: consignar() validó la entrada y actualizó el saldo.");
  }

  return (
    <section className="encapsulation-lab" aria-labelledby="encapsulation-title">
      <div className="kicker">Laboratorio interactivo · Encapsulamiento</div>
      <h3 id="encapsulation-title">Protege el saldo de una cuenta</h3>
      <p>Experimenta con métodos públicos y observa cómo se protege el atributo <code>private saldo</code>. No necesitas programar todavía.</p>
      <div className="encapsulation-lab-state">
        <div>
          <small>Estado privado del objeto</small>
          <strong aria-label={"Saldo actual " + saldo}>{saldo.toFixed(1)}</strong>
        </div>
        <code>private double saldo;</code>
      </div>
      <div className="encapsulation-lab-actions" aria-label="Métodos disponibles">
        <button type="button" className="btn" onClick={() => deposit(25)}>consignar(25)</button>
        <button type="button" className="btn btn-outline" onClick={() => deposit(-50)}>consignar(-50)</button>
        <button type="button" className="btn btn-outline" onClick={() => {setSaldo(100);setLastAction("new Cuenta(100)");setNotice("Estado inicial restaurado.");}}>Reiniciar</button>
      </div>
      <div className="encapsulation-lab-feedback" role="status" aria-live="polite">
        <strong>{lastAction}</strong>
        <span>{notice}</span>
      </div>
      <p className="encapsulation-lab-tip">Fíjate: el código exterior no modifica directamente el saldo; solicita un cambio mediante <code>consignar()</code>, que puede aceptarlo o rechazarlo.</p>
    </section>
  );
}

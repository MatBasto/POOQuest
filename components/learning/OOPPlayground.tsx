"use client";

import { useState } from "react";
import { ConceptDiagram } from "./ConceptDiagram";

export type PlaygroundKind = "abstraction" | "inheritance" | "polymorphism";

/** Simulación conceptual de POO. No sustituye la ejecución real de Java ni suma XP. */
export function OOPPlayground({ kind }: { kind: PlaygroundKind }) {
  const [books, setBooks] = useState<string[]>([]);
  const [animal, setAnimal] = useState<"Perro" | "Gato">("Perro");
  const [selected, setSelected] = useState<"Animal" | "Perro" | "Gato">("Animal");
  const [message, setMessage] = useState("Selecciona una acción para observar su resultado.");

  if (kind === "abstraction") {
    return (
      <section className="encapsulation-lab" aria-label="Simulador de clases y objetos">
        <div className="kicker">Laboratorio interactivo · Abstracción</div>
        <h3>Una clase, muchos objetos</h3>
        <p>La clase Libro define el modelo. Crea dos ejemplares distintos para comprobar que cada uno conserva sus propios atributos.</p>
        <ConceptDiagram kind="abstraction" count={books.length} />
        <div className="encapsulation-lab-state">
          <code>class Libro {"{"} String titulo; String autor; {"}"}</code>
          <strong>{books.length} objeto{books.length === 1 ? "" : "s"}</strong>
        </div>
        <div className="encapsulation-lab-actions">
          <button type="button" className="btn" onClick={() => setBooks((items) => [...items, "Libro: POOQuest · Java"])}>new Libro(&quot;POOQuest&quot;, &quot;Java&quot;)</button>
          <button type="button" className="btn btn-outline" onClick={() => setBooks((items) => [...items, "Libro: Otro · Autor"])}>new Libro(&quot;Otro&quot;, &quot;Autor&quot;)</button>
          <button type="button" className="btn btn-outline" onClick={() => setBooks([])}>Reiniciar</button>
        </div>
        <div className="encapsulation-lab-feedback" role="status" aria-live="polite">
          <strong>Instancias creadas</strong>
          {books.length ? books.slice(-5).map((book, index) => <span key={index}>{book}</span>) : <span>Todavía no hay objetos.</span>}
        </div>
        <p className="encapsulation-lab-tip">Los objetos comparten el modelo Libro, pero cada uno tiene sus propios valores.</p>
      </section>
    );
  }

  if (kind === "inheritance") {
    return (
      <section className="encapsulation-lab" aria-label="Simulador de herencia">
        <div className="kicker">Laboratorio interactivo · Herencia</div>
        <h3>Especializa una clase base</h3>
        <p>Animal define el método sonido(). Perro y Gato lo heredan y pueden sobrescribir su comportamiento.</p>
        <ConceptDiagram kind="inheritance" selected={selected} />
        <div className="encapsulation-lab-state">
          <code>Animal → Perro / Gato</code>
          <strong>{selected}</strong>
        </div>
        <div className="encapsulation-lab-actions">
          {(["Animal","Perro","Gato"] as const).map((type) => (
            <button key={type} type="button" className="btn btn-outline" aria-pressed={selected === type} onClick={() => {setSelected(type);setMessage(type === "Animal" ? "Animal.sonido() utiliza el comportamiento general." : type + " hereda de Animal y especializa sonido().");}}>
              {type}
            </button>
          ))}
        </div>
        <div className="encapsulation-lab-feedback" role="status" aria-live="polite">
          <strong>{selected === "Animal" ? "Animal.sonido()" : selected + ".sonido()"}</strong>
          <span>{message}</span>
        </div>
        <p className="encapsulation-lab-tip">Una clase hija representa una relación «es un» y puede reutilizar o redefinir comportamiento.</p>
      </section>
    );
  }

  return (
    <section className="encapsulation-lab" aria-label="Simulador de polimorfismo">
      <div className="kicker">Laboratorio interactivo · Polimorfismo</div>
      <h3>Una llamada, respuestas diferentes</h3>
      <p>La variable mantiene el tipo Animal. Cambia el objeto que contiene y ejecuta el mismo método sonido().</p>
      <ConceptDiagram kind="polymorphism" animal={animal} />
      <div className="encapsulation-lab-state">
        <code>Animal animal = new {animal}();</code>
        <strong>{animal}</strong>
      </div>
      <div className="encapsulation-lab-actions">
        <button type="button" className="btn btn-outline" aria-pressed={animal === "Perro"} onClick={() => {setAnimal("Perro");setMessage("La variable ahora apunta a un objeto Perro.");}}>Usar Perro</button>
        <button type="button" className="btn btn-outline" aria-pressed={animal === "Gato"} onClick={() => {setAnimal("Gato");setMessage("La variable ahora apunta a un objeto Gato.");}}>Usar Gato</button>
        <button type="button" className="btn" onClick={() => setMessage("animal.sonido() → " + (animal === "Perro" ? "Guau" : "Miau"))}>animal.sonido()</button>
      </div>
      <div className="encapsulation-lab-feedback" role="status" aria-live="polite">
        <strong>Consola simulada</strong>
        <span>{message}</span>
      </div>
      <p className="encapsulation-lab-tip">El nombre de la operación no cambia; Java decide qué implementación ejecutar según el objeto real.</p>
    </section>
  );
}

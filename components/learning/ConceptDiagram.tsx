"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { PlaygroundKind } from "./OOPPlayground";
type Props = { kind: PlaygroundKind; selected?: string; animal?: "Perro" | "Gato"; count?: number };
const shown = () => ({ initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.96 }, transition: { duration: 0.25 } });
/** Diagramas de aprendizaje que conectan clases, objetos y comportamiento. */
export function ConceptDiagram({ kind, selected = "Animal", animal = "Perro", count = 0 }: Props) {
  const reduced = useReducedMotion();
  const active = kind === "polymorphism" ? animal : selected;
  return (
    <div className="v7-concept-diagram" aria-label={"Representación visual de " + kind}>
      {kind === "abstraction" ? (
        <>
          <div className="v7-diagram-heading">PLANO DE LA CLASE <span>→</span> OBJETOS INDEPENDIENTES</div>
          <div className="v7-class-model">
            <div className="v7-class-node template"><span>PLANTILLA</span><strong>Libro</strong><small>titulo · autor · mostrar()</small></div>
            <div className="v7-connector-arrow" aria-hidden="true">→</div>
            <div className="v7-objects-tray" aria-live="polite">
              {count ? Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                <motion.div key={i} {...(reduced ? {} : shown())} className="v7-class-node instance">
                  <span>OBJETO {i + 1}</span><strong>libro{i + 1}</strong><small>Datos propios</small>
                </motion.div>
              )) : <span className="v7-empty-diagram">Pulsa «new Libro» para crear un objeto.</span>}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="v7-diagram-heading">ESTRUCTURA DE CLASES <span>→</span> MÉTODO sonido()</div>
          <div className="v7-class-tree">
            <div className="v7-class-node parent"><span>CLASE BASE</span><strong>Animal</strong><small>sonido()</small></div>
            <div className="v7-tree-lines" aria-hidden="true"><span/><span/><span/></div>
            <div className="v7-tree-leaves">
              <div className={"v7-class-node child " + (active === "Perro" ? "selected" : "")}><span>SUBCLASE</span><strong>Perro</strong><small>Guau</small></div>
              <div className={"v7-class-node child " + (active === "Gato" ? "selected" : "")}><span>SUBCLASE</span><strong>Gato</strong><small>Miau</small></div>
            </div>
          </div>
          <div className="v7-diagram-state" aria-live="polite">
            <span>{kind === "inheritance" ? "Clase seleccionada" : "Objeto real de la variable Animal"}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.strong key={active} {...(reduced ? {} : shown())}>{active}</motion.strong>
            </AnimatePresence>
            <small>{active === "Perro" ? "sonido() → Guau" : active === "Gato" ? "sonido() → Miau" : "sonido() → Comportamiento base"}</small>
          </div>
        </>
      )}
    </div>
  );
}

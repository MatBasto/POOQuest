"use client";

import { motion, useReducedMotion } from "motion/react";
import { EncapsulationSimulator } from "./EncapsulationSimulator";
import { OOPPlayground } from "./OOPPlayground";

type VisualPreset = {
  a: string;
  b: string;
  c: string;
  note?: string;
};

export function ConceptVisual({ type }: { type?: string | null }) {
  const reduceMotion = useReducedMotion();
  if (!type) return null;

  const presets: Record<string, VisualPreset> = {
    abstraction_intro: {
      a: "Realidad completa",
      b: "Elegir lo relevante",
      c: "Modelo útil",
      note: "Abstraer no es copiar todo: es conservar lo que sirve al objetivo.",
    },
    class_object: {
      a: "Clase Libro",
      b: "new Libro(...) ",
      c: "Objeto concreto",
      note: "La clase define la estructura; cada objeto conserva sus propios valores.",
    },
    attributes_methods: {
      a: "Atributos",
      b: "Estado + acciones",
      c: "Métodos",
      note: "Los atributos describen cómo está el objeto y los métodos qué puede hacer.",
    },
    problem_modeling: {
      a: "Problema real",
      b: "Entidades y reglas",
      c: "Clases",
      note: "El modelo nace de identificar responsabilidades, no de guardar datos al azar.",
    },
    abstraction_challenge: {
      a: "Libro",
      b: "título + autor",
      c: "mostrar()",
      note: "El reto integra datos esenciales y una responsabilidad clara.",
    },

    encapsulation_intro: {
      a: "Estado interno",
      b: "Acceso controlado",
      c: "Objeto válido",
      note: "El objeto protege sus datos y decide cómo pueden cambiar.",
    },
    access_modifiers: {
      a: "private",
      b: "Frontera de acceso",
      c: "public",
      note: "Los modificadores definen qué queda dentro de la clase y qué se expone.",
    },
    getters_setters: {
      a: "Dato privado",
      b: "get / set",
      c: "Validación",
      note: "Un setter puede aplicar reglas antes de modificar el estado.",
    },
    state_validation: {
      a: "Entrada",
      b: "Comprobar regla",
      c: "Estado seguro",
      note: "Una operación inválida no debería dejar al objeto en un estado incorrecto.",
    },
    encapsulation_challenge: {
      a: "saldo private",
      b: "consignar()",
      c: "saldo protegido",
      note: "El reto concentra las reglas dentro de la clase Cuenta.",
    },

    inheritance_intro: {
      a: "Animal",
      b: "es un",
      c: "Perro",
      note: "La herencia representa una relación conceptual entre un tipo general y otro específico.",
    },
    extends_super: {
      a: "Clase base",
      b: "extends / super",
      c: "Clase hija",
      note: "extends crea la relación y super ayuda a inicializar la parte heredada.",
    },
    method_override: {
      a: "sonido() base",
      b: "@Override",
      c: "sonido() hijo",
      note: "La clase hija conserva la firma y especializa el comportamiento.",
    },
    class_hierarchy: {
      a: "Común",
      b: "Clase base",
      c: "Especializaciones",
      note: "Lo compartido sube a la clase base; lo específico queda en cada subtipo.",
    },
    inheritance_challenge: {
      a: "Animal",
      b: "Perro extends",
      c: "Guau",
      note: "El reto verifica herencia y sobrescritura funcionando juntas.",
    },

    polymorphism_intro: {
      a: "Referencia Animal",
      b: "Objeto concreto",
      c: "Respuesta propia",
      note: "Una misma referencia puede trabajar con objetos de diferentes subtipos.",
    },
    dynamic_dispatch: {
      a: "Animal a",
      b: "new Perro()",
      c: "Perro.sonido()",
      note: "Java selecciona la implementación según el objeto real en tiempo de ejecución.",
    },
    interfaces_contract: {
      a: "Interfaz",
      b: "Contrato común",
      c: "Implementaciones",
      note: "Varias clases pueden cumplir el mismo contrato de formas diferentes.",
    },
    polymorphic_collection: {
      a: "List<Animal>",
      b: "Perro + Gato",
      c: "sonido()",
      note: "La colección se recorre de forma uniforme y cada objeto responde a su manera.",
    },
    polymorphism_challenge: {
      a: "Animal",
      b: "Perro → Gato",
      c: "Guau → Miau",
      note: "El reto demuestra el cambio de comportamiento sin cambiar la interfaz usada.",
    },

    // Compatibilidad con los valores del seed anterior.
    abstraction: { a: "Problema real", b: "Modelo esencial", c: "Clase" },
    encapsulation: { a: "Datos privados", b: "Métodos públicos", c: "Control" },
    inheritance: { a: "Clase Animal", b: "Perro hereda", c: "Reutilización" },
    polymorphism: { a: "Animal sonido()", b: "Perro: Guau", c: "Gato: Miau" },
  };

  const p = presets[type] || presets.abstraction;

  return (
    <div className="card visual">
      <div className="row" style={{ flexWrap: "wrap", justifyContent: "center" }}>
        <motion.div
          className="visual-box"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          {p.a}
        </motion.div>

        <span>→</span>

        <motion.div
          className="visual-box"
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          {p.b}
        </motion.div>

        <span>→</span>

        <motion.div
          className="visual-box"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          {p.c}
        </motion.div>
      </div>

      {["class_object", "abstraction_challenge"].includes(type) && <OOPPlayground kind="abstraction" />}
      {["inheritance_intro", "method_override"].includes(type) && <OOPPlayground kind="inheritance" />}
      {["polymorphism_intro", "dynamic_dispatch"].includes(type) && <OOPPlayground kind="polymorphism" />}
      {["encapsulation_intro", "access_modifiers", "getters_setters", "state_validation", "encapsulation_challenge", "encapsulation"].includes(type) && <EncapsulationSimulator />}
      {p.note && (
        <p className="subtitle" style={{ marginTop: 18, textAlign: "center" }}>
          {p.note}
        </p>
      )}
    </div>
  );
}

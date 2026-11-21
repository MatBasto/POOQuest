import { describe, expect, it } from "vitest";
import { buildBehaviorCheckSource, normalizeJavaOutput, VERIFIED_MARKER } from "@/lib/java-grader";

describe("Evaluador de Jefes Java", () => {
  it("normaliza saltos de línea y espacios externos", () => {
    expect(normalizeJavaOutput("Guau\r\nMiau\n")).toBe("Guau\nMiau");
    expect(normalizeJavaOutput(null)).toBe("");
  });

  it("no prepara una prueba para niveles no registrados ni programas sin Main", () => {
    expect(buildBehaviorCheckSource("desconocido", "public class Main {}")).toBeNull();
    expect(buildBehaviorCheckSource("reto-herencia", "class Animal {}")).toBeNull();
  });

  it("prepara las pruebas de encapsulamiento contra más de un escenario", () => {
    const source = buildBehaviorCheckSource(
      "reto-encapsulamiento",
      "class Cuenta {} public class Main { public static void main(String[] args) {} }"
    );
    expect(source).toContain('getDeclaredField("saldo")');
    expect(source).toContain("cuenta.consignar(-50.0)");
    expect(source).toContain("cuenta.consignar(25.0)");
    expect(source).toContain(VERIFIED_MARKER);
    expect(source).toContain("class StudentMain");
    expect(source?.match(/public class Main/g)).toHaveLength(1);
  });

  it("comprueba herencia, métodos sobrescritos y despacho dinámico", () => {
    const original = "public class Main { public static void main(String[] args) {} }";
    const herencia = buildBehaviorCheckSource("reto-herencia", original);
    const poli = buildBehaviorCheckSource("reto-polimorfismo", original);
    expect(herencia).toContain("Animal.class.isAssignableFrom(Perro.class)");
    expect(poli).toContain("Animal segundo = new Gato()");
    expect(poli).toContain('POOQuestChecks.prints("Miau"');
  });
});

/**
 * Comprueba comportamiento de POO sin ejecutar código del usuario en el servidor.
 * Todos los programas se ejecutan en el sandbox Java de Judge0.
 */
export const VERIFIED_MARKER = "POOQUEST_TESTS_OK";

export function normalizeJavaOutput(value: unknown): string {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

const scenarios: Record<string, string> = {
  "reto-abstraccion": [
    'POOQuestChecks.expect(Libro.class.getDeclaredMethod("mostrar") != null, "Libro necesita mostrar()");',
    'POOQuestChecks.prints("POOQuest - Java", () -> new Libro("POOQuest", "Java").mostrar());',
    'POOQuestChecks.prints("Otro - Autor", () -> new Libro("Otro", "Autor").mostrar());',
  ].join("\n"),
  "reto-encapsulamiento": [
    'java.lang.reflect.Field saldo = Cuenta.class.getDeclaredField("saldo");',
    'POOQuestChecks.expect(java.lang.reflect.Modifier.isPrivate(saldo.getModifiers()), "saldo debe ser private");',
    'saldo.setAccessible(true);',
    'Cuenta cuenta = new Cuenta(100.0);',
    'cuenta.consignar(-50.0);',
    'POOQuestChecks.expect(Math.abs(((Number) saldo.get(cuenta)).doubleValue() - 100.0) < 0.001, "No aceptes consignaciones negativas");',
    'cuenta.consignar(25.0);',
    'POOQuestChecks.expect(Math.abs(((Number) saldo.get(cuenta)).doubleValue() - 125.0) < 0.001, "La consignación válida debe aumentar el saldo");',
  ].join("\n"),
  "reto-herencia": [
    'POOQuestChecks.expect(Animal.class.isAssignableFrom(Perro.class), "Perro debe extender Animal");',
    'POOQuestChecks.expect(Perro.class.getDeclaredMethod("sonido") != null, "Perro debe sobrescribir sonido()");',
    'Animal animal = new Perro();',
    'POOQuestChecks.prints("Guau", () -> animal.sonido());',
  ].join("\n"),
  "reto-polimorfismo": [
    'POOQuestChecks.expect(Animal.class.isAssignableFrom(Perro.class) && Animal.class.isAssignableFrom(Gato.class), "Perro y Gato deben heredar de Animal");',
    'POOQuestChecks.expect(Perro.class.getDeclaredMethod("sonido") != null && Gato.class.getDeclaredMethod("sonido") != null, "Cada subtipo debe sobrescribir sonido()");',
    'Animal primero = new Perro();',
    'Animal segundo = new Gato();',
    'POOQuestChecks.prints("Guau", () -> primero.sonido());',
    'POOQuestChecks.prints("Miau", () -> segundo.sonido());',
  ].join("\n"),
};

export function buildBehaviorCheckSource(levelSlug: string, sourceCode: string): string | null {
  const scenario = scenarios[levelSlug];
  if (!scenario || !/\bpublic\s+class\s+Main\b/.test(sourceCode)) return null;
  // Main.java debe declarar una única clase Main pública. El Main original queda auxiliar.
  const studentSource = sourceCode.replace(/\bpublic\s+class\s+Main\b/, "class StudentMain");
  return [
    studentSource,
    'class POOQuestChecks {',
    '  static void expect(boolean condition, String message) { if (!condition) throw new IllegalStateException(message); }',
    '  static void prints(String expected, Runnable action) throws Exception {',
    '    java.io.PrintStream previous = System.out;',
    '    java.io.ByteArrayOutputStream buffer = new java.io.ByteArrayOutputStream();',
    '    try { System.setOut(new java.io.PrintStream(buffer, true, "UTF-8")); action.run(); }',
    '    finally { System.setOut(previous); }',
    '    String output = buffer.toString("UTF-8").replace("\\r\\n", "\\n").trim();',
    '    expect(expected.equals(output), "El método imprime un resultado inesperado: " + output);',
    '  }',
    '  static void run() throws Exception {',
    scenario,
    '  }',
    '}',
    'public class Main {',
    '  public static void main(String[] args) throws Exception {',
    '    try { POOQuestChecks.run(); System.out.print("POOQUEST_TESTS_OK"); }',
    '    catch (Throwable error) { System.out.print("POOQUEST_TESTS_FAILED: " + error.getMessage()); System.exit(1); }',
    '  }',
    '}',
  ].join("\n");
}

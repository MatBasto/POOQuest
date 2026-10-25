export type TerritoryMeta = {
  slug: string;
  name: string;
  subtitle: string;
  icon: string;
  accent: string;
  glow: string;
  lore: string;
};

const territories: Record<string, TerritoryMeta> = {
  abstraccion: {
    slug: "abstraccion",
    name: "Laboratorio de Modelos",
    subtitle: "Abstracción",
    icon: "◇",
    accent: "#36a9ff",
    glow: "54, 169, 255",
    lore: "Separa lo esencial del ruido y construye modelos que representen problemas reales.",
  },
  encapsulamiento: {
    slug: "encapsulamiento",
    name: "Fortaleza de Datos",
    subtitle: "Encapsulamiento",
    icon: "⬡",
    accent: "#2dd4a8",
    glow: "45, 212, 168",
    lore: "Protege el estado de los objetos y deja pasar únicamente operaciones seguras.",
  },
  herencia: {
    slug: "herencia",
    name: "Árbol de Linajes",
    subtitle: "Herencia",
    icon: "⌘",
    accent: "#f6b73c",
    glow: "246, 183, 60",
    lore: "Descubre qué comparten las clases y cómo crear nuevas especializaciones sin duplicar código.",
  },
  polimorfismo: {
    slug: "polimorfismo",
    name: "Arena de Formas",
    subtitle: "Polimorfismo",
    icon: "✦",
    accent: "#a970ff",
    glow: "169, 112, 255",
    lore: "Usa una misma interfaz para provocar comportamientos diferentes según el objeto real.",
  },
};

export function getTerritory(slug?: string | null): TerritoryMeta {
  return territories[slug || ""] || territories.abstraccion;
}

export const territoryOrder = ["abstraccion", "encapsulamiento", "herencia", "polimorfismo"];

export type SelectMission = {
  kind: "select";
  title: string;
  story: string;
  instruction: string;
  hint: string;
  items: { id: string; label: string; detail?: string; correct: boolean }[];
};

export type ClassifyMission = {
  kind: "classify";
  title: string;
  story: string;
  instruction: string;
  hint: string;
  groups: [string, string];
  items: { id: string; label: string; group: string }[];
};

export type SequenceMission = {
  kind: "sequence";
  title: string;
  story: string;
  instruction: string;
  hint: string;
  items: { id: string; label: string }[];
  order: string[];
};

export type DuelMission = {
  kind: "duel";
  title: string;
  story: string;
  instruction: string;
  hint: string;
  choices: { id: string; label: string; correct: boolean; response: string }[];
};

export type MissionGame = SelectMission | ClassifyMission | SequenceMission | DuelMission;

export const missionGames: Record<string, MissionGame> = {
  "intro-abstraccion": {
    kind: "select",
    title: "Escáner de relevancia",
    story: "La biblioteca perdió el modelo de sus libros. El escáner detecta demasiados datos y debes conservar solo los que ayudan a identificar cada ejemplar.",
    instruction: "Activa únicamente la información esencial para representar un libro.",
    hint: "Pregunta qué datos describen al libro y cuáles pertenecen al entorno.",
    items: [
      { id: "titulo", label: "Título", detail: "Describe al libro", correct: true },
      { id: "autor", label: "Autor", detail: "Describe al libro", correct: true },
      { id: "color-pared", label: "Color de la pared", detail: "Describe la biblioteca", correct: false },
      { id: "clima", label: "Clima del día", detail: "No pertenece al libro", correct: false },
      { id: "zapatos", label: "Talla del bibliotecario", detail: "Dato irrelevante", correct: false },
      { id: "musica", label: "Música del salón", detail: "Dato del entorno", correct: false },
    ],
  },
  "clases-objetos": {
    kind: "classify",
    title: "Taller de instancias",
    story: "El constructor automático mezcló moldes e instancias. Separa las clases de los objetos antes de reiniciar el sistema.",
    instruction: "Asigna cada elemento al grupo correcto.",
    hint: "La clase define la estructura; el objeto es una instancia concreta con valores propios.",
    groups: ["CLASE", "OBJETO"],
    items: [
      { id: "libro", label: "Libro", group: "CLASE" },
      { id: "cuenta", label: "Cuenta", group: "CLASE" },
      { id: "quijote", label: "Libro: Don Quijote", group: "OBJETO" },
      { id: "cuenta-mateo", label: "Cuenta de Mateo", group: "OBJETO" },
    ],
  },
  "atributos-metodos": {
    kind: "classify",
    title: "Radar de comportamiento",
    story: "Una clase Cuenta fue fragmentada. El radar necesita distinguir qué partes describen su estado y cuáles representan acciones.",
    instruction: "Clasifica cada pieza como atributo o método.",
    hint: "Los atributos guardan información; los métodos expresan comportamiento.",
    groups: ["ATRIBUTO", "MÉTODO"],
    items: [
      { id: "titular", label: "titular", group: "ATRIBUTO" },
      { id: "saldo", label: "saldo", group: "ATRIBUTO" },
      { id: "consignar", label: "consignar(valor)", group: "MÉTODO" },
      { id: "retirar", label: "retirar(valor)", group: "MÉTODO" },
    ],
  },
  "modelado-problemas": {
    kind: "select",
    title: "Ensamblador de modelos",
    story: "Debes modelar un Pedido para una tienda. El sistema propone piezas correctas y otras que no pertenecen a la responsabilidad del objeto.",
    instruction: "Selecciona las piezas que sí deberían formar parte del modelo Pedido.",
    hint: "Busca datos y acciones directamente relacionados con el pedido.",
    items: [
      { id: "numero", label: "numero", correct: true },
      { id: "total", label: "total", correct: true },
      { id: "calcular", label: "calcularTotal()", correct: true },
      { id: "clima", label: "temperaturaExterior", correct: false },
      { id: "pintura", label: "colorDeLaTienda", correct: false },
      { id: "volumen", label: "volumenDeLaMusica", correct: false },
    ],
  },
  "reto-abstraccion": {
    kind: "sequence",
    title: "Protocolo antes del jefe",
    story: "El Núcleo de Abstracción está inestable. Antes de programar el reto final debes ordenar el proceso correcto para construir un modelo.",
    instruction: "Pulsa las tarjetas en el orden que seguirías para modelar un problema.",
    hint: "Primero entiende qué quieres representar; después elige qué conservar y cómo expresarlo.",
    items: [
      { id: "objetivo", label: "Entender el objetivo del problema" },
      { id: "datos", label: "Elegir los datos esenciales" },
      { id: "responsabilidades", label: "Definir responsabilidades" },
      { id: "clase", label: "Representarlo como clase" },
    ],
    order: ["objetivo", "datos", "responsabilidades", "clase"],
  },

  "intro-encapsulamiento": {
    kind: "duel",
    title: "Brecha de seguridad",
    story: "Una Cuenta permite cambiar el saldo desde cualquier parte del programa. Debes cerrar la brecha sin impedir que el objeto funcione.",
    instruction: "Elige la mejor defensa para el estado interno.",
    hint: "Encapsular no significa ocultarlo todo: significa controlar cómo cambia el estado.",
    choices: [
      { id: "a", label: "Hacer saldo private y modificarlo mediante métodos", correct: true, response: "La frontera queda protegida y la clase controla sus reglas." },
      { id: "b", label: "Hacer todos los campos public", correct: false, response: "Eso deja el estado expuesto a cambios sin control." },
      { id: "c", label: "Eliminar todos los métodos", correct: false, response: "El objeto perdería comportamiento, pero sus datos seguirían sin una estrategia clara." },
    ],
  },
  "modificadores-acceso": {
    kind: "classify",
    title: "Escudo de acceso",
    story: "El perímetro de una clase fue configurado al revés. Decide qué elementos pertenecen al interior y cuáles forman su interfaz pública.",
    instruction: "Clasifica cada elemento según el acceso más apropiado.",
    hint: "El estado suele protegerse; las operaciones necesarias para usar el objeto se exponen.",
    groups: ["PRIVATE", "PUBLIC"],
    items: [
      { id: "saldo", label: "saldo", group: "PRIVATE" },
      { id: "pin", label: "pin", group: "PRIVATE" },
      { id: "consignar", label: "consignar()", group: "PUBLIC" },
      { id: "consultar", label: "consultarSaldo()", group: "PUBLIC" },
    ],
  },
  "getters-setters": {
    kind: "sequence",
    title: "Canal de modificación segura",
    story: "Un setter debe impedir que un dato inválido entre al objeto. Ordena el recorrido que debe seguir un nuevo valor.",
    instruction: "Selecciona las etapas en el orden correcto.",
    hint: "No guardes el valor antes de comprobarlo.",
    items: [
      { id: "recibir", label: "Recibir nuevo valor" },
      { id: "validar", label: "Validar la regla" },
      { id: "actualizar", label: "Actualizar el atributo" },
      { id: "confirmar", label: "Confirmar el cambio" },
    ],
    order: ["recibir", "validar", "actualizar", "confirmar"],
  },
  "validacion-estado": {
    kind: "select",
    title: "Filtro de estados válidos",
    story: "El objeto Cuenta está recibiendo operaciones peligrosas. Activa solo las reglas que mantienen el estado consistente.",
    instruction: "Selecciona las validaciones que sí protegen la cuenta.",
    hint: "Una regla útil evita que el objeto termine en una condición imposible o prohibida.",
    items: [
      { id: "retiro", label: "No retirar más dinero del disponible", correct: true },
      { id: "deposito", label: "No aceptar consignaciones negativas", correct: true },
      { id: "nombre", label: "Cambiar el titular al azar", correct: false },
      { id: "publico", label: "Hacer saldo public para facilitar pruebas", correct: false },
    ],
  },
  "reto-encapsulamiento": {
    kind: "duel",
    title: "Guardia de la Fortaleza",
    story: "Antes del reto Java, la Fortaleza exige una última decisión: ¿quién debe decidir si una operación sobre saldo es válida?",
    instruction: "Elige dónde debe vivir la regla.",
    hint: "Las reglas del estado deberían viajar con el objeto que protege ese estado.",
    choices: [
      { id: "a", label: "Dentro de la clase Cuenta", correct: true, response: "Correcto. La clase protege su propia consistencia." },
      { id: "b", label: "En cualquier pantalla que use la cuenta", correct: false, response: "Duplicaría reglas y sería fácil olvidar alguna validación." },
      { id: "c", label: "Solo en comentarios", correct: false, response: "Un comentario explica una regla, pero no la hace cumplir." },
    ],
  },

  "intro-herencia": {
    kind: "classify",
    title: "Detector de relaciones",
    story: "El Árbol de Linajes solo acepta relaciones de herencia verdaderas. Separa las relaciones 'es un' de las que no deberían modelarse con herencia.",
    instruction: "Clasifica cada relación.",
    hint: "Si puedes decir de forma natural que A es un B, puede existir una relación de herencia.",
    groups: ["ES UN", "NO ES UN"],
    items: [
      { id: "perro", label: "Perro → Animal", group: "ES UN" },
      { id: "auto", label: "Auto → Vehículo", group: "ES UN" },
      { id: "motor", label: "Motor → Auto", group: "NO ES UN" },
      { id: "rueda", label: "Rueda → Bicicleta", group: "NO ES UN" },
    ],
  },
  "extends-super": {
    kind: "sequence",
    title: "Cadena de construcción",
    story: "Un objeto Perro necesita inicializar primero la parte heredada de Animal y después su información específica.",
    instruction: "Ordena la secuencia del constructor.",
    hint: "La clase base prepara primero la parte común del objeto.",
    items: [
      { id: "new", label: "new Perro(...)" },
      { id: "hijo", label: "Entrar al constructor de Perro" },
      { id: "super", label: "Ejecutar super(...)" },
      { id: "base", label: "Inicializar la parte Animal" },
    ],
    order: ["new", "hijo", "super", "base"],
  },
  "sobrescritura": {
    kind: "duel",
    title: "Duelo de sobrescritura",
    story: "Animal tiene sonido(), pero Perro necesita responder de forma específica sin cambiar el nombre de la operación.",
    instruction: "Elige la estrategia correcta.",
    hint: "La clase hija puede conservar la misma firma y reemplazar la implementación.",
    choices: [
      { id: "a", label: "Sobrescribir sonido() en Perro", correct: true, response: "Perro mantiene el contrato y especializa el comportamiento." },
      { id: "b", label: "Crear sonidoPerro() y olvidar sonido()", correct: false, response: "Eso rompe la uniformidad de la jerarquía." },
      { id: "c", label: "Copiar toda la clase Animal", correct: false, response: "Duplicarías código en vez de reutilizarlo." },
    ],
  },
  "jerarquia-clases": {
    kind: "select",
    title: "Arquitecto de jerarquías",
    story: "Debes construir una familia de vehículos evitando duplicar información común.",
    instruction: "Selecciona lo que debería vivir en la clase base Vehículo.",
    hint: "Sube a la clase base lo que todos los subtipos comparten.",
    items: [
      { id: "marca", label: "marca", correct: true },
      { id: "velocidad", label: "velocidad", correct: true },
      { id: "acelerar", label: "acelerar()", correct: true },
      { id: "pedalear", label: "pedalear() solo de Bicicleta", correct: false },
      { id: "abrirBaul", label: "abrirBaul() solo de Auto", correct: false },
    ],
  },
  "reto-herencia": {
    kind: "duel",
    title: "Prueba del linaje",
    story: "La puerta del jefe solo se abre si reconoces qué debería heredarse y qué debería especializarse.",
    instruction: "Elige el diseño con menos duplicación y mayor claridad.",
    hint: "Lo común va a la base; lo específico queda en la hija.",
    choices: [
      { id: "a", label: "Animal define nombre y sonido(); Perro sobrescribe sonido()", correct: true, response: "La jerarquía comparte estado y permite especializar comportamiento." },
      { id: "b", label: "Perro copia todos los campos y métodos de Animal", correct: false, response: "La duplicación elimina el beneficio de la herencia." },
      { id: "c", label: "Animal conoce detalles exclusivos de Perro", correct: false, response: "La clase base no debería depender de especializaciones concretas." },
    ],
  },

  "intro-polimorfismo": {
    kind: "classify",
    title: "Portal de formas",
    story: "Varias referencias y objetos atraviesan la Arena. Distingue el tipo de referencia de la forma concreta que existe en memoria.",
    instruction: "Clasifica los elementos.",
    hint: "La referencia puede ser general aunque el objeto sea un subtipo concreto.",
    groups: ["REFERENCIA", "OBJETO REAL"],
    items: [
      { id: "animal-ref", label: "Animal a", group: "REFERENCIA" },
      { id: "figura-ref", label: "Figura f", group: "REFERENCIA" },
      { id: "perro-obj", label: "new Perro()", group: "OBJETO REAL" },
      { id: "circulo-obj", label: "new Circulo()", group: "OBJETO REAL" },
    ],
  },
  "override-dinamico": {
    kind: "duel",
    title: "Predicción dinámica",
    story: "La referencia es Animal, pero contiene un objeto Perro. El sistema llama sonido(). ¿Qué comportamiento aparecerá?",
    instruction: "Predice el resultado antes de ejecutar.",
    hint: "El método sobrescrito se decide usando el objeto real durante la ejecución.",
    choices: [
      { id: "a", label: "Se ejecuta Perro.sonido()", correct: true, response: "El despacho dinámico usa la implementación del objeto real." },
      { id: "b", label: "Siempre se ejecuta Animal.sonido()", correct: false, response: "La referencia limita lo visible, pero no fuerza la implementación base sobrescrita." },
      { id: "c", label: "Java produce error por usar Animal", correct: false, response: "Asignar un subtipo a una referencia base es precisamente una base del polimorfismo." },
    ],
  },
  interfaces: {
    kind: "select",
    title: "Contrato común",
    story: "Varias clases necesitan poder imprimirse sin compartir una clase padre específica. Diseña el contrato mínimo que todas puedan cumplir.",
    instruction: "Selecciona los elementos que pertenecen al contrato Imprimible.",
    hint: "Una interfaz describe qué se puede hacer, no el estado particular de cada implementación.",
    items: [
      { id: "imprimir", label: "imprimir()", correct: true },
      { id: "firma", label: "Una firma de método común", correct: true },
      { id: "saldo", label: "saldo de Cuenta", correct: false },
      { id: "raza", label: "raza de Perro", correct: false },
    ],
  },
  "colecciones-polimorficas": {
    kind: "sequence",
    title: "Cadena polimórfica",
    story: "Una lista contiene Perro y Gato bajo el tipo Animal. Ordena lo que ocurre al recorrerla y llamar sonido().",
    instruction: "Selecciona las etapas en orden.",
    hint: "Primero obtienes una referencia de la colección y después Java resuelve el método del objeto concreto.",
    items: [
      { id: "lista", label: "Tomar un Animal de la lista" },
      { id: "llamada", label: "Llamar sonido()" },
      { id: "objeto", label: "Identificar el objeto real" },
      { id: "metodo", label: "Ejecutar su implementación" },
    ],
    order: ["lista", "llamada", "objeto", "metodo"],
  },
  "reto-polimorfismo": {
    kind: "duel",
    title: "Maestro de las formas",
    story: "El jefe final cambia entre Perro y Gato. Tu código debe invocar la misma operación y permitir que cada objeto responda de forma distinta.",
    instruction: "Elige la idea que hace posible la solución.",
    hint: "La llamada puede ser la misma; lo que cambia es la implementación del objeto concreto.",
    choices: [
      { id: "a", label: "Usar una referencia Animal y métodos sobrescritos", correct: true, response: "Eso permite una llamada común con respuestas diferentes." },
      { id: "b", label: "Preguntar con if por cada clase en todo el programa", correct: false, response: "Funciona para pocos casos, pero evita aprovechar el polimorfismo." },
      { id: "c", label: "Duplicar el método para cada variable", correct: false, response: "La duplicación no crea comportamiento polimórfico." },
    ],
  },
};

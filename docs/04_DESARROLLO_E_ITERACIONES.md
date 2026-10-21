# 4. Desarrollo e iteraciones

POOQuest se desarrolla de forma incremental para evitar construir todas las funciones a la vez. Cada iteración entrega una parte funcional y verificable del sistema, manteniendo trazabilidad con los requisitos RF-01 a RF-12 definidos durante la planeación.

| Iteración | Objetivo | Requisitos principales | Entregable verificable |
|---|---|---|---|
| 0. Preparación | Convertir la planeación en una base técnica implementable | Todos como referencia | Repositorio, estructura Next.js, esquema Supabase, variables de entorno |
| 1. Acceso y navegación | Permitir que el estudiante cree cuenta, inicie/cierre sesión y llegue al panel | RF-01, RF-02, RF-03 | Login/registro, sesión protegida, dashboard y menú |
| 2. Ruta de aprendizaje | Mostrar módulos, niveles, contenidos y recursos visuales | RF-04, RF-05, RF-06 | 4 módulos, 20 niveles, contenido Java y animaciones conceptuales |
| 3. Actividades y progreso | Evaluar respuestas y registrar avance | RF-07, RF-10, RF-11, RF-12 | Actividades, retroalimentación, XP, progreso e insignias |
| 4. Retos Java | Incorporar editor y ejecución de código | RF-08, RF-09, RF-10 | Monaco Editor, endpoint `/api/execute`, Judge0, consola de salida |
| 5. Integración y calidad | Revisar responsive, seguridad y desempeño | RNF rendimiento/usabilidad/seguridad | Pruebas, correcciones y versión candidata a despliegue |

## Detalle de las iteraciones

### Iteración 1 - Acceso
Se implementa Supabase Auth, el alta automática del perfil y la protección de rutas con middleware. El criterio de terminado es que un estudiante pueda registrarse, iniciar sesión, cerrar sesión y no acceder a páginas privadas cuando la sesión no exista.

### Iteración 2 - Aprendizaje
Se cargan los cuatro pilares de POO y sus niveles desde PostgreSQL. Cada nivel presenta explicación, ejemplo Java y un recurso visual animado. El criterio de terminado es que el estudiante pueda recorrer la ruta habilitada y consultar el contenido en escritorio o móvil.

### Iteración 3 - Interacción y gamificación
Las respuestas se registran mediante la función `submit_activity`. El sistema evita entregar XP repetida por responder correctamente la misma actividad varias veces, recalcula el progreso y asigna recompensas al alcanzar umbrales.

### Iteración 4 - Programación
El editor Monaco envía el código Java al endpoint interno de Next.js. El servidor autentica al estudiante, consulta el reto, llama a Judge0 y registra el resultado mediante `record_code_result`. El código se ejecuta fuera del servidor principal, cumpliendo el requisito de aislamiento definido en la planeación.

### Iteración 5 - Cierre
Se ejecutan casos funcionales y no funcionales, se corrigen fallos de interfaz, se verifica que las rutas privadas estén protegidas y se prepara el despliegue. La estimación COCOMO se conserva como referencia de planeación, no como condición técnica del aplicativo.

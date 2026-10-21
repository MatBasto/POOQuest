# 5. Revisión de prototipos

La revisión toma como referencia los mockups definidos en la planeación y los contrasta con la implementación. El objetivo no es copiar cada píxel, sino conservar la jerarquía, el flujo y las funciones representadas.

| Prototipo | Elementos conservados | Ajustes de implementación | Estado |
|---|---|---|---|
| Inicio de sesión | Marca POOQuest, panel de acceso y registro | Se unifican login/registro mediante pestañas y se añade mensaje de confirmación | Implementado |
| Panel principal | Resumen, módulos y gamificación | Las estadísticas se alimentan desde Supabase | Implementado |
| Niveles de módulo | Lista ordenada, estado y bloqueo | El desbloqueo usa XP requerida y progreso real | Implementado |
| Contenido | Explicación, ejemplo Java, navegación | Se agrega visual animado con Motion | Implementado |
| Actividad | Pregunta, opciones y retroalimentación inmediata | La validación se realiza en PostgreSQL mediante RPC | Implementado |
| Reto de programación | Enunciado, editor, botón ejecutar y consola | Monaco se integra con Judge0 a través del servidor Next.js | Implementado |

## Criterios revisados
- **Consistencia:** navegación lateral y lenguaje visual uniforme.
- **Comprensión:** cada pantalla muestra una acción principal clara.
- **Retroalimentación:** actividades y retos informan el resultado sin abandonar el nivel.
- **Responsive:** el menú y las tarjetas se reorganizan en pantallas pequeñas.
- **Accesibilidad básica:** controles con texto visible, contraste alto y estados diferenciados.

## Cambios derivados de la revisión
1. Los niveles bloqueados muestran la cantidad de XP necesaria en lugar de ocultarse.
2. La actividad permite reintentar cuando la respuesta es incorrecta.
3. El reto conserva el código en el editor si Judge0 falla.
4. El progreso se calcula desde intentos aprobados, no desde botones presionados.
5. La ejecución de Java se mueve al servidor para no exponer credenciales de Judge0 en el navegador.
6. En móvil, el diseño cambia a una sola columna y el menú deja de ocupar una barra lateral fija.

## Evidencia sugerida para el informe
Cuando el aplicativo esté montado, reemplazar o complementar los mockups con capturas reales de: `/login`, `/dashboard`, `/modules/[id]`, `/levels/[id]`, `/progress` y un reto Java ejecutado correctamente.

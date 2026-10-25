# Iteración 6 — Rediseño lúdico de POOQuest

Esta versión conserva la arquitectura y los servicios ya validados (Next.js, Supabase, Monaco Editor y Judge0), pero cambia la experiencia de uso para que POOQuest se perciba como una aventura educativa y no únicamente como un cuestionario con puntos.

## Cambios principales

- Dashboard convertido en mapa de aventura con cuatro territorios temáticos.
- Onboarding de primera entrada con cuatro pasos breves.
- Nueva sección permanente **Cómo jugar**.
- Módulos presentados como territorios y niveles presentados como misiones.
- Flujo guiado dentro de cada misión: **Descubre → Misión → Jefe Java**.
- Asistente P00 con pistas contextuales.
- Actividades con cuatro mecánicas de interacción: selección, clasificación, secuencias y duelos de decisión.
- Configuraciones diferentes para los 20 niveles, relacionadas con el concepto específico de cada nivel.
- Retos Java presentados como enfrentamientos finales, conservando Monaco Editor y Judge0.
- Mensajes diferenciados para salida incorrecta, error de compilación y reto superado.
- Rediseño visual de progreso, recompensas, perfil, login y navegación.
- Diseño responsive y soporte para `prefers-reduced-motion`.
- Navegación guiada después de completar un nivel: acceso directo a la siguiente misión y, en el nivel final de cada pilar, al primer nivel del siguiente territorio.
- Modo de repaso para misiones ya superadas, con tablero reiniciado y sin volver a otorgar XP, progreso o recompensas.
- Los retos Java superados pueden volver a ejecutarse como práctica y la interfaz aclara que no entregan XP adicional.

## Compatibilidad con la versión anterior

No se requiere una migración de base de datos. Las actividades continúan llamando a `submit_activity`, por lo que:

- el XP se entrega una sola vez;
- los intentos correctos continúan actualizando `level_progress`;
- los niveles completados continúan entregando su XP;
- el progreso existente del usuario se conserva.

Los retos Java continúan utilizando `/api/execute` y `record_code_result`, por lo que tampoco cambia la integración con Judge0.

El modo de repaso de las misiones interactivas se valida localmente cuando la actividad ya fue aprobada y no vuelve a llamar a `submit_activity`. De esta forma el estudiante puede practicar desde cero sin crear recompensas repetidas. En los retos Java sí se permiten nuevas ejecuciones para practicar, pero `record_code_result` conserva la regla existente que impide sumar XP dos veces por el mismo reto.

## Pruebas recomendadas después de copiar esta versión

1. `npm test`
2. `npm run test:e2e`
3. `npm run build`
4. Verificar registro/login y cierre de sesión.
5. Comprobar el onboarding en una ventana de incógnito o eliminando la clave local `pooquest:onboarding:v2`.
6. Recorrer una misión de cada territorio.
7. Ejecutar un reto Java con error y otro con salida correcta.
8. Abrir una misión ya superada, pulsar **Repasar misión** y confirmar que permite resolverla nuevamente sin modificar XP.
9. Completar una misión y comprobar el botón **Siguiente misión**.
10. Completar el nivel 5 de un pilar y comprobar el acceso directo al siguiente territorio.
11. Revisar la interfaz a 360 px.

## Despliegue

Después de validar localmente, subir los cambios al repositorio Git conectado a Vercel. No es necesario cambiar las variables de entorno si el proyecto de Vercel conserva las mismas variables de Supabase y Judge0.

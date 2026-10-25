# POOQuest Adventure

Aplicación web educativa para aprender abstracción, encapsulamiento, herencia y polimorfismo mediante una aventura guiada con contenidos visuales, misiones interactivas, retos Java, progreso, XP y logros.

## Experiencia de juego

- Onboarding de primera entrada.
- Mapa con cuatro territorios temáticos.
- Niveles presentados como misiones.
- Flujo guiado `Descubre → Misión → Jefe Java`.
- Asistente P00 con pistas contextuales.
- Actividades de selección, clasificación, secuencias y duelos de decisión.
- Retos finales con Monaco Editor y ejecución real mediante Judge0.
- XP, progreso, desbloqueos e insignias persistentes con Supabase.
- Página permanente **Cómo jugar**.
- Continuación guiada al completar una misión: siguiente nivel o siguiente territorio sin volver al mapa.
- Modo **Repasar misión** para volver a jugar actividades superadas sin modificar XP, progreso ni recompensas.
- Los jefes Java también pueden repetirse como repaso sin mostrar XP duplicada.

## Stack

- Next.js + React + TypeScript
- Supabase Auth + PostgreSQL + RLS
- Monaco Editor
- Motion
- Judge0 para ejecución Java

## Inicio rápido

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

En una instalación nueva de Supabase ejecuta primero `supabase/schema.sql`, después `supabase/seed.sql` y finalmente `supabase/patch_contenido_niveles_v2.sql` para cargar el contenido diferenciado de los 20 niveles.

Si ya tienes la base de datos de POOQuest funcionando y aplicaste anteriormente el parche de contenidos, **no vuelvas a ejecutar `seed.sql`**. Esta versión visual no necesita una migración adicional y conserva usuarios, XP, progreso, intentos y ejecuciones Java existentes.

La guía completa de montaje está en `docs/MONTAJE_COMPLETO.md` y el rediseño se documenta en `docs/07_REDINENO_LUDICO.md`.

## Pruebas

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

## Estructura

- `app/`: páginas, layouts, onboarding dentro del shell y API de ejecución.
- `components/game/`: mapa, onboarding y mecánicas de las misiones.
- `components/learning/`: contenido, recursos visuales y jefe Java.
- `components/layout/`: navegación general.
- `lib/game.ts`: identidad de territorios y configuración de las 20 misiones.
- `lib/`: Supabase, tipos y lógica compartida.
- `supabase/`: esquema, RLS, funciones, seed y parche de contenido.
- `docs/`: montaje, pruebas, iteraciones y rediseño lúdico.
- `tests/`: pruebas unitarias y smoke E2E.

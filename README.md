# POOQuest
Aplicación web educativa para reforzar abstracción, encapsulamiento, herencia y polimorfismo mediante contenido visual, actividades, retos Java, retroalimentación, progreso y recompensas.

## Stack
- Next.js + React + TypeScript
- Supabase Auth + PostgreSQL + RLS
- Monaco Editor
- Motion
- Judge0 para ejecución Java

## Inicio rápido
```bash
npm install
cp .env.example .env.local
npm run dev
```
Antes debes ejecutar `supabase/schema.sql` y `supabase/seed.sql` en tu proyecto Supabase. La guía completa está en `docs/MONTAJE_COMPLETO.md`.

## Estructura
- `app/`: páginas, layouts y API de ejecución.
- `components/`: interfaz, aprendizaje, editor y gamificación.
- `lib/`: Supabase, tipos y lógica compartida.
- `supabase/`: esquema, RLS, funciones y datos iniciales.
- `docs/`: iteraciones, revisión de prototipos, plan de pruebas, montaje y multimedia.
- `tests/`: pruebas unitarias y smoke E2E.

## Alcance implementado
RF-01 a RF-12 del documento de planeación. El proyecto incluye 4 módulos, 20 niveles, actividades, progreso, XP, insignias y un reto de Java al final de cada módulo.

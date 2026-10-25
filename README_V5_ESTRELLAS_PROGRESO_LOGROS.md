# POOQuest Adventure v5

Esta versión parte de v4 y añade tres mejoras:

1. **Estrellas funcionales y persistentes** por misión interactiva.
2. **Pantalla de progreso más informativa**, con avance global y por territorio.
3. **Recompensas jugables**, basadas en acciones reales y Fragmentos del Núcleo.

## Antes de ejecutar

Copia `.env.local` desde tu versión actual. No publiques ese archivo.

## Paso obligatorio en Supabase

Ejecuta **una sola vez** en SQL Editor:

`supabase/patch_v5_estrellas.sql`

El parche:
- crea `level_scores`;
- crea la función `record_level_score`;
- activa RLS para que cada estudiante solo lea sus puntuaciones;
- calcula una puntuación inicial para niveles ya completados usando los intentos incorrectos existentes;
- no elimina XP, usuarios, progreso, actividades ni ejecuciones.

No vuelvas a ejecutar `seed.sql`.

## Reglas de estrellas

Las estrellas califican la **misión interactiva** del nivel:

- ★★★: 0 errores y 0 pistas.
- ★★☆: hasta 2 errores y máximo 1 pista.
- ★☆☆: más errores o más ayuda.

El sistema guarda la mejor puntuación. Repasar puede mejorar las estrellas, pero no vuelve a entregar XP.

Los Jefes Java se muestran por separado dentro del progreso y los logros.

## Recompensas

La página Logros ya no depende solo de umbrales de XP. Incluye hitos como:
- primera misión;
- primera misión con ★★★;
- primer Jefe Java derrotado;
- completar cada territorio;
- cinco misiones perfectas;
- completar toda la aventura.

Completar un territorio recupera visualmente un **Fragmento del Núcleo**.

## Pruebas recomendadas

Después del parche:

```powershell
npm install
npm run dev
```

Prueba una misión nueva:
- sin fallar ni pedir pista -> ★★★;
- usando pista -> como máximo ★★☆;
- fallando varias veces -> baja la puntuación;
- usa `Repasar misión` y resuélvela limpio -> debe mejorar el récord sin sumar XP.

Después ejecuta:

```powershell
npm test
npm run test:e2e
npm run build
```

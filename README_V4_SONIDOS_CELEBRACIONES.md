# POOQuest Adventure v4 — sonidos y celebraciones

Esta versión parte de Adventure v3 y conserva Supabase, XP, progreso, repaso, Judge0 y la navegación guiada.

## Cambios

- Efectos generados con Web Audio API, sin archivos MP3 externos.
- Control persistente `🔊 Sonido / 🔇 Silencio` en la barra lateral.
- Sonido de error en actividades y ejecuciones Java incorrectas.
- Sonido suave al completar un repaso.
- Sonido de desbloqueo al abrir el Jefe Java.
- Sonido de victoria al superar un jefe o territorio.
- Sonido especial al completar toda la aventura.
- Celebraciones visuales no bloqueantes para misión, desbloqueo de jefe, territorio y aventura.
- Las celebraciones solo aparecen en logros nuevos; no se repiten al entrar a niveles ya completados ni al hacer repaso.

## Instalación

Copiar `.env.local` desde la versión funcional anterior y ejecutar:

```powershell
npm install
npm run dev
```

No se requieren cambios SQL ni nuevas variables de entorno.

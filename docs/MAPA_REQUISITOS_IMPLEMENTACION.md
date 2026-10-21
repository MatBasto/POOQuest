# Trazabilidad requisito -> implementación
| Requisito | Implementación principal |
|---|---|
| RF-01 Registrarse | `components/auth/AuthForm.tsx`, Supabase Auth, trigger `handle_new_user` |
| RF-02 Iniciar sesión | `AuthForm.tsx`, middleware de sesión |
| RF-03 Cerrar sesión | `components/layout/Sidebar.tsx` |
| RF-04 Acceder a un nivel | `/modules/[moduleId]`, `/levels/[levelId]`, `required_xp` |
| RF-05 Consultar contenido | `contents`, `LevelTabs.tsx` |
| RF-06 Recurso visual | `ConceptVisual.tsx` + Motion |
| RF-07 Actividad | `ActivityCard.tsx` + RPC `submit_activity` |
| RF-08 Reto de programación | `CodeChallenge.tsx`, `programming_challenges` |
| RF-09 Ejecutar Java | `/api/execute`, Judge0 |
| RF-10 Retroalimentación | respuesta RPC y estado de ejecución |
| RF-11 Consultar progreso | `level_progress`, `/progress` |
| RF-12 Recompensas | `rewards`, trigger `award_threshold_rewards`, `/rewards` |

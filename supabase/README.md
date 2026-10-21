# Base de datos
1. Crea un proyecto en Supabase.
2. Ve a **SQL Editor** y ejecuta primero `schema.sql` y después `seed.sql`.
3. En **Authentication > Providers > Email**, habilita correo/contraseña.
4. Para un montaje de aula rápido puedes desactivar **Confirm email**; si lo dejas activo, el usuario deberá confirmar el correo.
5. Copia Project URL y anon key en `.env.local`.

El esquema activa RLS. El contenido pedagógico es legible por usuarios autenticados y cada estudiante solo puede consultar sus propios intentos, progreso y recompensas. Las escrituras sensibles de actividad/código pasan por funciones SQL con `security definer`.

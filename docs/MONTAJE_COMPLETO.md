# Guía completa de montaje de POOQuest

## 1. Requisitos del equipo
- Node.js 20 LTS o superior.
- npm 10 o superior.
- Cuenta/proyecto de Supabase.
- Acceso a una instancia de Judge0 compatible con API REST.
- Git es recomendado, no obligatorio.

## 2. Instalar el proyecto
```bash
cd POOQuest_app
npm install
cp .env.example .env.local
```
En Windows PowerShell puedes usar:
```powershell
Copy-Item .env.example .env.local
```

## 3. Crear Supabase
1. Crea un proyecto en Supabase.
2. Abre **SQL Editor**.
3. Ejecuta todo `supabase/schema.sql`.
4. Ejecuta todo `supabase/seed.sql`.
5. En **Authentication > Providers** habilita Email.
6. Copia **Project URL** y **anon public key** a `.env.local`.

## 4. Configurar Judge0
En `.env.local` define `JUDGE0_URL` y el ID de Java. El proyecto deja `62` como valor inicial porque es común en instalaciones de Judge0 CE, pero debes comprobar el listado de lenguajes de tu instancia (`GET /languages`) y cambiar `JUDGE0_JAVA_LANGUAGE_ID` si allí Java tiene otro ID.

Si usas un proveedor que requiere RapidAPI, completa `JUDGE0_RAPIDAPI_KEY` y `JUDGE0_RAPIDAPI_HOST`. Nunca pongas esa clave con prefijo `NEXT_PUBLIC_`, porque se expondría al navegador.

## 5. Ejecutar
```bash
npm run dev
```
Abre `http://localhost:3000`.

## 6. Verificación inicial
1. Registra un estudiante.
2. Inicia sesión.
3. Abre Abstracción > primer nivel.
4. Responde la actividad.
5. Verifica el aumento de XP en el menú.
6. Avanza hasta un nivel final, abre el reto, ejecuta Java y comprueba la consola.
7. Revisa `/progress` y `/rewards`.

## 7. Despliegue recomendado
### Vercel
1. Sube el proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Agrega las mismas variables de `.env.local` en **Project Settings > Environment Variables**.
4. Despliega.
5. En Supabase Authentication agrega el dominio de Vercel a **Site URL / Redirect URLs**.

### Supabase
La base de datos y Auth permanecen en Supabase; no necesitas alojar PostgreSQL dentro de Vercel.

## 8. Seguridad
- RLS está habilitado para las tablas con datos de usuario.
- La clave anon puede estar en el frontend; la seguridad depende de RLS.
- No uses `service_role` en el navegador.
- Judge0 se consume desde `/api/execute` para no revelar claves privadas.
- Limita tamaño y tiempo de ejecución en Judge0 si administras tu propia instancia.

## 9. Contenido
El `seed.sql` deja 4 módulos, 20 niveles, una actividad por nivel y un reto final por módulo. Puedes modificar el contenido directamente en Supabase Table Editor o editando `seed.sql` antes del montaje definitivo.

## 10. Multimedia
Revisa `docs/MULTIMEDIA_REQUERIDA.md`. Ningún archivo es obligatorio para iniciar; las visualizaciones conceptuales funcionan con Motion y CSS.

## 11. Pruebas
```bash
npm run test
npx playwright install
npm run test:e2e
```
Los casos manuales completos están en `docs/06_PLAN_Y_CASOS_DE_PRUEBA.md` y `docs/casos_prueba.csv`.

## 12. Problemas comunes
- **No crea el perfil:** revisa el trigger `on_auth_user_created` y que `schema.sql` se ejecutó sin errores.
- **Se queda en login:** revisa URL/key de Supabase y confirmación de email.
- **Reto Java da 503:** falta `JUDGE0_URL`.
- **Reto Java compila pero no aprueba:** la salida debe coincidir con `expected_output` ignorando espacios al inicio/final y saltos CRLF.
- **Nivel bloqueado:** el usuario aún no alcanza `required_xp`; para una demo puedes bajar esos valores en la tabla `levels`.

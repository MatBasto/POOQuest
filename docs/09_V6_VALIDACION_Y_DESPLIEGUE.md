# POOQuest v6 — Validación, usabilidad y seguridad

> Propuesta en rama: **no publicar ni ejecutar las migraciones fuera de este orden**.

## Implementado en esta propuesta

- Cuatro jefes Java: validación de salida y pruebas adicionales de comportamiento (clases, constructores, atributos privados, validaciones, herencia, sobrescritura y polimorfismo).
- El código sigue ejecutándose únicamente en Judge0.
- El endpoint Java valida sesión, nivel disponible, misión previa, código y cuota (6/minuto; 100/día).
- El registro de ejecuciones aprobadas se realiza mediante RPC verificada, invocada solo desde backend con SERVICE ROLE.
- Retroalimentación más clara: la salida puede coincidir aunque el comportamiento orientado a objetos sea incorrecto.
- Simulador interactivo de encapsulamiento, con consignación válida/inválida, sin afectar XP.
- Preferencia de movimiento reducido, pruebas unitarias y CI para PR.

## Configuración

Agregar en el servidor de Vercel **SUPABASE_SERVICE_ROLE_KEY** con la clave secreta del MISMO proyecto Supabase. Nunca usar prefijo NEXT_PUBLIC, nunca subirla al repositorio, capturas, logs o navegador. Mantener las variables de Judge0 y Supabase existentes.

## Despliegue por fases — IMPORTANTE

1. Realizar copia de seguridad de la base de datos.
2. Ejecutar **supabase/patches/v6_01_predeploy.sql** en Supabase SQL Editor. Crea nueva RPC y cuota; no elimina datos y conserva la aplicación anterior.
3. Configurar **SUPABASE_SERVICE_ROLE_KEY** en Production dentro de Vercel. Para Preview, preferir un Supabase de pruebas.
4. Verificar las pruebas automáticas del PR y probar la aplicación en un entorno no productivo.
5. Integrar el PR solo tras verificar build y migración, y esperar despliegue Ready.
6. Probar en producción: código que solo imprime la salida (debe fallar), solución POO correcta (debe aprobar) y repaso sin XP duplicada.
7. SOLO DESPUÉS ejecutar **supabase/patches/v6_02_postdeploy.sql** para revocar la RPC antigua que permitía declarar resultados y privilegios de modificación de perfiles.
8. Comprobar que las tres consultas de privilegios al final del SQL devuelven false.

**Si falla un paso, no ejecutar la fase 2.** No pegar la clave de servicio en archivos frontend.

## Pruebas manuales

- Encapsulamiento: System.out.println("100.0") compila, pero no debe aprobar el jefe.
- Encapsulamiento: Cuenta con saldo privado, constructor y consignar(double) debe rechazar negativos y aceptar positivos.
- Abstracción: Libro con título, autor, constructor y mostrar() debe funcionar con datos distintos a los del ejemplo.
- Herencia: imprimir Guau sin Perro extends Animal no es suficiente.
- Polimorfismo: imprimir Guau/Miau sin Animal, Perro y Gato relacionados no es suficiente.
- La séptima petición dentro de un minuto recibe HTTP 429.
- Usuario sin sesión o nivel bloqueado recibe 401/403.
- Una ejecución repetida tras aprobar un jefe no duplica XP.
- Simulador de Cuenta: consignar(-50) no altera el saldo.
- Movimiento reducido desactiva los bucles decorativos.
- Ejecutar: npm ci, npm test, npm run test:e2e y npm run build.

## Límites reales

Las pruebas ocultas son específicas de los enunciados actuales. Si se modifican los contratos del reto, deben ajustarse. Un sistema de pruebas basado en el mismo proceso del código enviado no es un entorno antitrampas exhaustivo.

Las estrellas y algunos minijuegos aún confían en datos del navegador. Por ello, no se consideran una certificación inalterable; queda pendiente una evaluación integral del modelo de intentos.

Cada reto correcto puede llamar a Judge0 dos veces y consumir más cuota de RapidAPI. Revisar costos y límites. No se ha probado carga concurrente de 50 personas.

## Reversión

Revertir Vercel NO revierte los permisos SQL. Si ya se ejecutó la fase 2, una versión antigua no podrá registrar retos sin restaurar la función anterior. Por ello, hacer backup, validar primero y aplicar la segunda fase solo después de una prueba exitosa en producción.

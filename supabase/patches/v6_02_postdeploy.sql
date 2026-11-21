-- FASE 2 v6: ejecutar DESPUÉS de desplegar la ruta verificada y comprobar
-- en Vercel que una solución Java correcta se registra sin errores.
-- No borra datos. Deshabilita rutas antiguas con las que un cliente podía
-- autoasignarse XP o alterar el perfil.

begin;
revoke execute on function public.record_code_result(bigint,text,text,text,boolean)
  from public,anon,authenticated;

-- Esta función interna cambia progreso y XP, nunca debe exponerse como RPC.
revoke execute on function public.refresh_level_progress(uuid,bigint)
  from public,anon,authenticated;

-- No permitir UPDATE directo de XP ni otros campos de profiles desde el navegador.
-- El trigger de creación y las funciones SECURITY DEFINER siguen funcionando.
revoke update on table public.profiles from public,anon,authenticated;

-- Las estrellas se actualizan únicamente mediante record_level_score;
-- esta medida no impide aún declaraciones falsas de número de errores/pistas.
revoke insert,update,delete on table public.level_scores
  from public,anon,authenticated;
commit;

-- Comprobación de privilegios: para authenticated estas tres consultas deben devolver false.
select
  has_function_privilege('authenticated', 'public.record_code_result(bigint,text,text,text,boolean)', 'EXECUTE') as puede_falsificar_reto,
  has_function_privilege('authenticated', 'public.refresh_level_progress(uuid,bigint)', 'EXECUTE') as puede_refrescar_xp,
  has_table_privilege('authenticated','public.profiles','UPDATE') as puede_modificar_perfil;

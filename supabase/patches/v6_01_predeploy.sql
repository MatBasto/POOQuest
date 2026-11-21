-- FASE 1 de la migración v6. Ejecutar ANTES de desplegar el backend v6.
-- No elimina datos ni afecta las funciones que usa actualmente producción.

create table if not exists public.java_execution_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists idx_java_execution_requests_user_time
  on public.java_execution_requests (user_id, created_at desc);
alter table public.java_execution_requests enable row level security;
revoke all on public.java_execution_requests from anon, authenticated;

-- Reserva atómica: como máximo 6 ejecuciones por minuto y 100 por día por usuario.
create or replace function public.reserve_java_execution()
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Sesión requerida'; end if;
  perform pg_advisory_xact_lock(hashtext(v_user::text));
  if (select count(*) from public.java_execution_requests
       where user_id=v_user and created_at > now()-interval '1 minute') >= 6
    or (select count(*) from public.java_execution_requests
       where user_id=v_user and created_at > now()-interval '1 day') >= 100 then
    return false;
  end if;
  insert into public.java_execution_requests (user_id) values (v_user);
  return true;
end $$;
revoke all on function public.reserve_java_execution() from public, anon;
grant execute on function public.reserve_java_execution() to authenticated;

-- Solo el backend con SERVICE_ROLE_KEY puede registrar un resultado verificado.
-- La identidad del usuario se obtiene en la ruta /api/execute mediante getUser().
create or replace function public.record_code_result_verified(
  p_user_id uuid, p_challenge_id bigint, p_code text,
  p_output text, p_status text, p_passed boolean
)
returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare v_level bigint; v_reward integer; v_already boolean;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'No autorizado';
  end if;
  if p_user_id is null or length(coalesce(p_code,'')) > 20000 then
    raise exception 'Registro inválido';
  end if;
  select level_id,xp_reward into v_level,v_reward
    from public.programming_challenges where id=p_challenge_id;
  if v_level is null then raise exception 'Reto inexistente'; end if;

  perform pg_advisory_xact_lock(hashtext(p_user_id::text || ':' || p_challenge_id::text));

  select exists(
    select 1 from public.code_executions
    where user_id=p_user_id and challenge_id=p_challenge_id and passed
  ) into v_already;

  insert into public.code_executions(user_id,challenge_id,code,output,status,passed)
  values(p_user_id,p_challenge_id,p_code,p_output,p_status,p_passed);

  if p_passed and not v_already then
    update public.profiles set xp=xp+coalesce(v_reward,0),updated_at=now()
      where id=p_user_id;
  end if;
  perform public.refresh_level_progress(p_user_id,v_level);
end $$;
revoke all on function public.record_code_result_verified(uuid,bigint,text,text,text,boolean)
  from public,anon,authenticated;
grant execute on function public.record_code_result_verified(uuid,bigint,text,text,text,boolean)
  to service_role;

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('administrativo', 'profesor', 'alumno');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.estado_pago as enum ('pagado', 'pendiente');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.estado_asistencia as enum ('presente', 'tarde', 'falta', 'justificado');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users(id) on delete cascade,
  rol public.app_role not null,
  nombres text not null,
  apellidos text not null,
  dni text unique,
  email text unique not null,
  telefono text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  grado text not null,
  seccion text not null,
  nivel text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (grado, seccion, nivel)
);

create table if not exists public.alumnos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid unique references public.usuarios(id) on delete cascade,
  codigo text unique,
  nombres text not null,
  apellidos text not null,
  dni text unique,
  fecha_nacimiento date,
  salon_id uuid references public.salones(id),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profesores (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid unique references public.usuarios(id) on delete cascade,
  codigo text unique,
  nombres text not null,
  apellidos text not null,
  dni text unique,
  especialidad text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cursos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  codigo text unique,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bimestres (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  numero int not null check (numero between 1 and 4),
  fecha_inicio date,
  fecha_fin date,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (numero)
);

create table if not exists public.cursos_profesor (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid not null references public.profesores(id) on delete cascade,
  curso_id uuid not null references public.cursos(id) on delete cascade,
  salon_id uuid not null references public.salones(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profesor_id, curso_id, salon_id)
);

create table if not exists public.notas (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.alumnos(id) on delete cascade,
  curso_id uuid not null references public.cursos(id),
  profesor_id uuid references public.profesores(id),
  bimestre_id uuid not null references public.bimestres(id),
  nota_mensual numeric(5,2) check (nota_mensual is null or nota_mensual between 0 and 20),
  nota_bimestral numeric(5,2) check (nota_bimestral is null or nota_bimestral between 0 and 20),
  promedio numeric(5,2) check (promedio is null or promedio between 0 and 20),
  updated_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alumno_id, curso_id, bimestre_id)
);

create table if not exists public.asistencia (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.alumnos(id) on delete cascade,
  curso_id uuid references public.cursos(id),
  profesor_id uuid references public.profesores(id),
  bimestre_id uuid not null references public.bimestres(id),
  semana int not null check (semana between 1 and 12),
  fecha date not null,
  estado public.estado_asistencia not null,
  updated_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alumno_id, curso_id, fecha)
);

create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.alumnos(id) on delete cascade,
  anio int not null check (anio >= 2000),
  mes int not null check (mes between 1 and 12),
  estado public.estado_pago not null default 'pendiente',
  monto numeric(10,2) check (monto is null or monto >= 0),
  fecha_pago date,
  updated_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (alumno_id, anio, mes)
);

create table if not exists public.comunicados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  contenido text not null,
  publicado boolean not null default false,
  destinatario public.app_role,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auditoria (
  id uuid primary key default gen_random_uuid(),
  tabla text not null,
  registro_id uuid not null,
  accion text not null,
  old_data jsonb,
  new_data jsonb,
  usuario_id uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_usuarios_auth_user_id on public.usuarios(auth_user_id);
create index if not exists idx_alumnos_salon_id on public.alumnos(salon_id);
create index if not exists idx_alumnos_apellidos on public.alumnos(apellidos);
create index if not exists idx_profesores_apellidos on public.profesores(apellidos);
create index if not exists idx_cursos_profesor_profesor on public.cursos_profesor(profesor_id);
create index if not exists idx_cursos_profesor_salon on public.cursos_profesor(salon_id);
create index if not exists idx_notas_alumno on public.notas(alumno_id);
create index if not exists idx_notas_consulta on public.notas(curso_id, bimestre_id, profesor_id);
create index if not exists idx_asistencia_consulta on public.asistencia(alumno_id, bimestre_id, fecha);
create index if not exists idx_pagos_alumno_periodo on public.pagos(alumno_id, anio, mes);
create index if not exists idx_comunicados_publicados on public.comunicados(publicado, destinatario, created_at desc);

create or replace function public.current_usuario_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.usuarios where auth_user_id = auth.uid() and activo = true limit 1;
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.usuarios where auth_user_id = auth.uid() and activo = true limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'administrativo';
$$;

create or replace function public.current_profesor_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profesores where usuario_id = public.current_usuario_id() and activo = true limit 1;
$$;

create or replace function public.current_alumno_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.alumnos where usuario_id = public.current_usuario_id() and activo = true limit 1;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.audit_critical_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  record_id uuid;
begin
  record_id = coalesce(new.id, old.id);

  insert into public.auditoria(tabla, registro_id, accion, old_data, new_data, usuario_id)
  values (tg_table_name, record_id, tg_op, to_jsonb(old), to_jsonb(new), public.current_usuario_id());

  return coalesce(new, old);
end;
$$;

drop trigger if exists set_usuarios_updated_at on public.usuarios;
create trigger set_usuarios_updated_at before update on public.usuarios for each row execute function public.set_updated_at();
drop trigger if exists set_salones_updated_at on public.salones;
create trigger set_salones_updated_at before update on public.salones for each row execute function public.set_updated_at();
drop trigger if exists set_alumnos_updated_at on public.alumnos;
create trigger set_alumnos_updated_at before update on public.alumnos for each row execute function public.set_updated_at();
drop trigger if exists set_profesores_updated_at on public.profesores;
create trigger set_profesores_updated_at before update on public.profesores for each row execute function public.set_updated_at();
drop trigger if exists set_cursos_updated_at on public.cursos;
create trigger set_cursos_updated_at before update on public.cursos for each row execute function public.set_updated_at();
drop trigger if exists set_bimestres_updated_at on public.bimestres;
create trigger set_bimestres_updated_at before update on public.bimestres for each row execute function public.set_updated_at();
drop trigger if exists set_notas_updated_at on public.notas;
create trigger set_notas_updated_at before update on public.notas for each row execute function public.set_updated_at();
drop trigger if exists set_asistencia_updated_at on public.asistencia;
create trigger set_asistencia_updated_at before update on public.asistencia for each row execute function public.set_updated_at();
drop trigger if exists set_pagos_updated_at on public.pagos;
create trigger set_pagos_updated_at before update on public.pagos for each row execute function public.set_updated_at();
drop trigger if exists set_comunicados_updated_at on public.comunicados;
create trigger set_comunicados_updated_at before update on public.comunicados for each row execute function public.set_updated_at();

drop trigger if exists audit_notas_change on public.notas;
create trigger audit_notas_change after insert or update or delete on public.notas for each row execute function public.audit_critical_change();
drop trigger if exists audit_asistencia_change on public.asistencia;
create trigger audit_asistencia_change after insert or update or delete on public.asistencia for each row execute function public.audit_critical_change();
drop trigger if exists audit_pagos_change on public.pagos;
create trigger audit_pagos_change after insert or update or delete on public.pagos for each row execute function public.audit_critical_change();

alter table public.usuarios enable row level security;
alter table public.salones enable row level security;
alter table public.alumnos enable row level security;
alter table public.profesores enable row level security;
alter table public.cursos enable row level security;
alter table public.bimestres enable row level security;
alter table public.cursos_profesor enable row level security;
alter table public.notas enable row level security;
alter table public.asistencia enable row level security;
alter table public.pagos enable row level security;
alter table public.comunicados enable row level security;
alter table public.auditoria enable row level security;

create policy "usuarios_update_self" on public.usuarios for update using (id = public.current_usuario_id());
create policy "profesores_update_self" on public.profesores for update using (usuario_id = public.current_usuario_id());

create policy "usuarios_select_self_or_admin" on public.usuarios for select using (public.is_admin() or id = public.current_usuario_id());
create policy "usuarios_admin_all" on public.usuarios for all using (public.is_admin()) with check (public.is_admin());

create policy "salones_read_authenticated" on public.salones for select using (auth.role() = 'authenticated');
create policy "salones_admin_all" on public.salones for all using (public.is_admin()) with check (public.is_admin());

create policy "alumnos_admin_all" on public.alumnos for all using (public.is_admin()) with check (public.is_admin());
create policy "alumnos_select_self" on public.alumnos for select using (usuario_id = public.current_usuario_id());
create policy "alumnos_profesor_select_asignados" on public.alumnos for select using (
  public.current_user_role() = 'profesor'
  and salon_id in (select cp.salon_id from public.cursos_profesor cp where cp.profesor_id = public.current_profesor_id())
);

create policy "profesores_admin_all" on public.profesores for all using (public.is_admin()) with check (public.is_admin());
create policy "profesores_select_self" on public.profesores for select using (usuario_id = public.current_usuario_id());

create policy "cursos_read_authenticated" on public.cursos for select using (auth.role() = 'authenticated');
create policy "cursos_admin_all" on public.cursos for all using (public.is_admin()) with check (public.is_admin());

create policy "bimestres_read_authenticated" on public.bimestres for select using (auth.role() = 'authenticated');
create policy "bimestres_admin_all" on public.bimestres for all using (public.is_admin()) with check (public.is_admin());

create policy "cursos_profesor_admin_all" on public.cursos_profesor for all using (public.is_admin()) with check (public.is_admin());
create policy "cursos_profesor_profesor_select_self" on public.cursos_profesor for select using (profesor_id = public.current_profesor_id());

create policy "comunicados_admin_all" on public.comunicados for all using (public.is_admin()) with check (public.is_admin());
create policy "comunicados_select_publicados_por_rol" on public.comunicados for select using (
  publicado = true and (destinatario is null or destinatario = public.current_user_role())
);

create policy "notas_admin_all" on public.notas for all using (public.is_admin()) with check (public.is_admin());
create policy "notas_alumno_select_self" on public.notas for select using (alumno_id = public.current_alumno_id());
create policy "notas_profesor_select_asignadas" on public.notas for select using (
  public.current_user_role() = 'profesor'
  and exists (
    select 1
    from public.alumnos a
    join public.cursos_profesor cp on cp.salon_id = a.salon_id and cp.curso_id = notas.curso_id
    where a.id = notas.alumno_id and cp.profesor_id = public.current_profesor_id()
  )
);
create policy "notas_profesor_insert_asignadas" on public.notas for insert with check (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
  and exists (
    select 1
    from public.alumnos a
    join public.cursos_profesor cp on cp.salon_id = a.salon_id and cp.curso_id = notas.curso_id
    where a.id = notas.alumno_id and cp.profesor_id = public.current_profesor_id()
  )
);
create policy "notas_profesor_update_asignadas" on public.notas for update using (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
) with check (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
);

create policy "asistencia_admin_all" on public.asistencia for all using (public.is_admin()) with check (public.is_admin());
create policy "asistencia_alumno_select_self" on public.asistencia for select using (alumno_id = public.current_alumno_id());
create policy "asistencia_profesor_select_asignada" on public.asistencia for select using (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
);
create policy "asistencia_profesor_write_asignada" on public.asistencia for all using (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
) with check (
  public.current_user_role() = 'profesor'
  and profesor_id = public.current_profesor_id()
);

create policy "pagos_admin_all" on public.pagos for all using (public.is_admin()) with check (public.is_admin());
create policy "pagos_alumno_select_self" on public.pagos for select using (alumno_id = public.current_alumno_id());

create policy "auditoria_admin_select" on public.auditoria for select using (public.is_admin());
create policy "auditoria_system_insert" on public.auditoria for insert with check (auth.role() = 'authenticated');

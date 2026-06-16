do $$ begin
  alter type public.app_role add value if not exists 'padre';
exception
  when duplicate_object then null;
end $$;

alter table public.alumnos
  add column if not exists padre_usuario_id uuid references public.usuarios(id) on delete set null;

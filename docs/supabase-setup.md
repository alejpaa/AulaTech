# Configuracion Supabase AULA-TECH

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores del proyecto Supabase.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

La app usa la clave recomendada por Supabase `sb_publishable_...`. No se configura `service_role`, `sb_secret_...` ni una API/backend propio dentro de Next.js.

La seguridad de datos depende de Supabase Auth, RLS y policies por rol.

## Base de datos

Ejecuta `supabase/migrations/0001_initial_schema.sql` en Supabase SQL Editor o con Supabase CLI.

La migracion crea:

- enums de roles, pagos y asistencia
- tablas principales del dominio escolar
- relaciones e indices base
- funciones helper para RLS
- triggers de `updated_at`
- auditoria automatica para notas, asistencia y pagos
- policies RLS para administrativo, profesor y alumno

## Primer usuario administrativo

1. Crea un usuario en Supabase Auth.
2. Inserta su perfil en `public.usuarios` usando el `auth.users.id` como `auth_user_id`.

```sql
insert into public.usuarios (auth_user_id, rol, nombres, apellidos, email)
values ('AUTH_USER_ID', 'administrativo', 'Admin', 'Principal', 'admin@aula-tech.local');
```

Para crear usuarios sin depender de correos de confirmacion revisa `docs/auth-users.md`.

## Orden recomendado de implementacion

1. Login real con Supabase Auth desde el cliente Supabase.
2. Dashboards protegidos por rol.
3. Comunicados.
4. Alumnos, profesores, salones y cursos.
5. Notas con auditoria.
6. Asistencia.
7. Pagos.
8. Reportes PDF/Excel.

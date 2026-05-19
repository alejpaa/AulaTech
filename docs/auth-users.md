# Creacion De Usuarios

## Enfoque recomendado

AULA-TECH no debe tener registro publico de cuentas. Los usuarios deben ser creados por administracion escolar y luego se les asigna un rol interno.

El flujo correcto es:

```txt
1. Crear usuario en Supabase Auth.
2. Confirmar el usuario o crearlo ya confirmado.
3. Crear su perfil en public.usuarios.
4. Asignar rol: administrativo, profesor o alumno.
```

## Opcion recomendada para desarrollo

En Supabase Dashboard:

```txt
Authentication -> Users -> Add user
```

Completa correo y contrasena. Si aparece la opcion, activa:

```txt
Auto Confirm User
```

Luego copia el `User UID` creado.

Despues ejecuta en SQL Editor:

```sql
insert into public.usuarios (
  auth_user_id,
  rol,
  nombres,
  apellidos,
  email,
  activo
)
values (
  'USER_UID_DE_AUTH',
  'administrativo',
  'Admin',
  'Principal',
  'admin@colegio.com',
  true
);
```

## Si el correo queda pendiente de confirmacion

Para desarrollo puedes desactivar confirmacion por correo:

```txt
Authentication -> Providers -> Email -> Confirm email OFF
```

Luego crea el usuario otra vez o confirma el usuario desde el Dashboard si Supabase muestra esa accion.

## Opcion rapida solo para desarrollo

Si ya creaste el usuario y quedo sin confirmar, puedes confirmarlo desde SQL Editor:

```sql
update auth.users
set email_confirmed_at = now()
where email = 'admin@colegio.com';
```

Usa esto solo en desarrollo. En produccion es mejor usar las opciones del Dashboard o un proceso administrativo controlado.

## Roles validos

```txt
administrativo
profesor
alumno
```

## Ejemplo profesor

```sql
insert into public.usuarios (auth_user_id, rol, nombres, apellidos, email, activo)
values ('USER_UID_DE_AUTH', 'profesor', 'Luis', 'Ramirez', 'profesor@colegio.com', true);
```

## Ejemplo alumno

```sql
insert into public.usuarios (auth_user_id, rol, nombres, apellidos, email, activo)
values ('USER_UID_DE_AUTH', 'alumno', 'Maria', 'Lopez', 'alumno@colegio.com', true);
```

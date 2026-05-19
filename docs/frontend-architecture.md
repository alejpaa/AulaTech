# Arquitectura Frontend

## Objetivo

La UI de AULA-TECH debe escalar por roles y modulos sin mezclar presentacion, validacion, permisos y acceso a datos.

## Estructura

```txt
app/
├─ admin/
├─ profesor/
├─ alumno/
└─ login/

components/
├─ ui/
└─ layout/

features/
├─ alumnos/
├─ asistencia/
├─ comunicados/
├─ notas/
├─ pagos/
├─ profesores/
└─ salones/

hooks/
lib/
config/
types/
```

## Responsabilidades

- `app`: rutas, layouts, carga inicial y composicion de paginas.
- `components/ui`: componentes reutilizables sin dependencia del dominio.
- `components/layout`: shell, navegacion, headers y contenedores.
- `features`: cada modulo contiene sus validaciones, consultas reutilizables y componentes propios.
- `hooks`: hooks cliente genericos.
- `lib`: integraciones, auth, Supabase y utilidades.
- `config`: navegacion y constantes.
- `types`: contratos compartidos.

## Tailwind

Tailwind se usa directamente en componentes. Para clases condicionales se usa `cn()`:

```ts
import { cn } from "@/lib/utils/cn";
```

No se recomienda crear CSS global para cada modulo. El CSS global debe reservarse para tokens base, fuentes y estilos del documento.

## Server First

Por defecto, los componentes deben ser Server Components. Solo usar `"use client"` cuando sea necesario.

Casos para cliente:

- formularios interactivos
- estados locales
- dialogs
- menus desplegables
- hooks del navegador

Casos para servidor:

- carga inicial de datos
- validacion de rol
- queries sensibles
- composicion de paginas protegidas

## Acceso A Datos

No se usa API propia ni Server Actions para operaciones de negocio. El frontend consume la API autogenerada de Supabase con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Cada operacion debe seguir este orden:

```txt
1. validar input con Zod en el formulario
2. ejecutar operacion con el cliente Supabase
3. dejar que RLS autorice o rechace la operacion
4. mostrar feedback al usuario
```

## Modulos

Cada modulo debe crecer asi:

```txt
features/notas/
├─ schemas.ts
├─ components/
│  ├─ notas-filter.tsx
│  ├─ notas-table.tsx
│  └─ nota-form.tsx
└─ queries.ts
```

`queries.ts` se agrega solo si el modulo necesita lecturas reutilizables contra Supabase. No debe convertirse en API propia; solo encapsula llamadas al cliente Supabase.

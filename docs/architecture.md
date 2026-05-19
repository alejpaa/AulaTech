# Arquitectura AULA-TECH

## Enfoque

Supabase es el backend completo del proyecto: Auth, API autogenerada, PostgreSQL, RLS y auditoria en base de datos. Next.js queda como capa frontend con App Router, componentes, layouts y consumo directo del cliente Supabase.

## Capas

- `app/`: App Router, layouts y rutas web.
- `components/ui/`: componentes visuales atomicos reutilizables, sin reglas de negocio.
- `components/layout/`: estructura de pantalla, shell autenticado, headers y grillas.
- `features/`: modulos de negocio. Cada modulo agrupa `schemas.ts` y futuros componentes especificos.
- `hooks/`: hooks cliente reutilizables y desacoplados del dominio.
- `config/`: configuracion estatica de navegacion, modulos y constantes de aplicacion.
- `types/`: tipos compartidos de aplicacion.
- `lib/supabase/`: clientes Supabase para browser y server usando URL + publishable key.
- `lib/auth/`: roles, sesion y autorizacion server-side.
- `proxy.ts`: refresco de sesion y control de rutas `/admin`, `/profesor` y `/alumno`.
- `supabase/migrations/`: esquema SQL, RLS y policies.

## Frontend

Tailwind CSS esta configurado con la sintaxis actual `@import "tailwindcss"` en `app/globals.css`.

La UI debe seguir esta regla:

- `components/ui`: botones, inputs, cards, badges y componentes genericos.
- `components/layout`: composicion de paginas y navegacion.
- `features/<modulo>/components`: formularios o tablas especificas del modulo.
- `features/<modulo>/schemas.ts`: validaciones Zod del modulo.
- `features/<modulo>/components`: UI especifica del modulo.

Ejemplo recomendado para un modulo nuevo:

```txt
features/comunicados/
├─ schemas.ts
└─ components/
   ├─ comunicado-form.tsx
   └─ comunicados-table.tsx
```

Los componentes cliente deben declararse con `"use client"` solo cuando usen estado, efectos, eventos del navegador o hooks cliente.

## Convenciones

- Consumir Supabase directamente con `createSupabaseBrowserClient()` en componentes cliente cuando haya interaccion.
- Usar Server Components solo para render inicial y lectura con sesion, sin crear APIs propias.
- Validar formularios con Zod antes de enviar a Supabase.
- Mantener RLS como control definitivo en Supabase para lecturas y escrituras.
- Centralizar clases condicionales con `cn()`.
- Evitar duplicar navegacion por rol; usar `config/navigation.ts`.

## Reglas de seguridad

- Las lecturas simples pueden usar Supabase desde Server Components o Client Components.
- Las mutaciones deben ir directo a Supabase y quedar protegidas por RLS.
- Los reportes deben generarse en cliente con datos permitidos por RLS o, si requieren backend, moverse a Supabase Edge Functions.
- RLS siempre debe estar activo en tablas sensibles.
- No se usa service role key en la app Next.js.

## Rutas por rol

- `administrativo`: `/admin`
- `profesor`: `/profesor`
- `alumno`: `/alumno`

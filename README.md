# Aula Tech

Plataforma de aula virtual diseñada para colegios en Perú. Optimiza el aprendizaje y el control administrativo integrando gestión de notas, asistencia, pagos y comunicación docente-alumno, eliminando la dependencia de documentos físicos.

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + Tailwind CSS (TypeScript) |
| Backend | Node.js + Express (TypeScript) |
| Base de datos | Supabase (PostgreSQL + PLpgSQL) |
| Deploy | Vercel (frontend) |
| CI/CD | GitHub Actions |
| Diseño UI | Figma |

---

## Módulos del sistema

- **Aula Virtual** — comunicación alumno-docente y publicación de comunicados
- **Notas** — registro, cálculo de promedios y semáforo de alerta temprana
- **Asistencia** — control diario con indicadores visuales
- **Pagos** — estado mensual/anual de pagos por alumno
- **Perfil del estudiante** — vista consolidada para padres de familia
- **Autenticación** — login unificado con selección de rol (docente / padre / administrativo) vía JWT

---

## Estructura del repositorio

```
/
├── frontend/          # App React + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── ...
├── db/
│   └── migrations/    # Scripts SQL (YYYYMMDD_descripcion.sql)
├── .github/
│   └── workflows/     # Pipelines CI/CD (GitHub Actions)
└── README.md
```

---

## Configuración local

### Prerrequisitos

- Node.js >= 18
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (solo para deploy)

### 1. Clonar el repositorio

```bash
git clone https://github.com/jerson-null/Proyecto-GestionDeLaConfiguracion.git
```

### 2. Variables de entorno

Crea un archivo `.env` en la raíz del backend (y del frontend si aplica) basándote en `.env.example`:

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
PORT=3000
NODE_ENV=development
```

### 3. Instalar dependencias

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Ejecutar migraciones en Supabase

Aplica los scripts de la carpeta `/db/migrations/` desde el SQL Editor de Supabase o con la CLI:

```bash
supabase db push
```

### 5. Levantar el proyecto en desarrollo

```bash
# Backend
cd backend && npm run dev

# Frontend (en otra terminal)
cd frontend && npm run dev
```

---

## Deploy en Vercel

El frontend se despliega automáticamente en **Vercel** al hacer merge a `main`.

Para configurar manualmente:

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Establece el directorio raíz como `frontend/`
3. Agrega las variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.)
4. Vercel detectará React automáticamente y hará el build

El backend puede desplegarse en Railway, Render, o como Serverless Functions en Vercel según la configuración del equipo.

---

## Flujo de ramas (Git Flow)

```
main          ← producción estable (solo merge desde release/*)
develop       ← integración continua
feature/*     ← nuevas funcionalidades (ej: feature/SCR-042-modulo-pagos)
release/*     ← preparación de versión (ej: release/v1.0)
hotfix/*      ← correcciones urgentes en producción
```

**Reglas:**
- Todo cambio a `develop` requiere Pull Request con al menos **1 revisión aprobada**
- Los mensajes de commit deben seguir el estándar: `tipo(módulo): descripción` (ej: `feat(notas): agregar cálculo de promedio ponderado`)

---

## Tests y CI/CD

El pipeline de GitHub Actions se ejecuta en cada Pull Request hacia `develop` y cubre:

- Lint (ESLint + TypeScript check)
- Tests unitarios
- Tests de integración
- Build de producción

Un PR solo puede mergearse si el pipeline está en **verde ✅**.

---

## Gestión de cambios

Los cambios se registran como **GitHub Issues** con la etiqueta `change-request` (SCR). El flujo es:

1. Abrir issue con descripción, módulo afectado, justificación y prioridad
2. Evaluación de impacto por el SCMR y el equipo técnico
3. Aprobación por el CCB (Comité de Control de Configuración)
4. Crear rama `feature/SCR-NNN-descripcion` desde `develop`
5. Implementar, pasar CI y abrir PR con referencia al issue
6. Merge tras revisión → el SCMR actualiza el Registro de Versiones

---

## Base de datos (Supabase)

Las tablas principales en Supabase son: `usuarios`, `salones`, `notas`, `asistencia`, `pagos` y `comunicados`.

Las migraciones se versionan en `/db/migrations/` con el formato `YYYYMMDD_descripcion.sql` y se aplican en orden cronológico.

---

## Seguridad

- Datos personales de alumnos cifrados en reposo y en tránsito (cumplimiento Ley N° 29733)
- Autenticación con JWT; refresh tokens almacenados de forma segura
- Row Level Security (RLS) habilitado en Supabase por rol de usuario
- Acceso al repositorio restringido a integrantes del equipo con credenciales corporativas

---

## Estado del proyecto

| Fase | Estado |
|---|---|
| Fase 0 – Setup & SCM | ✅ Completado |
| Fase 1 – Análisis y Diseño UI/UX | ✅ Completado |
| Fase 2 – Arquitectura & Setup Técnico | 🔄 En progreso |
| Fase 3 – Desarrollo de Módulos | 🔄 Pendiente |
| Fase 4 – Integración y Pruebas | ⏳ Pendiente |
| Fase 5 – Cierre y Entrega Final | ⏳ Pendiente |

**Versión actual:** `v0.x (develop)` — entrega final estimada: julio 2025

---

## Equipo

Proyecto desarrollado por **Equipo Aula Tech** — Grupo 7

Gestión de configuración a cargo del **SCMR Aula Tech**

---

## Licencia

Uso interno académico — Aula Tech © 2026

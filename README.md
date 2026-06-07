# Plataforma de Cursos (White-Label)

Plataforma de venta de cursos online lista para producción y **re-marcable** (white-label).
La instancia de demo está configurada como **Barber Academy Pro** (academia de barbería), pero
puede adaptarse a cualquier nicho cambiando un único archivo de configuración.

Monorepo con **NestJS + Prisma + PostgreSQL** (API) y **Next.js 15 + Tailwind + React Query** (web).

## Características

- **Autenticación** JWT con access/refresh tokens y rotación automática.
- **Cursos** con módulos y lecciones (video), página de venta y reproductor.
- **Progreso** por lección con porcentaje de avance persistente.
- **Pagos** multi-proveedor: Stripe, Mercado Pago y Binance Pay (cripto), con webhooks.
- **Certificados** en PDF descargables al completar el curso.
- **Soporte** con sistema de tickets y conversación usuario ↔ administrador.
- **Panel de administración**: analíticas (ingresos, usuarios, conversión), gestión de usuarios, pagos y tickets.
- **White-label**: branding, textos, colores y secciones de la landing centralizados.

## Estructura

```
.
├── apps/
│   ├── api/        # Backend NestJS + Prisma
│   └── web/        # Frontend Next.js (App Router)
├── packages/
│   └── shared/     # Tipos, enums y esquemas Zod compartidos
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Requisitos

- Node.js >= 20
- pnpm >= 9 (probado con 11)
- Docker (para PostgreSQL)

## Puesta en marcha

```bash
# 1. Instalar dependencias
pnpm install

# 2. Variables de entorno (ya creadas a partir de .env.example)
#    Revisa .env, apps/api/.env y apps/web/.env.local

# 3. Levantar PostgreSQL (mapeado al puerto host 5433)
pnpm db:up

# 4. Migrar la base de datos
pnpm db:migrate

# 5. Cargar datos de ejemplo (curso + usuarios demo)
pnpm db:seed

# 6. Arrancar API y web en paralelo
pnpm dev
```

- **Web**: http://localhost:3000
- **API**: http://localhost:4000/api
- **Swagger (docs API)**: http://localhost:4000/api/docs

### Usuarios demo

| Rol   | Email           | Contraseña |
|-------|-----------------|------------|
| Admin | admin@demo.com  | Admin1234  |
| User  | user@demo.com   | User1234   |

## White-label: re-marcar la plataforma

Toda la identidad de marca vive en:

```
apps/web/content/site.config.ts
```

Allí defines nombre, logo (emoji), colores, hero, features, testimonios, FAQ y footer.
Los colores base de la paleta `brand` se ajustan en `apps/web/tailwind.config.ts`.
No es necesario tocar el código de las páginas para adaptar la plataforma a otro cliente o nicho.

## Pagos

Las pasarelas (Stripe, Mercado Pago, Binance) funcionan en **modo sandbox** cuando no se
configuran las claves reales en las variables de entorno, permitiendo probar el flujo completo
de checkout → webhook → acceso al curso sin credenciales externas.

Configura las claves en `apps/api/.env` para activar los proveedores reales:

```
STRIPE_SECRET_KEY=...
MERCADOPAGO_ACCESS_TOKEN=...
BINANCE_API_KEY=...
BINANCE_API_SECRET=...
```

## Scripts útiles (raíz)

| Comando            | Descripción                              |
|--------------------|------------------------------------------|
| `pnpm dev`         | API + web en modo desarrollo             |
| `pnpm build`       | Build de todos los paquetes (Turbo)      |
| `pnpm db:up`       | Levanta PostgreSQL con Docker            |
| `pnpm db:migrate`  | Aplica migraciones Prisma                |
| `pnpm db:seed`     | Carga datos de ejemplo                   |
| `pnpm db:reset`    | Resetea la base de datos                 |

## Stack

- **Backend**: NestJS 10, Prisma 6, PostgreSQL 16, JWT, Zod.
- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS, TanStack Query, Zustand, React Hook Form, Framer Motion, Lucide.
- **Monorepo**: pnpm workspaces + Turborepo.

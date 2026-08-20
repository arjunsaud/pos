# POS Nepal

Multi-tenant POS, inventory, and billing workspace.

```
posnepal/
  apps/
    frontend/   Next.js admin + POS UI
    backend/    NestJS API
    desktop/    Electron shell (network-aware)
  packages/
    shared/     Shared types, enums, helpers
```

## Apps

- **frontend** — landing, login, super-admin, tenant admin, cashier POS, inventory, billing, reports
- **backend** — NestJS API (`/api/v1/admin|user/...`)
- **desktop** — Electron app with its own React UI (same look as the website; does not embed the web app)
- **shared** — `@posnepal/shared` types/enums/helpers (e.g. `OtpType`)

## Setup

```bash
pnpm install
pnpm build:shared
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

```bash
pnpm dev                 # frontend (:3000) + backend (from .env, usually :3001)
pnpm dev:all             # backend :4000 + frontend :3000 + desktop
pnpm dev:desktop         # Electron only (needs API running)
```

- Frontend: http://localhost:3000
- Backend (`pnpm dev:all`): http://localhost:4000/api
- Backend (`pnpm dev` / `.env`): http://localhost:3001/api
- Admin swagger: http://localhost:4000/admin (with `dev:all`)
- User swagger: http://localhost:4000/user (with `dev:all`)

Seed the super admin:

```bash
pnpm seed:admin
```

Default super admin: `admin@posnepal.com` / `Test@123`

### OTP types (`OtpType`)

One-word enum values shared across apps:

| Value | Purpose |
|-------|---------|
| `FORGOT` | Forgot password |
| `VERIFY` | Email / account verification |
| `TWOFA` | Two-factor authentication |
| `LOGIN` | Login challenge |
| `CHANGE` | Change email / phone |

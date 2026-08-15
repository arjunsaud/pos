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
- **desktop** — Electron app with online/offline detection; loads the web UI securely
- **shared** — `@posnepal/shared` types/enums/helpers (e.g. `OtpType`)

## Setup

```bash
pnpm install
pnpm build:shared
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

```bash
pnpm dev                 # frontend + backend
pnpm dev:desktop         # Electron shell (needs frontend running)
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Admin swagger: http://localhost:3001/admin
- User swagger: http://localhost:3001/user

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

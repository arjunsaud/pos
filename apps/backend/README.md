# @posnepal/backend

NestJS API for POS Nepal. Layout matches the original backend:

- `src/common` — auth, database, pagination, response, request, helpers
- `src/configs` — env-backed configuration
- `src/modules` — one module per domain (entity, repository, service, admin/user controllers)
- `src/router` — `/admin` and `/user` route groups

```bash
cp .env.example .env
pnpm start:dev
```

Swagger:

- Admin: http://localhost:3001/admin
- User: http://localhost:3001/user

Seed super admin:

```bash
pnpm seed:admin
```

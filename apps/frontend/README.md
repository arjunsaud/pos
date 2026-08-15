# @posnepal/frontend

Full POS Nepal UI migrated from `admin`: landing, role login, super-admin, tenant admin, and cashier POS.

```bash
cp .env.local.example .env.local
pnpm dev
```

Runs on http://localhost:3000. Screens use the original mock data so the complete UI works without the API. Live calls go through `src/lib/api` to `NEXT_PUBLIC_API_URL`.

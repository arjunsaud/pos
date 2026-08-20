# POS Nepal Desktop (`apps/desktop`)

Native Electron app with **its own React UI** — designed to match the website (not embedded).

```
src/                 Main process, preload, architecture
ui/                  React desktop UI (Vite + Tailwind)
```

Tenant admin and staff only. Super admin stays on the web app.

## Shortcuts (same as web)

| Action | Keys |
|--------|------|
| Command palette | ⌘K / Ctrl+K |
| Dashboard | ⌘1 / Ctrl+1 |
| POS | ⌘2 / Ctrl+2 |
| Products | ⌘3 / Ctrl+3 |
| Inventory | ⌘4 / Ctrl+4 |
| Sales | ⌘5 / Ctrl+5 |
| Focus barcode | F2 |
| Checkout | F9 |
| Clear | Esc |

## Run

```bash
pnpm --filter @posnepal/backend start:dev
pnpm --filter @posnepal/desktop dev
```

Or `pnpm dev:all` for backend + frontend + desktop.

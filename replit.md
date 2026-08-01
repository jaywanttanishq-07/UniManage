# UniManage

A full-stack university management system covering students, teachers, courses, exams, fees, library, hostel, transport, timetable, attendance, scholarships, and notices — with a public-facing home site and dark/light theme.

## Run & Operate

- `pnpm --filter @workspace/unimanage run dev` — run the React frontend (Vite, reads `PORT`)
- `pnpm --filter @workspace/api-server run dev` — run the Express API server (reads `PORT`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (runtime-managed by Replit; do not set manually)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + React Router v7 + Vite 7 + Tailwind CSS v4
- API: Express 5 + Pino logger
- DB: PostgreSQL + Drizzle ORM (schema in `lib/db/src/schema/`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle for API)

## Where things live

- `artifacts/unimanage/src/` — React frontend source
  - `contexts/ThemeContext.tsx` — dark/light theme provider with localStorage persistence
  - `components/MeshBackground.tsx` — animated mesh gradient (gold+blue in light, vivid random in dark)
  - `components/NavBar.tsx` — sidebar nav with theme toggle
  - `styles.css` — all custom CSS with `[data-theme="dark"]` and `[data-theme="light"]` vars
  - `pages/Home.tsx` — public landing page
  - `pages/AboutUs.tsx` — about page
  - `pages/Contact.tsx` — contact page with form
  - `pages/SettingsPage.tsx` — settings with localStorage persistence + theme picker
- `artifacts/api-server/src/` — Express API source
- `lib/db/src/schema/index.ts` — Drizzle DB schema (add tables here)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)

## Routing

- `/` → Home page (public, no sidebar)
- `/about` → About Us (public)
- `/contact` → Contact (public)
- `/dashboard` → Main dashboard (sidebar layout)
- All other routes (`/students`, `/settings`, etc.) → sidebar layout

## Architecture decisions

- Theme is applied via `data-theme` attribute on `<html>` and stored in `localStorage` under `um-theme`.
- Settings page persists all settings to `localStorage` under `um-settings`; notification toggles save immediately on click.
- Public pages (`/`, `/about`, `/contact`) render without the sidebar; all app pages render with the sidebar.
- `DATABASE_URL` is auto-provided by Replit's managed PostgreSQL — runtime-managed, never set manually.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `DATABASE_URL` and `PGHOST`/`PGPORT`/etc. are runtime-managed by Replit. Do not request or set them.
- DB schema lives in `lib/db/src/schema/index.ts` — add exports there and run `pnpm --filter @workspace/db run push` to push.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

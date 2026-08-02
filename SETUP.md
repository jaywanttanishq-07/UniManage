# UniManage — Local Development Setup

> Works on macOS, Linux, and Windows (WSL2).

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | ≥ 9 | `npm i -g pnpm` |
| Docker Desktop | any | https://www.docker.com/products/docker-desktop (for local PostgreSQL) |

---

## 1 — Clone & install

```bash
git clone <your-repo-url> unimanage
cd unimanage
pnpm install
```

---

## 2 — Configure environment

```bash
cp .env.example .env
```

Open `.env` and set:

| Variable | What to put |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/unimanage` (default) |
| `SESSION_SECRET` | Run `openssl rand -hex 32` and paste the result |
| `NODE_ENV` | `development` |
| `PORT` | `3001` (API) |
| `VITE_PORT` | `5173` (frontend) |
| `BASE_PATH` | `/` |

> ⚠️ Never commit `.env` — it is in `.gitignore`.

---

## 3 — Start PostgreSQL (Docker)

```bash
docker compose up -d
```

This starts a local PostgreSQL 16 instance on `localhost:5432`.
Data is persisted in the `postgres_data` Docker volume.

To stop it: `docker compose down`
To wipe data: `docker compose down -v`

---

## 4 — Push the database schema

```bash
pnpm --filter @workspace/db run push
```

This uses Drizzle Kit to apply the schema from `lib/db/src/schema/` to your local database.

---

## 5 — Run the app

Open **two terminals** (or use the VS Code Launch configuration below):

**Terminal 1 — API server:**
```bash
pnpm --filter @workspace/api-server run dev
# Listens on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
pnpm --filter @workspace/unimanage run dev
# Opens http://localhost:5173
```

---

## 6 — VS Code (optional but recommended)

Install recommended extensions when VS Code prompts, or run:

```
Extensions: Show Recommended Extensions
```

**Launch everything at once** via the Run & Debug panel → **Launch All** (runs API + Frontend in parallel).

---

## Useful commands

```bash
# Typecheck all packages
pnpm run typecheck

# Build everything
pnpm run build

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push
```

---

## Project structure

```
unimanage/
├── artifacts/
│   ├── api-server/          # Express REST API
│   │   └── src/
│   │       ├── app.ts       # Express app + security middleware
│   │       ├── middlewares/ # helmet, CORS, rate-limit, error handler
│   │       └── routes/      # API route handlers
│   └── unimanage/           # React + Vite frontend
│       └── src/
│           ├── contexts/    # ThemeContext (dark/light)
│           ├── components/  # NavBar, MeshBackground
│           └── pages/       # All 17+ page components
├── lib/
│   ├── db/                  # Drizzle ORM schema + client
│   ├── api-spec/            # OpenAPI spec (source of truth)
│   ├── api-zod/             # Generated Zod validators
│   └── api-client-react/    # Generated React Query hooks
├── .env.example             # Copy to .env, fill in values
├── docker-compose.yml       # Local PostgreSQL
└── SETUP.md                 # This file
```

---

## Security notes

- `ALLOWED_ORIGINS` in `.env` controls which frontend origins the API accepts (production only). In development all origins are allowed.
- Rate limiting (200 req/15 min globally, 50 req/15 min on write endpoints) is active in `NODE_ENV=production` only.
- Stack traces are never sent to clients in production — only generic messages.
- Query strings are never logged (they may contain tokens).

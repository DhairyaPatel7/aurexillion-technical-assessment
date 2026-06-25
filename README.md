# Support Ticket Dashboard

A compact full-stack app for viewing, creating, and updating customer support
tickets. Next.js + TypeScript on the front, FastAPI + PostgreSQL on the back.

The whole thing runs with a single command via Docker, or each piece can be run
on its own for development.

## Tech stack

| Layer    | Choice |
| -------- | ------ |
| Frontend | Next.js (App Router), TypeScript, hand-written CSS |
| Backend  | FastAPI (Python 3.12), SQLModel, Alembic |
| Database | PostgreSQL |
| Tests    | pytest (backend), Vitest + Testing Library (frontend) |
| Tooling  | uv, Ruff, ESLint + Prettier, Docker Compose, GitHub Actions |

## Quick start (Docker)

The only requirement is Docker. From the repository root:

```bash
docker compose up
```

That starts Postgres, runs the database migrations, seeds a handful of sample
tickets, and serves the API and the UI. Once it's up:

- Web app: http://localhost:3000
- API: http://localhost:8000
- API docs (Swagger): http://localhost:8000/docs

Ports `3000`, `8000`, and `5432` need to be free.

## Running locally without Docker

### Backend

Requires [uv](https://docs.astral.sh/uv/) and a running PostgreSQL instance.

```bash
cd server
cp .env.example .env          # adjust DATABASE_URL if your Postgres differs
uv sync                       # installs dependencies (Python 3.12 is pinned)
uv run alembic upgrade head   # create the schema
uv run python -m app.seed     # insert sample tickets (safe to re-run)
uv run uvicorn app.main:app --reload
```

The default `DATABASE_URL` expects a database named `tickets` owned by a
`tickets` user. Create one to match, or point `DATABASE_URL` at your own.

### Frontend

Requires Node 20+.

```bash
cd client
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL, defaults to localhost:8000
npm install
npm run dev
```

Then open http://localhost:3000.

## Database and seed data

- PostgreSQL, accessed through SQLModel/SQLAlchemy.
- The schema is managed with **Alembic migrations** (`alembic upgrade head`); the
  app doesn't create tables on the fly.
- Sample data is inserted by `python -m app.seed`, which is idempotent — it only
  seeds when the table is empty.
- With Docker, migrations and seeding run automatically on startup.

## Running the tests

**Backend** — needs a Postgres `tickets_test` database. The Docker `db` service
creates it for you:

```bash
docker compose up -d db        # or use any local Postgres + `createdb tickets_test`
cd server
uv run pytest
```

**Frontend**:

```bash
cd client
npm test
```

Both suites run in CI (GitHub Actions) on every push.

## API

REST, JSON in and out. The resource API is versioned under `/api/v1`.

| Method  | Path                    | Description                                  |
| ------- | ----------------------- | -------------------------------------------- |
| `GET`   | `/api/v1/tickets`       | List tickets (`?status=`, `?priority=`, `?search=`) |
| `GET`   | `/api/v1/tickets/{id}`  | Get one ticket                               |
| `POST`  | `/api/v1/tickets`       | Create a ticket (always starts `open`)       |
| `PATCH` | `/api/v1/tickets/{id}`  | Update a ticket (primarily its status)       |
| `GET`   | `/api/health`           | Liveness check                               |

A ticket looks like:

```json
{
  "id": 1,
  "title": "Unable to complete payment",
  "description": "The customer receives an error after submitting the payment form.",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "status": "open",
  "priority": "high",
  "createdAt": "2026-06-18T10:30:00Z",
  "updatedAt": "2026-06-18T10:30:00Z"
}
```

Statuses are `open`, `in_progress`, `resolved`; priorities are `low`, `medium`,
`high`. Validation errors return `422`, a missing ticket returns `404`, and an
empty update returns `400`.

## Project structure

```
client/   Next.js + TypeScript frontend
  app/        routes (list, tickets/new, tickets/[id])
  components/ presentational + interactive components
  lib/        typed API client, types, formatting
server/   FastAPI backend
  app/        main, routes, models, schemas, database, seed, config
  migrations/ Alembic migrations
  tests/      pytest suite
db/       Postgres init (creates the test database)
```

## Assumptions and trade-offs

- **API versioning.** Endpoints live under `/api/v1` rather than the brief's
  literal `/api/tickets`. The brief allows a different route structure as long as
  it's documented — versioning keeps the response contract free to evolve without
  breaking clients.
- **Extra `updated_at` field.** Beyond the required fields, tickets carry an
  `updated_at` timestamp (bumped on every change), which the details page shows
  as "last updated".
- **camelCase JSON, snake_case database.** The database columns are snake_case;
  the API speaks camelCase to read naturally in the TypeScript frontend. The two
  are mapped explicitly at the route boundary.
- **One `Ticket` table.** Customers aren't modelled separately — name and email
  live on the ticket, which is enough for this scope.
- **Status updates happen on the details page** via an accessible select. The
  brief allows the control on the list or the details view; details keeps the list
  clean.
- **No authentication.** Out of scope here, so the API is open.
- **Hand-written CSS** instead of a component library, to keep the bundle small
  and the styling easy to read.
- **Postgres over SQLite.** Heavier to set up locally, so Docker Compose provides
  it; the brief accepts either.

## What I'd add with more time

- A Kanban board with drag-and-drop status changes (the API already supports it).
- A search box wired to the existing `?search=` parameter.
- Pagination and sorting for larger ticket volumes.
- Authentication and role-based access.
- Optimistic UI updates with rollback, plus more frontend tests (details page,
  error paths).
- An end-to-end test (Playwright) and a deployed demo.

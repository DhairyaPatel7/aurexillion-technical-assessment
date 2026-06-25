# Support Ticket Dashboard

A small full-stack app for viewing, creating, and updating customer support
tickets. Next.js + TypeScript frontend, FastAPI backend, PostgreSQL for storage.

> Work in progress — this README is filled in as the project is built.

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript
- **Backend:** FastAPI (Python), SQLModel, Alembic migrations
- **Database:** PostgreSQL
- **Tests:** pytest (backend), Vitest + Testing Library (frontend)
- **Tooling:** Ruff, ESLint + Prettier, GitHub Actions CI, Docker Compose

## Getting started

The whole stack is designed to run with a single command:

```bash
docker compose up
```

Then open http://localhost:3000 (API at http://localhost:8000, docs at
http://localhost:8000/docs).

Running each service on its own for development is documented below as the app
takes shape.

## Project structure

```
client/   Next.js + TypeScript frontend
server/   FastAPI backend (app, migrations, tests)
```

## Database & migrations

_TBD_

## Running the tests

_TBD_

## API

_TBD_

## Assumptions & trade-offs

_TBD_

## Future improvements

_TBD_

# Stringventory Agent Guide

## Repository shape

This workspace contains two independently managed applications:

- `backend/`: ES module Express API using Knex, Zod, JWT authentication, Pino logging, and Jest/Supertest.
- `frontend/`: React 19 + Vite application using React Router, Tailwind CSS v4, Axios, and feature-based pages/components.

Run commands from the relevant application directory. There is no root package manager script.

## Common commands

Backend (`cd backend`):

- `pnpm install`
- `pnpm run dev` or `pnpm start`
- `pnpm test`, `pnpm run test:watch`, `pnpm run test:coverage`
- `pnpm run lint` and `pnpm run format`
- `pnpm run migrate`, `pnpm run migrate:rollback`, `pnpm run seed`

Frontend (`cd frontend`):

- `pnpm install`
- `pnpm run dev`
- `pnpm run build`
- `pnpm run lint`
- `pnpm run preview`

For backend changes, run the narrowest relevant Jest test when one exists, then `pnpm run lint`. For frontend changes, run `pnpm run lint` and `pnpm run build` when the change affects application code or routing. Backend currently has no discovered test files, so do not claim runtime behavior is covered by tests without adding or running one.

## Backend conventions

- Keep route modules focused on URL/middleware composition, controllers thin, and business logic in services.
- Put reusable persistence behavior in models, which follow the `BaseModel` pattern; inspect `src/models/BaseModel.js` and `src/models/UserModel.js` before adding a model.
- Define request validation in `src/validators/schemas.js` and apply it through the validation middleware.
- Use the existing response/error helpers and async-handler conventions rather than introducing another response shape.
- Register new API modules in `src/routes/index.js`; the API is mounted under `/api/v1` and the legacy `/api` path.
- Add migrations through Knex commands. Do not edit an already-applied migration to change schema history.

Important operational checks:

- Backend configuration is read from `.env`; copy from `.env.example` and provide JWT secrets of at least 32 characters.
- `docker-compose.yml` uses PostgreSQL, while environment defaults may still show MySQL values. Set `DB_CLIENT`, port, and credentials explicitly for the selected database.
- `backend/Dockerfile` starts `node src/server.js` directly, so do not assume deployment runs migrations automatically.
- Treat local uploads as runtime data; configure durable storage or a persistent volume when needed.

## Frontend conventions

- Keep route composition in `src/router` and page-level features in `src/pages`; preserve the existing auth/protected/role route guards.
- Compose cross-cutting state through `src/providers/Providers.jsx` and reuse existing hooks/providers before adding global state.
- Use `src/services/api/client.js` for HTTP behavior and `src/services/api/endpoints.js` for endpoint constants. Preserve its token refresh and error parsing behavior.
- Keep reusable UI in `src/components` and feature-specific UI close to its page/feature.
- Use the existing Tailwind and CSS conventions in `src/index.css`; use the installed Lucide icon library for interface icons.
- `VITE_*` values are shipped to the browser. Never put secrets in frontend environment variables.

Before changing an endpoint or auth flow, compare the frontend endpoint definitions with the currently mounted backend routes. The checked-out backend currently exposes health, docs, auth, and users; do not assume every frontend endpoint has a corresponding local route.

## Canonical documentation

Link to these documents instead of duplicating their details:

- [Backend setup and structure](backend/README.md)
- [Frontend setup](frontend/README.md)
- [API documentation conventions](backend/docs/API_DOCUMENTATION.md)
- [Email and token flows](backend/docs/EMAIL_TOKENS.md)
- [Upload service](backend/docs/UPLOAD_SERVICE.md)

## Change hygiene

- Keep changes scoped to the owning app and preserve existing public APIs unless the task requires a contract change.
- Do not commit generated dependencies, local `.env` files, runtime uploads, logs, or build output.
- When changing a cross-app contract, update both sides and document the endpoint or payload change.

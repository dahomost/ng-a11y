# Library Management Platform

Enterprise-style full-stack application for cataloguing library collections with role-based access, immutable audit trails, and an accessibility-first Angular client.

## Repository layout

| Path | Technology | Responsibility |
|------|------------|----------------|
| `database/` | PostgreSQL | Canonical schema (`schema.sql`) |
| `backend/` | Node.js + TypeScript + Express | REST API at `/api/v1` |
| `frontend/` | Angular 19 (standalone APIs) | Staff / patron UI |

## Prerequisites

- Node.js 20+ (CI uses 22)
- PostgreSQL 13+ (local instance)
- npm

## Database setup

1. Create role/database (example matches local defaults used in development):

```sql
CREATE DATABASE library;
```

2. Apply schema:

```bash
psql -h localhost -p 5432 -U postgres -d library -f database/schema.sql
```

3. Connection string for the API (see `backend/.env.example`):

`postgresql://postgres:1234567890@localhost:5432/library`

4. **First admin user:** register via `POST /api/v1/auth/register`, then promote in SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

Librarians can be promoted similarly with `'LIBRARIAN'`.

> **Note:** PostgreSQL 14+ prefers `EXECUTE FUNCTION` for triggers; this schema uses `EXECUTE PROCEDURE` for broader compatibility. If your server rejects it, replace that clause with `EXECUTE FUNCTION set_collections_updated_at();`.

## Backend setup

```bash
cd backend
cp .env.example .env   # edit secrets — never commit .env
npm ci
npm run build
npm run start:dev
```

API listens on `PORT` (default **3000**). Health check: `GET /health`.

### Backend architecture

Layered design with strict boundaries:

- **Controllers** — HTTP adapters, status codes, DTO validation entrypoints
- **Services** — business rules, orchestration, audit emission on mutations
- **Repositories** — raw SQL via `pg` pool
- **Models** — TypeScript domain types
- **Middleware** — auth (`Bearer` JWT), RBAC, centralized errors, Zod validation helpers

### RBAC summary

| Area | PUBLIC | LIBRARIAN | ADMIN |
|------|--------|-----------|-------|
| Read collections / tags | Yes | Yes | Yes |
| Mutate collections / tags / links | No | Yes | Yes |
| User administration | No | No | Yes |
| Audit log read | No | Yes | Yes |

## Frontend setup

```bash
cd frontend
npm ci
npm start   # http://localhost:4200
```

Configure API base URL in `src/environments/environment*.ts` (defaults to `http://localhost:3000/api/v1`).

### Frontend architecture

- **`core/`** — guards, interceptors (auth, loading, retry, error), session-aware `AuthService`, loading + toast signals
- **`shared/`** — design tokens (SCSS), reusable UI primitives (`ui-button`, `ui-input`, `ui-card`, `ui-table`, `ui-modal` with CDK focus trap)
- **`features/`** — lazy routes (`auth`, `dashboard`, `collections`)

State combines **RxJS** (HTTP streams) with **Angular signals** (session, loading, UI toggles).

## Accessibility strategy (WCAG 2.1 AA / Section 508)

- Semantic regions: skip link, `<header>`, `<main>`, labelled navigation
- Forms: explicit labels, `aria-invalid`, `aria-describedby`, keyboard-only paths
- Modals: `role="dialog"`, `aria-modal`, `cdkTrapFocus` with initial focus in dialog body
- Live regions for global errors and loading announcements
- Visible `:focus-visible` outlines and Bootstrap components chosen for predictable contrast on light surfaces
- **Automated checks:** Playwright + `@axe-core/playwright` (`npm run e2e`) against WCAG 2.1 AA–oriented axe rule tags
- **Conformance mapping:** see [`frontend/docs/accessibility-wcag.md`](frontend/docs/accessibility-wcag.md) for WCAG 2.1 AA / Section 508 alignment notes

Manual verification across **Chrome, Edge, Firefox** and **mobile / desktop** breakpoints remains required for release sign-off.

## Testing strategy

| Layer | Tooling | Scope |
|-------|---------|-------|
| Backend unit | Jest | Services/controllers (mocked I/O) |
| Frontend unit | **Jest only** (`@angular-builders/jest`; Karma/Jasmine removed) | Components, services, guards |
| Frontend E2E / a11y | **Playwright** + `@axe-core/playwright` | Auth routes + automated WCAG-oriented scans |
| Coverage | Lcov | Consumed by Sonar (`sonar-project.properties`) |

**Coverage targets:** the codebase is structured for high coverage; CI enforces green builds. Raise thresholds toward **≥90% branch coverage** incrementally per package as suites grow (collect with `npm run test:cov` in `backend/` and `ng test --watch=false` in `frontend/`).

Commands:

```bash
cd backend && npm test && npm run test:cov
cd frontend && npm test -- --watch=false
cd frontend && npm run playwright:install   # first-time Chromium for Playwright
cd frontend && npm run e2e                   # serves app + Playwright + axe
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. Backend lint, unit tests, TypeScript build
2. Frontend production-ish build + Jest
3. Cypress E2E (includes axe checks)

### SonarQube

`sonar-project.properties` lists sources and LCOV report paths. Wire `SONAR_TOKEN` (and Sonar host URL) in your pipeline, enable quality gates, and block merges on **new** critical issues.

## Linting & formatting

- **Backend:** ESLint + Prettier (`npm run lint`, `npm run format`)
- **Frontend:** rely on Angular compiler strictness; add ESLint/Prettier schematics when you standardize style rules across components.

## Sprint-style delivery breakdown

1. **Sprint 0 — Foundations:** schema, Express skeleton, Angular shell, CI smoke
2. **Sprint 1 — Identity:** JWT auth, RBAC, user admin, session UX
3. **Sprint 2 — Catalog:** collections CRUD, tags, junction routes, audit completeness
4. **Sprint 3 — Experience:** dashboard metrics, modals, responsive polish, axe fixes
5. **Sprint 4 — Hardening:** Sonar remediation, coverage push, performance + backup runbooks

## Security reminders

- Rotate `JWT_SECRET` and database credentials per environment
- TLS termination belongs on the edge (reverse proxy / gateway)
- Audit logs are append-only; protect DB backups accordingly

## License

Private / unlicensed by default — adjust per your organization.

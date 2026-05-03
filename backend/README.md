# Library Management Platform — API

Express + TypeScript service exposing `/api/v1` JSON endpoints backed by PostgreSQL.

## Quick start

```bash
cp .env.example .env
npm ci
npm run start:dev
```

Ensure the database schema from `../database/schema.sql` is applied before exercising write routes.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run start:dev` | `tsx` watch mode for local development |
| `npm run build` | Emit `dist/` for production |
| `npm start` | Run compiled `dist/index.js` |
| `npm test` | Jest unit tests |
| `npm run test:cov` | Jest with LCOV for Sonar |
| `npm run lint` | ESLint |

## Architecture notes

See the repository root `README.md` for the full layered architecture description, RBAC matrix, and audit strategy.

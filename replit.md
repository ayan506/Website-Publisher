# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

Imported MNI School website from the user's Google Drive ZIP. The primary web artifact is `artifacts/mni-school`, served at `/`, with the shared Express API at `/api`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS (`artifacts/mni-school`)
- **API framework**: Express 5 (`artifacts/api-server`)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/mni-school run dev` — run the MNI School website locally

## Imported Website

- `artifacts/mni-school/src/pages` contains public pages and admin pages.
- API routes imported for auth, blog, gallery, staff, settings, uploads, notices, and messages.
- Database schema imported under `lib/db/src/schema` and applied to the development database.
- The imported `vite.config.ts` was replaced with a Replit-ready config using the assigned `PORT` and `BASE_PATH`.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

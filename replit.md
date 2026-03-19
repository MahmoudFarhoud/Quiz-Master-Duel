# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **WebSocket**: ws library

## Artifacts

### `artifacts/islamic-quiz` — مسابقة إسلامية
Islamic quiz game with:
- 300 Islamic questions (bundled in `src/data/questions.ts`)
- Solo mode: سؤال وسؤال (offline, with 10s timer, lifelines, color per player)
- With Friend mode: Local (room code) and Online (matchmaking + WebSocket)
- Custom question creation
- Arabic RTL UI

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (rooms, matchmaking, WebSocket)
│   └── islamic-quiz/       # React+Vite Islamic quiz game (main app at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Endpoints

- `POST /api/rooms` — create a room
- `GET /api/rooms/:code` — get room by code
- `POST /api/rooms/:code/join` — join a room
- `POST /api/matchmaking/queue` — join matchmaking
- `DELETE /api/matchmaking/queue/:playerId` — leave matchmaking
- `WebSocket /ws?code=XXXX&playerId=YYY&playerName=ZZZ` — real-time game sync

## DB Schema

- `rooms` table: code, status, host_name, guest_name, question_count, custom_questions, created_at

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with WebSocket support. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

### `artifacts/islamic-quiz` (`@workspace/islamic-quiz`)

React + Vite Arabic Islamic quiz game. Main app served at `/`.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`.

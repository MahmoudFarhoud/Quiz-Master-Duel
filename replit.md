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
Complete Arabic Islamic Quiz Game with:
- **300 Islamic questions** bundled in `src/data/questions.ts`
- **Solo mode**: offline, 10s timer per question, lifelines (50/50, skip, +10s)
- **Local multiplayer**: Sequential — Player 1 answers all questions, then Player 2 answers same questions, ranked results
- **Online Room**: Host creates room with max players (2-8) + question count, all players answer simultaneously, ranked leaderboard
- **Random matchmaking**: 1v1 — matches only with another player also searching
- **Custom questions**: Host can add custom questions to the pool
- **Arabic RTL UI**, green/gold Islamic theme, confetti on results

### `artifacts/api-server` — API Server
Express backend with REST + WebSocket:
- REST API for room management and matchmaking
- WebSocket relay at `/ws` for real-time game sync
- Matchmaking queue (in-memory) with match result caching

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
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## API Endpoints

- `POST /api/rooms` — create a room (`hostName`, `questionCount`, `maxPlayers` 2-8)
- `GET /api/rooms/:code` — get room by code
- `POST /api/rooms/:code/join` — join a room (`guestName`, `playerId`)
- `POST /api/matchmaking/queue` — join/poll matchmaking queue (`playerName`, `playerId`)
- `DELETE /api/matchmaking/queue/:playerId` — leave matchmaking
- `WebSocket /ws?code=XXXX&playerId=YYY&playerName=ZZZ` — real-time game sync

## WebSocket Message Protocol

All messages are JSON. Server relays all client messages to all other room members.

### Client → Server (then broadcast to others)
- `{type: "game_started", questions: [...], players: [...]}` — host starts game
- `{type: "score_update", playerId, score}` — player score update
- `{type: "player_finished", playerId, finalScore}` — player done

### Server → Client (events)
- `{type: "connected", roomCode, playerId, playerCount}` — on WebSocket connect
- `{type: "playerJoined", playerId, playerName, playerCount}` — new player joined
- `{type: "playerLeft", playerId, playerName, playerCount}` — player disconnected

## DB Schema

- `rooms` table: `code (PK)`, `status`, `host_name`, `max_players`, `players (JSONB)`, `question_count`, `custom_questions (JSONB)`, `created_at`

## Game Modes Detail

### Online Room Flow
1. Host creates room → gets 4-digit code
2. Host connects to WebSocket lobby, waits for players
3. Guests join via code (REST) then connect WebSocket
4. Host clicks "Start" → sends `game_started` with questions via WebSocket
5. All players see same questions simultaneously (local timers)
6. Players send `score_update` events, everyone sees live scores
7. Results screen shows all players ranked

### Matchmaking Flow
1. Player 1 calls `POST /api/matchmaking/queue` → `{status: "queued"}`
2. Player 2 calls same → `{status: "matched", roomCode, isHost: true}` (Player 2 starts game)
3. Player 1 re-polls → `{status: "matched", roomCode, isHost: false}`
4. Player 2 connects WebSocket, waits 2.5s, sends `game_started`
5. Player 1 receives `game_started`, both navigate to game

## TypeScript & Composite Projects

After running codegen (`pnpm --filter @workspace/api-spec run codegen`), rebuild declarations:
```bash
cd lib/api-client-react && npx tsc --build
cd lib/api-zod && npx tsc --build
cd lib/db && npx tsc --build
```

## Root Scripts

- `pnpm run build` — typecheck then build all packages
- `pnpm run typecheck` — tsc build with project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes

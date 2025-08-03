# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About OpenFrontIO

OpenFrontIO is an online real-time strategy game focused on territorial control and alliance building. Players compete to expand their territory, build structures, and form strategic alliances on maps based on real-world geography. This is a fork/rewrite of WarFront.io.

### Game Features

- **Real-time Strategy Gameplay** - Expand territory and engage in strategic battles
- **Alliance System** - Form alliances with other players for mutual defense
- **Multiple Maps** - Play across various geographical regions (Europe, Asia, Africa, etc.)
- **Resource Management** - Balance expansion with defensive capabilities
- **Cross-platform** - Browser-based gameplay accessible on any modern web browser
- **Multiplayer Focus** - Real-time multiplayer with lobbies and matchmaking

## Development Commands

### Core Development

- `npm run dev` - Start both client and server in development mode with hot reloading
- `npm run start:client` - Run webpack dev server for client only (port 9000)
- `npm run start:server-dev` - Run server with development settings (port 3000)
- `npm run start:server` - Run server in production mode

### Build & Deployment

- `npm run build-dev` - Build client in development mode
- `npm run build-prod` - Build client in production mode
- `npm run tunnel` - Build production and start server (for tunnel/deployment)

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing

- `npm test` - Run Jest tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run perf` - Run performance tests

## Architecture Overview

OpenFront.io is a real-time multiplayer strategy game with a client-server architecture:

### Core Structure

- **`/src/client`** - Frontend game client (GPL v3 licensed)
- **`/src/core`** - Shared game logic between client and server (MIT licensed)
- **`/src/server`** - Backend game server (MIT licensed)
- **`/resources`** - Static assets (images, maps, fonts, languages)
- **`/tests`** - Test files

### Key Components

#### Client (`/src/client`)

- **Main.ts** - Entry point for the client application
- **graphics/** - Game rendering system using PixiJS
- **layers/** - UI layers (leaderboard, chat, menus, overlays)
- **components/** - Reusable UI components and modals
- **styles/** - CSS styling with Tailwind

#### Core (`/src/core`)

- **GameRunner.ts** - Main game loop and state management
- **Schemas.ts** - Zod schemas for data validation
- **game/** - Core game entities (Game, Player, Units, etc.)
- **execution/** - Command execution system for game actions
- **configuration/** - Game configuration and themes
- **pathfinding/** - A\* pathfinding algorithms

#### Server (`/src/server`)

- **Server.ts** - Main server entry point with cluster support
- **Master.ts** - Master process managing worker processes
- **Worker.ts** - Worker processes handling game instances
- **GameManager.ts** - Game lobby and session management
- **Client.ts** - Individual client connection handling

### Development Environment

- The dev server proxies WebSocket connections from port 9000 to 3000-3003
- Worker processes run on ports 3001-3003 for load balancing
- Uses TypeScript with ES modules throughout
- ESLint configuration disables some rules that need fixing

### Testing Requirements

- All code changes in `src/core` **MUST** be tested
- Jest is configured for TypeScript with ES modules
- Coverage thresholds are currently set to 0 but should be improved

### Build System

- Webpack handles client bundling with content hashing
- TypeScript compilation for both client and server
- PostCSS with Tailwind for styling
- Resource copying from `/resources` to `/static`

### Multi-licensing

- Server and core code: MIT license
- Client code: GPL v3 license
- Non-commercial assets: CC BY-NC 4.0

## Important Notes

- The project uses ES modules (`"type": "module"` in package.json)
- Some TypeScript strict checking is disabled and needs to be gradually enabled
- The gatekeeper directory in server is ignored by ESLint
- WebSocket connections use a custom protocol for real-time game updates

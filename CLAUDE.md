# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev` (http://localhost:3000)
- **Build**: `pnpm build` (static export to `out/`)
- **Lint**: `pnpm lint` / `pnpm lint:fix`
- **Format**: `pnpm format` / `pnpm format:check`
- **Test (watch)**: `pnpm test`
- **Test (single run)**: `pnpm test:run`
- **Test (UI)**: `pnpm test:ui`
- **Run single test**: `pnpm vitest run src/test/utils.test.ts`

## Architecture

**Next.js 15 App Router** with static export (`output: 'export'`). Deployed to GitHub Pages with a conditional `basePath` of `/pomodoro-timer` when `GITHUB_ACTIONS=true`. ESLint and TypeScript errors are ignored during builds (see `next.config.ts`).

### State Management

Zustand store in `src/store/usePomodoro.ts` is the central state hub. It manages timer state, tasks, sessions, settings, and stats. The store uses `subscribeWithSelector` middleware and auto-loads data from IndexedDB on creation. Timer uses epoch-based timing (stores `startTime` in localStorage) for accuracy across tab switches.

### Data Layer

- **Primary**: IndexedDB via Dexie (`src/lib/database.ts`) with tables: `tasks`, `sessions`, `settings`
- **Fallback/ephemeral**: localStorage for timer state recovery and current task ID
- All data is local-only; no backend API

### UI Components

- **shadcn/ui** (new-york style) with Radix UI primitives in `src/components/ui/`
- Add new shadcn components via: `pnpm dlx shadcn@latest add <component>`
- Tailwind CSS v4 with CSS variables for theming (`src/app/globals.css`)
- Animations via Framer Motion; icons via Lucide React

### Key Types

All application types are in `src/types/index.ts`: `TimerMode`, `TimerState`, `Task`, `PomodoroSession`, `AppSettings`, `AppStats`, `AppState`.

### Pages

- `/` — Timer + task list (main interface)
- `/settings/` — App configuration
- `/stats/` — Statistics dashboard with Recharts

### Custom Hooks

- `useAudio` — sound playback for timer events
- `useKeyboardShortcuts` — keyboard navigation (Space=start/pause, 1/2/3=modes)
- `useNotifications` — browser notification API

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.json` and `vitest.config.ts`).

### Testing

Vitest with jsdom environment and React Testing Library. Setup file at `src/test/setup.ts`.

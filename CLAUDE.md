# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js 16, http://localhost:3000)
npm run build    # Production build
npx tsc --noEmit # Type-check (no ESLint config exists yet)
```

## Architecture

Single-page Next.js 16 app (App Router) — a multiplayer market-making game where participants post bids/asks and trade against each other.

**State management:** All game logic lives in `lib/gameState.ts` as a `useReducer` reducer. The single `useGameState()` hook is consumed in `app/page.tsx` and props are threaded down. There is no context provider or external state library.

**Game flow:** `setup` → `playing` → `settled`. The reducer handles: `START_GAME`, `ADD_ORDER`, `CANCEL_ORDER`, `EXECUTE_TRADE`, `SETTLE`, `RESET`.

**Key domain rules in the reducer:**
- One order per side per participant (new order replaces existing)
- Orders that cross the book auto-execute as trades (price/time priority)
- Settlement closes all positions at the true value; PnL is zero-sum

**Core libraries (all in `lib/`):**
- `types.ts` — `Order`, `Trade`, `Position`, `GameState`, `GameAction`
- `orderBook.ts` — priority logic, crossing detection, best bid/ask
- `pnl.ts` — PnL calculation, position initialization, trade application
- `gameState.ts` — reducer + `useGameState` hook

**Components:** `SetupScreen` → `GameScreen` (which composes `OrderBook`, `OrderEntry`, `PositionTracker`, `TradeLog`, and modal dialogs `TakerModal`, `SettlementModal`, `WarningModal`).

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom theme variables are defined in `app/globals.css` under `@theme` — all prefixed `--color-vc-*` (teal, pink, yellow, dark, light). VivCourt brand palette: teal `#0CA3C4`, pink `#FA6980`, yellow `#EBDF00`.

Utility CSS classes (`vc-card`, `vc-btn`, `vc-modal`, `vc-backdrop`, `vc-highlight`, `vc-scrollbar`) are in `globals.css` — use these rather than recreating animation/transition patterns inline.

Path alias: `@/*` maps to project root (configured in `tsconfig.json`).

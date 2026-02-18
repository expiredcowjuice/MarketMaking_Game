# Market Making Game

A multiplayer market-making simulation where participants post bids and asks, trade against each other, and compete on P&L. Built for the VivCourt graduate program.

## How It Works

1. **Setup** — Enter a market question (e.g. "How many minutes is the Lord of the Rings trilogy?") and add 2+ participants
2. **Trading** — Participants post bids and asks. Click directly into the order book to set prices, or use the form below. Orders that cross the book auto-execute
3. **Settlement** — Reveal the true value. All positions are marked to market and final P&L is calculated

Each participant can have one bid and one ask at a time. New orders replace existing ones on the same side.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Tailwind CSS](https://tailwindcss.com/) 4

## Project Structure

```
app/
  layout.tsx        Root layout (Inter font, metadata)
  page.tsx          Entry point — game state orchestrator
  globals.css       Tailwind theme + VivCourt design tokens

components/
  SetupScreen.tsx   Game setup (question + participants)
  GameScreen.tsx    Main game shell (header, layout, modals)
  OrderBook.tsx     Interactive order book with inline editing
  OrderEntry.tsx    Order submission form
  PositionTracker.tsx  Live positions, cash, and P&L
  TradeLog.tsx      Trade history
  TakerModal.tsx    Trade execution dialog
  SettlementModal.tsx  Market settlement with P&L preview
  WarningModal.tsx  Priority violation warnings

lib/
  types.ts          TypeScript interfaces
  gameState.ts      useReducer game logic
  orderBook.ts      Order book utilities (priority, crossing, best bid/ask)
  pnl.ts            P&L calculations
```

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger a production deploy.

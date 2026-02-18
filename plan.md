# Market Making Game — Implementation Plan

## Tech Stack
- **Next.js 14** (App Router) — ideal for Vercel deployment
- **TypeScript** — type safety for game logic
- **Tailwind CSS** — rapid UI styling
- **React state only** — no database, fully client-side, stateless after refresh

---

## Game Flow

### Phase 1: Setup Screen
- Text input for the **market question** (e.g., "Total runtime of Lord of the Rings trilogy in minutes?")
- Dynamic list to **add participant names** (min 2)
- "Start Game" button → transitions to game screen

### Phase 2: Game Screen (Main Interface)
Single-page interface with three sections:

```
┌─────────────────────────────────────────────────────────┐
│  MARKET QUESTION BANNER                                 │
├──────────────────────────────┬──────────────────────────┤
│                              │                          │
│   ORDER BOOK TABLE           │   POSITION TRACKER       │
│                              │                          │
│   [User] [Bid] [Ask]        │   [User] [Pos] [Cash]   │
│   Alice   65₁   70          │   [User] [PnL]          │
│   Bob     64    71₁         │                          │
│   Carol   —     70²         │                          │
│                              │                          │
├──────────────────────────────┤                          │
│   ORDER ENTRY PANEL          │                          │
│   [Select User] [Side]      │                          │
│   [Price] [Qty] [Submit]    │                          │
│                              │                          │
├──────────────────────────────┤                          │
│   TRADE LOG                  │                          │
│   (scrollable history)       │                          │
└──────────────────────────────┴──────────────────────────┘
```

### Phase 3: Settlement (End Game)
- Button to "Reveal True Value" → enter the actual answer
- All open positions settled at true value
- Final PnL displayed

---

## Data Model (Client-Side React State)

```typescript
interface Participant {
  name: string;
}

interface Order {
  id: string;
  participant: string;
  side: 'bid' | 'ask';
  price: number;
  quantity: number;
  timestamp: number;       // for queue priority
  priority: number;        // assigned per price level (1, 2, 3...)
}

interface Trade {
  id: string;
  buyer: string;
  seller: string;
  price: number;
  quantity: number;
  timestamp: number;
}

interface Position {
  participant: string;
  netPosition: number;     // +ve = long, -ve = short
  cash: number;            // cumulative cash flow (sell adds, buy subtracts)
  // PnL = cash + netPosition * referencePrice
}

interface GameState {
  marketQuestion: string;
  participants: string[];
  orders: Order[];         // active resting orders
  trades: Trade[];         // trade history
  positions: Record<string, Position>;
  lastTradePrice: number | null;  // reference price for mark-to-market
}
```

### PnL Invariant (sum = 0 at all times)
- **Cash**: Every trade transfers cash from buyer to seller. `Σ cash = 0` always.
- **Position**: Every trade creates +qty for buyer, -qty for seller. `Σ position = 0` always.
- **PnL** = `cash + position × referencePrice`. Since `Σ cash = 0` and `Σ position = 0`, → `Σ PnL = 0` always. ✓

---

## Core Game Mechanics

### Order Submission
1. Select participant from dropdown
2. Choose side (Bid / Ask)
3. Enter price
4. Enter quantity (default: 1)
5. Submit → order enters the book

**Crossing logic**: If a new bid ≥ best ask (or new ask ≤ best bid), the order automatically trades against the best resting order respecting queue priority. Partial fills are supported.

### Trading by Clicking
1. Click on any resting order in the book
2. A modal/prompt appears: "Who is taking this order?"
3. Select the taker from the participant list (excluding the order's owner)
4. Trade executes at the resting order's price

### Queue Priority Rules
- Orders at the **same price** on the **same side** are numbered by entry time
- Displayed as superscript: `70¹`, `70²` (only when >1 order at same price)
- **Enforcement**: When clicking to trade, if the clicked order is NOT the highest priority at that price level, show a warning and block the trade
- When submitting a crossing order, it always fills against the highest-priority resting order

### Order Book Display
- Table: `[Participant] [Bid] [Ask]`
- Each row = one participant
- Prices shown with:
  - **Subscript** for quantity (when qty > 1): `70₂` means price 70, qty 2
  - **Superscript** for priority (when multiple orders at same price): `70¹` means first in queue
  - Combined when needed: `70¹₂` means price 70, first priority, qty 2
- Dash `—` shown when participant has no order on that side
- Bids colored green, asks colored red

### Cancelling Orders
- Each resting order has an ✕ button to cancel it
- Cancelling removes from book, no position impact

---

## File Structure

```
MarketMaking_Game/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── .gitignore
├── app/
│   ├── layout.tsx          # Root layout with fonts/metadata
│   ├── page.tsx            # Main page — renders SetupScreen or GameScreen
│   └── globals.css         # Tailwind imports + custom styles
├── components/
│   ├── SetupScreen.tsx     # Participant entry + market question
│   ├── GameScreen.tsx      # Main game orchestrator
│   ├── OrderBook.tsx       # Order book table display
│   ├── OrderEntry.tsx      # Order submission form
│   ├── PositionTracker.tsx # RHS position/PnL panel
│   ├── TradeLog.tsx        # Scrollable trade history
│   ├── TakerModal.tsx      # "Who is the taker?" modal
│   ├── SettlementModal.tsx # End-game true value entry + final PnL
│   └── WarningModal.tsx    # Priority violation warning
├── lib/
│   ├── gameState.ts        # useReducer-based game state management
│   ├── types.ts            # TypeScript interfaces
│   ├── orderBook.ts        # Order matching + priority logic
│   └── pnl.ts              # Position & PnL calculation helpers
```

---

## Implementation Steps

### Step 1: Project Scaffolding
- Initialize Next.js with TypeScript + Tailwind
- Set up `.gitignore`, config files
- Create folder structure

### Step 2: Type Definitions & Game State
- Define all TypeScript interfaces in `lib/types.ts`
- Build `useReducer` state machine in `lib/gameState.ts`
- Actions: ADD_ORDER, CANCEL_ORDER, EXECUTE_TRADE, SETTLE, RESET
- Implement order matching logic in `lib/orderBook.ts`
- Implement PnL calculations in `lib/pnl.ts`

### Step 3: Setup Screen
- Market question input
- Participant name list (add/remove)
- Validation (min 2 participants, non-empty question)
- "Start Game" button

### Step 4: Order Book Component
- Table with participant rows
- Price display with subscript (qty) and superscript (priority)
- Clickable orders for direct trading
- Color coding (green bids, red asks)
- Cancel buttons

### Step 5: Order Entry Component
- Participant dropdown
- Bid/Ask toggle
- Price input (numeric)
- Quantity input (default 1)
- Submit with crossing detection

### Step 6: Taker Modal & Trade Execution
- Modal on order click → select taker
- Priority validation before execution
- Warning modal if priority violated
- Trade execution → update positions

### Step 7: Position Tracker
- Table: Participant, Position, Cash, PnL
- Live updates after each trade
- Sum row showing totals (should be 0)
- Reference price display

### Step 8: Trade Log
- Chronological trade list
- Shows: buyer, seller, price, quantity, timestamp

### Step 9: Settlement
- "End Game" button → enter true value
- Settle all open positions at true value
- Display final PnL leaderboard

### Step 10: Polish & Deploy
- Responsive layout
- Edge cases (empty book, all cancelled, etc.)
- Vercel deployment config

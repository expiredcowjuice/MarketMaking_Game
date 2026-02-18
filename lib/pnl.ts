import { Position } from './types';

/**
 * Calculate PnL for a position given a reference price.
 * PnL = cash + netPosition * referencePrice
 *
 * This guarantees sum of all PnLs = 0 because:
 * - sum of all cash = 0 (every trade is a transfer)
 * - sum of all positions = 0 (every buy has a sell)
 * - So sum of PnL = 0 + referencePrice * 0 = 0
 */
export function calculatePnL(position: Position, referencePrice: number): number {
  return position.cash + position.netPosition * referencePrice;
}

/**
 * Initialize positions for all participants.
 */
export function initializePositions(participants: string[]): Record<string, Position> {
  const positions: Record<string, Position> = {};
  for (const p of participants) {
    positions[p] = { netPosition: 0, cash: 0 };
  }
  return positions;
}

/**
 * Apply a trade to positions. Mutates positions in place —
 * caller should clone before calling.
 */
export function applyTrade(
  positions: Record<string, Position>,
  buyer: string,
  seller: string,
  price: number,
  quantity: number
): Record<string, Position> {
  const newPositions = { ...positions };
  newPositions[buyer] = {
    netPosition: positions[buyer].netPosition + quantity,
    cash: positions[buyer].cash - price * quantity,
  };
  newPositions[seller] = {
    netPosition: positions[seller].netPosition - quantity,
    cash: positions[seller].cash + price * quantity,
  };
  return newPositions;
}

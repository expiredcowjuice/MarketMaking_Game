import { Order } from './types';

/**
 * Get the priority number for an order at its price level.
 * Orders at the same price on the same side are ranked by timestamp.
 */
export function getOrderPriority(order: Order, allOrders: Order[]): number {
  const samePriceSide = allOrders
    .filter(o => o.side === order.side && o.price === order.price)
    .sort((a, b) => a.timestamp - b.timestamp);

  return samePriceSide.findIndex(o => o.id === order.id) + 1;
}

/**
 * Check if there are multiple orders at the same price level on the same side.
 */
export function hasMultipleAtPrice(order: Order, allOrders: Order[]): boolean {
  return allOrders.filter(o => o.side === order.side && o.price === order.price).length > 1;
}

/**
 * Get the best (highest priority) order at a given price and side.
 */
export function getBestPriorityOrder(price: number, side: 'bid' | 'ask', orders: Order[]): Order | null {
  const matching = orders
    .filter(o => o.side === side && o.price === price)
    .sort((a, b) => a.timestamp - b.timestamp);

  return matching[0] || null;
}

/**
 * Check if an order is the highest priority at its price level.
 */
export function isHighestPriority(order: Order, allOrders: Order[]): boolean {
  const best = getBestPriorityOrder(order.price, order.side, allOrders);
  return best !== null && best.id === order.id;
}

/**
 * Get the best bid (highest price, then earliest timestamp).
 */
export function getBestBid(orders: Order[]): Order | null {
  const bids = orders.filter(o => o.side === 'bid').sort((a, b) => {
    if (b.price !== a.price) return b.price - a.price; // highest price first
    return a.timestamp - b.timestamp; // earliest first
  });
  return bids[0] || null;
}

/**
 * Get the best ask (lowest price, then earliest timestamp).
 */
export function getBestAsk(orders: Order[]): Order | null {
  const asks = orders.filter(o => o.side === 'ask').sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price; // lowest price first
    return a.timestamp - b.timestamp; // earliest first
  });
  return asks[0] || null;
}

/**
 * Find if a new order would cross with any resting order.
 * Returns the resting order it would trade against, or null.
 */
export function findCrossingOrder(
  newSide: 'bid' | 'ask',
  newPrice: number,
  orders: Order[],
  participant: string
): Order | null {
  if (newSide === 'bid') {
    // New bid crosses if bid price >= best ask price
    const asks = orders
      .filter(o => o.side === 'ask' && o.price <= newPrice && o.participant !== participant)
      .sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price; // cheapest ask first
        return a.timestamp - b.timestamp; // earliest first
      });
    return asks[0] || null;
  } else {
    // New ask crosses if ask price <= best bid price
    const bids = orders
      .filter(o => o.side === 'bid' && o.price >= newPrice && o.participant !== participant)
      .sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price; // highest bid first
        return a.timestamp - b.timestamp; // earliest first
      });
    return bids[0] || null;
  }
}

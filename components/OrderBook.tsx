'use client';

import { Order } from '@/lib/types';
import { getOrderPriority, hasMultipleAtPrice } from '@/lib/orderBook';

interface OrderBookProps {
  participants: string[];
  orders: Order[];
  onClickOrder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
}

function PriceDisplay({ order, allOrders }: { order: Order; allOrders: Order[] }) {
  const showPriority = hasMultipleAtPrice(order, allOrders);
  const priority = showPriority ? getOrderPriority(order, allOrders) : null;

  return (
    <span className="order-price">
      {order.price}
      {priority !== null && <sup>{priority}</sup>}
      {order.quantity > 1 && <sub>{order.quantity}</sub>}
    </span>
  );
}

export default function OrderBook({ participants, orders, onClickOrder, onCancelOrder }: OrderBookProps) {
  const getOrders = (participant: string, side: 'bid' | 'ask') => {
    return orders
      .filter(o => o.participant === participant && o.side === side)
      .sort((a, b) => {
        if (side === 'bid') return b.price - a.price; // highest bid first
        return a.price - b.price; // lowest ask first
      });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Order Book</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-500 uppercase">
            <th className="px-4 py-2 text-left font-medium">Participant</th>
            <th className="px-4 py-2 text-right font-medium text-green-700">Bids</th>
            <th className="px-4 py-2 text-left font-medium text-red-700">Asks</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(participant => {
            const bids = getOrders(participant, 'bid');
            const asks = getOrders(participant, 'ask');
            const maxRows = Math.max(bids.length, asks.length, 1);

            return Array.from({ length: maxRows }, (_, rowIdx) => (
              <tr
                key={`${participant}-${rowIdx}`}
                className={`border-t border-gray-100 ${rowIdx === 0 ? 'border-t-gray-200' : ''}`}
              >
                {/* Participant name only on first row */}
                <td className="px-4 py-2 text-sm font-medium text-gray-800">
                  {rowIdx === 0 ? participant : ''}
                </td>

                {/* Bid cell */}
                <td className="px-4 py-2 text-right">
                  {bids[rowIdx] ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onClickOrder(bids[rowIdx])}
                        className="px-2 py-0.5 text-sm font-mono font-semibold text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors cursor-pointer"
                      >
                        <PriceDisplay order={bids[rowIdx]} allOrders={orders} />
                      </button>
                      <button
                        onClick={() => onCancelOrder(bids[rowIdx].id)}
                        className="text-gray-300 hover:text-red-500 text-xs transition-colors"
                        title="Cancel order"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-sm">&mdash;</span>
                  )}
                </td>

                {/* Ask cell */}
                <td className="px-4 py-2 text-left">
                  {asks[rowIdx] ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onClickOrder(asks[rowIdx])}
                        className="px-2 py-0.5 text-sm font-mono font-semibold text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <PriceDisplay order={asks[rowIdx]} allOrders={orders} />
                      </button>
                      <button
                        onClick={() => onCancelOrder(asks[rowIdx].id)}
                        className="text-gray-300 hover:text-red-500 text-xs transition-colors"
                        title="Cancel order"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-sm">&mdash;</span>
                  )}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">No orders yet. Submit an order below.</p>
      )}
    </div>
  );
}

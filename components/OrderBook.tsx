'use client';

import { useState, useRef, useEffect } from 'react';
import { Order } from '@/lib/types';
import { getOrderPriority, hasMultipleAtPrice, getBestBid, getBestAsk } from '@/lib/orderBook';

interface OrderBookProps {
  participants: string[];
  orders: Order[];
  onClickOrder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onSubmitOrder: (participant: string, side: 'bid' | 'ask', price: number) => void;
  gamePhase: string;
}

function InlineInput({
  initialValue,
  onSubmit,
  onCancel,
}: {
  initialValue: string;
  onSubmit: (value: number) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleConfirm = () => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed > 0) {
      onSubmit(parsed);
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="number"
      step="any"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onCancel();
      }}
      onBlur={handleConfirm}
      className="w-16 px-1.5 py-0.5 text-sm font-mono text-center border-2 border-vc-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-vc-yellow/50 bg-vc-yellow/5"
    />
  );
}

function PriceDisplay({ order, allOrders }: { order: Order; allOrders: Order[] }) {
  const showPriority = hasMultipleAtPrice(order, allOrders);
  const priority = showPriority ? getOrderPriority(order, allOrders) : null;

  return (
    <span className="order-price">
      {order.price}
      {priority !== null && <sup>{priority}</sup>}
    </span>
  );
}

export default function OrderBook({
  participants, orders, onClickOrder, onCancelOrder, onSubmitOrder, gamePhase,
}: OrderBookProps) {
  const [editingCell, setEditingCell] = useState<{ participant: string; side: 'bid' | 'ask' } | null>(null);

  const getOrder = (participant: string, side: 'bid' | 'ask'): Order | undefined => {
    return orders.find(o => o.participant === participant && o.side === side);
  };

  const isEditing = (participant: string, side: 'bid' | 'ask') =>
    editingCell?.participant === participant && editingCell?.side === side;

  const handleInlineSubmit = (participant: string, side: 'bid' | 'ask', price: number) => {
    onSubmitOrder(participant, side, price);
    setEditingCell(null);
  };

  const bestBid = getBestBid(orders);
  const bestAsk = getBestAsk(orders);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 vc-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-vc-dark uppercase tracking-widest">Order Book</h2>
        {(bestBid || bestAsk) && (
          <span className="text-sm font-mono">
            <span className="text-vc-teal font-bold">{bestBid ? bestBid.price : '—'}</span>
            <span className="text-gray-300 mx-1.5">/</span>
            <span className="text-vc-pink font-bold">{bestAsk ? bestAsk.price : '—'}</span>
          </span>
        )}
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs uppercase tracking-wider border-b border-gray-100">
            <th className="px-5 py-3 text-left font-semibold text-gray-400">Participant</th>
            <th className="px-5 py-3 text-right font-semibold text-vc-teal">Bids</th>
            <th className="px-5 py-3 text-left font-semibold text-vc-pink">Asks</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(participant => {
            const bid = getOrder(participant, 'bid');
            const ask = getOrder(participant, 'ask');

            return (
              <tr key={participant} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-vc-dark">
                  {participant}
                </td>

                {/* Bid cell */}
                <td className="px-5 py-3 text-right">
                  {isEditing(participant, 'bid') ? (
                    <div className="inline-flex justify-end">
                      <InlineInput
                        initialValue={bid ? String(bid.price) : ''}
                        onSubmit={price => handleInlineSubmit(participant, 'bid', price)}
                        onCancel={() => setEditingCell(null)}
                      />
                    </div>
                  ) : bid ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCell({ participant, side: 'bid' })}
                        className="px-2.5 py-1 text-sm font-mono font-bold text-vc-teal bg-vc-teal/8 rounded-lg hover:bg-vc-teal/15 transition-all cursor-pointer"
                      >
                        <PriceDisplay order={bid} allOrders={orders} />
                      </button>
                      <button
                        onClick={() => onClickOrder(bid)}
                        className="text-gray-300 hover:text-vc-teal text-xs transition-colors"
                        title="Trade against this order"
                      >
                        &#x2713;
                      </button>
                      <button
                        onClick={() => onCancelOrder(bid.id)}
                        className="text-gray-300 hover:text-vc-pink text-xs transition-colors"
                        title="Cancel order"
                      >
                        &times;
                      </button>
                    </div>
                  ) : gamePhase === 'playing' ? (
                    <button
                      onClick={() => setEditingCell({ participant, side: 'bid' })}
                      className="text-gray-300 text-sm hover:text-vc-teal transition-colors cursor-pointer px-2.5 py-1"
                    >
                      &mdash;
                    </button>
                  ) : (
                    <span className="text-gray-300 text-sm">&mdash;</span>
                  )}
                </td>

                {/* Ask cell */}
                <td className="px-5 py-3 text-left">
                  {isEditing(participant, 'ask') ? (
                    <div className="inline-flex">
                      <InlineInput
                        initialValue={ask ? String(ask.price) : ''}
                        onSubmit={price => handleInlineSubmit(participant, 'ask', price)}
                        onCancel={() => setEditingCell(null)}
                      />
                    </div>
                  ) : ask ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCell({ participant, side: 'ask' })}
                        className="px-2.5 py-1 text-sm font-mono font-bold text-vc-pink bg-vc-pink/8 rounded-lg hover:bg-vc-pink/15 transition-all cursor-pointer"
                      >
                        <PriceDisplay order={ask} allOrders={orders} />
                      </button>
                      <button
                        onClick={() => onClickOrder(ask)}
                        className="text-gray-300 hover:text-vc-pink text-xs transition-colors"
                        title="Trade against this order"
                      >
                        &#x2713;
                      </button>
                      <button
                        onClick={() => onCancelOrder(ask.id)}
                        className="text-gray-300 hover:text-vc-pink text-xs transition-colors"
                        title="Cancel order"
                      >
                        &times;
                      </button>
                    </div>
                  ) : gamePhase === 'playing' ? (
                    <button
                      onClick={() => setEditingCell({ participant, side: 'ask' })}
                      className="text-gray-300 text-sm hover:text-vc-pink transition-colors cursor-pointer px-2.5 py-1"
                    >
                      &mdash;
                    </button>
                  ) : (
                    <span className="text-gray-300 text-sm">&mdash;</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">No orders yet. Click a cell or use the form below.</p>
      )}
    </div>
  );
}

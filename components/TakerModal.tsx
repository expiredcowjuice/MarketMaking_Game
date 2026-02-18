'use client';

import { Order } from '@/lib/types';
import { useState } from 'react';

interface TakerModalProps {
  order: Order;
  participants: string[];
  onConfirm: (taker: string, quantity: number) => void;
  onCancel: () => void;
}

export default function TakerModal({ order, participants, onConfirm, onCancel }: TakerModalProps) {
  const eligibleParticipants = participants.filter(p => p !== order.participant);
  const [selectedTaker, setSelectedTaker] = useState(eligibleParticipants[0] || '');
  const [quantity, setQuantity] = useState(String(order.quantity));

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);
    if (!selectedTaker || isNaN(qty) || qty < 1) return;
    onConfirm(selectedTaker, Math.min(qty, order.quantity));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Execute Trade</h3>
        <p className="text-sm text-gray-500 mb-4">
          {order.side === 'bid' ? 'Sell to' : 'Buy from'}{' '}
          <span className="font-medium text-gray-700">{order.participant}</span> at{' '}
          <span className={`font-mono font-semibold ${order.side === 'bid' ? 'text-green-700' : 'text-red-700'}`}>
            {order.price}
          </span>
        </p>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Who is the taker?</label>
          <div className="grid grid-cols-2 gap-2">
            {eligibleParticipants.map(p => (
              <button
                key={p}
                onClick={() => setSelectedTaker(p)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTaker === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">
            Quantity (max {order.quantity})
          </label>
          <input
            type="number"
            min="1"
            max={order.quantity}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2 text-white rounded-lg text-sm font-medium transition-colors ${
              order.side === 'bid'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {order.side === 'bid' ? 'Sell' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-black/50 vc-backdrop flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm vc-modal" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-vc-dark mb-1">Execute Trade</h3>
        <p className="text-sm text-gray-500 mb-5">
          {order.side === 'bid' ? 'Sell to' : 'Buy from'}{' '}
          <span className="font-semibold text-vc-dark">{order.participant}</span> at{' '}
          <span className={`font-mono font-bold ${order.side === 'bid' ? 'text-vc-teal' : 'text-vc-pink'}`}>
            {order.price}
          </span>
        </p>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Who is the taker?</label>
          <div className="grid grid-cols-2 gap-2">
            {eligibleParticipants.map(p => (
              <button
                key={p}
                onClick={() => setSelectedTaker(p)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedTaker === p
                    ? 'bg-vc-yellow text-vc-dark shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Quantity (max {order.quantity})
          </label>
          <input
            type="number"
            min="1"
            max={order.quantity}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-vc-yellow bg-gray-50/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 text-white rounded-xl text-sm font-bold transition-all vc-btn shadow-sm ${
              order.side === 'bid'
                ? 'bg-vc-pink hover:bg-[#e8566a]'
                : 'bg-vc-teal hover:bg-[#0a8fad]'
            }`}
          >
            {order.side === 'bid' ? 'Sell' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface OrderEntryProps {
  participants: string[];
  onSubmit: (participant: string, side: 'bid' | 'ask', price: number, quantity: number) => void;
}

export default function OrderEntry({ participants, onSubmit }: OrderEntryProps) {
  const [participant, setParticipant] = useState(participants[0] || '');
  const [side, setSide] = useState<'bid' | 'ask'>('bid');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const priceNum = parseFloat(price);
    const qtyNum = parseInt(quantity, 10);

    if (!participant) {
      setError('Select a participant');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Enter a valid price');
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    onSubmit(participant, side, priceNum, qtyNum);
    setPrice('');
    setQuantity('1');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Submit Order</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Participant */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Participant</label>
            <select
              value={participant}
              onChange={e => setParticipant(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {participants.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Side */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Side</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSide('bid')}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                  side === 'bid'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bid
              </button>
              <button
                type="button"
                onClick={() => setSide('ask')}
                className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                  side === 'ask'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ask
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Price</label>
            <input
              type="number"
              step="any"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}

        <button
          type="submit"
          className={`w-full py-2 rounded font-medium text-sm text-white transition-colors ${
            side === 'bid'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Submit {side === 'bid' ? 'Bid' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

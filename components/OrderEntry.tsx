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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const priceNum = parseFloat(price);

    if (!participant) {
      setError('Select a participant');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Enter a valid price');
      return;
    }

    onSubmit(participant, side, priceNum, 1);
    setPrice('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 vc-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-xs font-bold text-vc-dark uppercase tracking-widest">Submit Order</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Participant */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Participant</label>
            <select
              value={participant}
              onChange={e => setParticipant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vc-yellow bg-gray-50/50"
            >
              {participants.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Side */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Side</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSide('bid')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  side === 'bid'
                    ? 'bg-vc-teal text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Bid
              </button>
              <button
                type="button"
                onClick={() => setSide('ask')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  side === 'ask'
                    ? 'bg-vc-pink text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                Ask
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Price</label>
            <input
              type="number"
              step="any"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-vc-yellow bg-gray-50/50"
            />
          </div>
        </div>

        {error && <p className="text-vc-pink text-xs mb-3 font-medium">{error}</p>}

        <button
          type="submit"
          className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all vc-btn ${
            side === 'bid'
              ? 'bg-vc-teal hover:bg-[#0a8fad] shadow-sm'
              : 'bg-vc-pink hover:bg-[#e8566a] shadow-sm'
          }`}
        >
          Submit {side === 'bid' ? 'Bid' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

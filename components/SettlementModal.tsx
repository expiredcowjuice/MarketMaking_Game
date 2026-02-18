'use client';

import { useState } from 'react';
import { Position } from '@/lib/types';
import { calculatePnL } from '@/lib/pnl';

interface SettlementModalProps {
  participants: string[];
  positions: Record<string, Position>;
  onSettle: (trueValue: number) => void;
  onCancel: () => void;
}

export default function SettlementModal({ participants, positions, onSettle, onCancel }: SettlementModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const trueValue = parseFloat(value);
  const isValid = !isNaN(trueValue);

  const handleSettle = () => {
    if (!isValid) {
      setError('Enter a valid number');
      return;
    }
    onSettle(trueValue);
  };

  return (
    <div className="fixed inset-0 bg-black/50 vc-backdrop flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md vc-modal" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-vc-dark mb-1">Settle Market</h3>
        <p className="text-sm text-gray-500 mb-5">
          Enter the true value. All open positions will be settled at this price.
        </p>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">True Value</label>
          <input
            type="number"
            step="any"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            placeholder="Enter the answer..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-vc-yellow bg-gray-50/50"
            autoFocus
          />
          {error && <p className="text-vc-pink text-xs mt-1.5 font-medium">{error}</p>}
        </div>

        {/* PnL preview */}
        {isValid && (
          <div className="mb-5 bg-vc-light/70 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3">Final PnL Preview</p>
            {participants.map(p => {
              const pnl = calculatePnL(positions[p], trueValue);
              return (
                <div key={p} className="flex justify-between text-sm py-1">
                  <span className="text-vc-dark font-medium">{p}</span>
                  <span className={`font-mono font-bold ${
                    pnl > 0.001 ? 'text-vc-teal' : pnl < -0.001 ? 'text-vc-pink' : 'text-gray-300'
                  }`}>
                    {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSettle}
            disabled={!isValid}
            className="flex-1 py-2.5 bg-vc-yellow text-vc-dark rounded-xl text-sm font-bold hover:brightness-110 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all vc-btn"
          >
            Settle
          </button>
        </div>
      </div>
    </div>
  );
}

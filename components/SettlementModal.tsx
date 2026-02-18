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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Settle Market</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter the true value. All open positions will be settled at this price.
        </p>

        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">True Value</label>
          <input
            type="number"
            step="any"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            placeholder="Enter the answer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>

        {/* PnL preview */}
        {isValid && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Final PnL Preview</p>
            {participants.map(p => {
              const pnl = calculatePnL(positions[p], trueValue);
              return (
                <div key={p} className="flex justify-between text-sm py-0.5">
                  <span className="text-gray-700">{p}</span>
                  <span className={`font-mono font-semibold ${
                    pnl > 0.001 ? 'text-green-600' : pnl < -0.001 ? 'text-red-600' : 'text-gray-400'
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
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSettle}
            disabled={!isValid}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Settle
          </button>
        </div>
      </div>
    </div>
  );
}

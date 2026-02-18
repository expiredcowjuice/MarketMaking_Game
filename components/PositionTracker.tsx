'use client';

import { useState } from 'react';
import { Position } from '@/lib/types';
import { calculatePnL } from '@/lib/pnl';

interface PositionTrackerProps {
  participants: string[];
  positions: Record<string, Position>;
  lastTradePrice: number | null;
  settled: boolean;
}

export default function PositionTracker({ participants, positions, lastTradePrice, settled }: PositionTrackerProps) {
  const [visible, setVisible] = useState(true);
  const refPrice = lastTradePrice ?? 0;
  const hasRefPrice = lastTradePrice !== null;

  const totalPnL = participants.reduce((sum, p) => {
    return sum + (hasRefPrice ? calculatePnL(positions[p], refPrice) : 0);
  }, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 vc-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-vc-dark uppercase tracking-widest">Positions</h2>
          {hasRefPrice && !settled && (
            <p className="text-xs text-gray-400 mt-1 font-mono">Mark: {refPrice}</p>
          )}
        </div>
        <button
          onClick={() => setVisible(v => !v)}
          className="text-gray-400 hover:text-vc-dark transition-colors p-1"
          title={visible ? 'Hide positions' : 'Show positions'}
        >
          {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>

      {visible && (
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-5 py-3 text-left font-semibold">Name</th>
              <th className="px-5 py-3 text-right font-semibold">Pos</th>
              <th className="px-5 py-3 text-right font-semibold">Cash</th>
              <th className="px-5 py-3 text-right font-semibold">PnL</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(p => {
              const pos = positions[p];
              if (!pos) return null;
              const pnl = hasRefPrice ? calculatePnL(pos, refPrice) : 0;

              return (
                <tr key={p} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-vc-dark">{p}</td>
                  <td className={`px-5 py-3 text-sm text-right font-mono font-semibold ${
                    pos.netPosition > 0 ? 'text-vc-teal' :
                    pos.netPosition < 0 ? 'text-vc-pink' : 'text-gray-300'
                  }`}>
                    {pos.netPosition > 0 ? '+' : ''}{pos.netPosition}
                  </td>
                  <td className={`px-5 py-3 text-sm text-right font-mono ${
                    pos.cash > 0 ? 'text-vc-teal' :
                    pos.cash < 0 ? 'text-vc-pink' : 'text-gray-300'
                  }`}>
                    {pos.cash > 0 ? '+' : ''}{pos.cash.toFixed(2)}
                  </td>
                  <td className={`px-5 py-3 text-sm text-right font-mono font-bold ${
                    pnl > 0.001 ? 'text-vc-teal' :
                    pnl < -0.001 ? 'text-vc-pink' : 'text-gray-300'
                  }`}>
                    {hasRefPrice ? `${pnl > 0 ? '+' : ''}${pnl.toFixed(2)}` : '—'}
                  </td>
                </tr>
              );
            })}

            {/* Totals row */}
            <tr className="border-t-2 border-gray-200 bg-vc-light/50">
              <td className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Total</td>
              <td className="px-5 py-3 text-xs text-right font-mono font-semibold text-gray-500">
                {participants.reduce((s, p) => s + (positions[p]?.netPosition ?? 0), 0)}
              </td>
              <td className="px-5 py-3 text-xs text-right font-mono text-gray-500">
                {participants.reduce((s, p) => s + (positions[p]?.cash ?? 0), 0).toFixed(2)}
              </td>
              <td className="px-5 py-3 text-xs text-right font-mono font-semibold text-gray-500">
                {hasRefPrice ? totalPnL.toFixed(2) : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

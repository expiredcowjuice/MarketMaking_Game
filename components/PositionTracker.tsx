'use client';

import { Position } from '@/lib/types';
import { calculatePnL } from '@/lib/pnl';

interface PositionTrackerProps {
  participants: string[];
  positions: Record<string, Position>;
  lastTradePrice: number | null;
  settled: boolean;
}

export default function PositionTracker({ participants, positions, lastTradePrice, settled }: PositionTrackerProps) {
  const refPrice = lastTradePrice ?? 0;
  const hasRefPrice = lastTradePrice !== null;

  const totalPnL = participants.reduce((sum, p) => {
    return sum + (hasRefPrice ? calculatePnL(positions[p], refPrice) : 0);
  }, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Positions</h2>
        {hasRefPrice && !settled && (
          <p className="text-xs text-gray-400 mt-0.5">Mark price: {refPrice}</p>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-500 uppercase">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-right font-medium">Pos</th>
            <th className="px-4 py-2 text-right font-medium">Cash</th>
            <th className="px-4 py-2 text-right font-medium">PnL</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(p => {
            const pos = positions[p];
            if (!pos) return null;
            const pnl = hasRefPrice ? calculatePnL(pos, refPrice) : 0;

            return (
              <tr key={p} className="border-t border-gray-100">
                <td className="px-4 py-2 text-sm font-medium text-gray-800">{p}</td>
                <td className={`px-4 py-2 text-sm text-right font-mono ${
                  pos.netPosition > 0 ? 'text-green-600' :
                  pos.netPosition < 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {pos.netPosition > 0 ? '+' : ''}{pos.netPosition}
                </td>
                <td className={`px-4 py-2 text-sm text-right font-mono ${
                  pos.cash > 0 ? 'text-green-600' :
                  pos.cash < 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {pos.cash > 0 ? '+' : ''}{pos.cash.toFixed(2)}
                </td>
                <td className={`px-4 py-2 text-sm text-right font-mono font-semibold ${
                  pnl > 0.001 ? 'text-green-600' :
                  pnl < -0.001 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {hasRefPrice ? `${pnl > 0 ? '+' : ''}${pnl.toFixed(2)}` : '—'}
                </td>
              </tr>
            );
          })}

          {/* Totals row */}
          <tr className="border-t-2 border-gray-300 bg-gray-50">
            <td className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total</td>
            <td className="px-4 py-2 text-xs text-right font-mono text-gray-500">
              {participants.reduce((s, p) => s + (positions[p]?.netPosition ?? 0), 0)}
            </td>
            <td className="px-4 py-2 text-xs text-right font-mono text-gray-500">
              {participants.reduce((s, p) => s + (positions[p]?.cash ?? 0), 0).toFixed(2)}
            </td>
            <td className="px-4 py-2 text-xs text-right font-mono text-gray-500">
              {hasRefPrice ? totalPnL.toFixed(2) : '—'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

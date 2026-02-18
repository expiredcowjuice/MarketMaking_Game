'use client';

import { Trade } from '@/lib/types';

interface TradeLogProps {
  trades: Trade[];
}

export default function TradeLog({ trades }: TradeLogProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Trade Log
          {trades.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">({trades.length})</span>
          )}
        </h2>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {trades.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">No trades yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...trades].reverse().map(trade => (
              <div key={trade.id} className="px-4 py-2 text-sm flex items-center justify-between">
                <div>
                  <span className="font-medium text-green-700">{trade.buyer}</span>
                  <span className="text-gray-400 mx-1">bought from</span>
                  <span className="font-medium text-red-700">{trade.seller}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold text-gray-800">{trade.price}</span>
                  {trade.quantity > 1 && (
                    <span className="text-gray-400 text-xs ml-1">x{trade.quantity}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

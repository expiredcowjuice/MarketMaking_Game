'use client';

import { Trade } from '@/lib/types';

interface TradeLogProps {
  trades: Trade[];
}

export default function TradeLog({ trades }: TradeLogProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 vc-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-xs font-bold text-vc-dark uppercase tracking-widest">
          Trade Log
          {trades.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400 normal-case tracking-normal">({trades.length})</span>
          )}
        </h2>
      </div>

      <div className="max-h-48 overflow-y-auto vc-scrollbar">
        {trades.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No trades yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...trades].reverse().map(trade => (
              <div key={trade.id} className="px-5 py-3 text-sm flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div>
                  <span className="font-semibold text-vc-teal">{trade.buyer}</span>
                  <span className="text-gray-400 mx-1.5">bought from</span>
                  <span className="font-semibold text-vc-pink">{trade.seller}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-vc-dark">{trade.price}</span>
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

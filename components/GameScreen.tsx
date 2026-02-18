'use client';

import { useState } from 'react';
import { Order, GameState } from '@/lib/types';
import { isHighestPriority } from '@/lib/orderBook';
import OrderBook from './OrderBook';
import OrderEntry from './OrderEntry';
import PositionTracker from './PositionTracker';
import TradeLog from './TradeLog';
import TakerModal from './TakerModal';
import WarningModal from './WarningModal';
import SettlementModal from './SettlementModal';

interface GameScreenProps {
  state: GameState;
  addOrder: (participant: string, side: 'bid' | 'ask', price: number, quantity: number) => void;
  cancelOrder: (orderId: string) => void;
  executeTrade: (restingOrderId: string, taker: string, quantity: number) => void;
  settle: (trueValue: number) => void;
  reset: () => void;
}

export default function GameScreen({
  state, addOrder, cancelOrder, executeTrade, settle, reset,
}: GameScreenProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [showSettlement, setShowSettlement] = useState(false);

  const handleClickOrder = (order: Order) => {
    // Check priority — must be highest priority at that price level
    if (!isHighestPriority(order, state.orders)) {
      setWarning(
        `Cannot trade against this order. There is a higher-priority order that must be filled first (better price or earlier time priority).`
      );
      return;
    }
    setSelectedOrder(order);
  };

  const handleConfirmTrade = (taker: string, quantity: number) => {
    if (selectedOrder) {
      executeTrade(selectedOrder.id, taker, quantity);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-vc-light">
      {/* Header */}
      <div className="bg-vc-dark">
        {/* Yellow accent line */}
        <div className="h-1 bg-vc-yellow" />
        <div className="px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="vc-highlight">Market Making</span>{' '}
                <span className="text-white">Game</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1 max-w-md truncate">{state.marketQuestion}</p>
            </div>
            <div className="flex gap-3">
              {state.phase === 'playing' && (
                <button
                  onClick={() => setShowSettlement(true)}
                  className="px-5 py-2.5 bg-vc-yellow text-vc-dark rounded-xl text-sm font-bold hover:brightness-110 transition-all vc-btn"
                >
                  Settle Market
                </button>
              )}
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors border border-white/10"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settled banner */}
      {state.phase === 'settled' && state.trueValue !== null && (
        <div className="bg-vc-yellow/10 border-b border-vc-yellow/30 px-6 py-3">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-vc-dark text-sm font-semibold">
              Market settled at{' '}
              <span className="font-mono font-bold text-base vc-highlight">{state.trueValue}</span>
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Order book + Order entry */}
          <div className="lg:col-span-2 space-y-6">
            <OrderBook
              participants={state.participants}
              orders={state.orders}
              onClickOrder={handleClickOrder}
              onCancelOrder={cancelOrder}
              onSubmitOrder={(p, side, price) => addOrder(p, side, price, 1)}
              gamePhase={state.phase}
            />
            {state.phase === 'playing' && (
              <OrderEntry
                participants={state.participants}
                onSubmit={addOrder}
              />
            )}
            <TradeLog trades={state.trades} />
          </div>

          {/* Right column: Position tracker */}
          <div>
            <PositionTracker
              participants={state.participants}
              positions={state.positions}
              lastTradePrice={state.lastTradePrice}
              settled={state.phase === 'settled'}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <TakerModal
          order={selectedOrder}
          participants={state.participants}
          onConfirm={handleConfirmTrade}
          onCancel={() => setSelectedOrder(null)}
        />
      )}

      {warning && (
        <WarningModal
          message={warning}
          onClose={() => setWarning(null)}
        />
      )}

      {showSettlement && (
        <SettlementModal
          participants={state.participants}
          positions={state.positions}
          onSettle={(v) => { settle(v); setShowSettlement(false); }}
          onCancel={() => setShowSettlement(false)}
        />
      )}
    </div>
  );
}

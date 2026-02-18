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
        `Cannot trade against this order. There is a higher-priority order at the same price (${order.price}) that must be filled first.`
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Market Making Game</h1>
            <p className="text-sm text-gray-600 mt-0.5">{state.marketQuestion}</p>
          </div>
          <div className="flex gap-2">
            {state.phase === 'playing' && (
              <button
                onClick={() => setShowSettlement(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Settle Market
              </button>
            )}
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      </div>

      {/* Settled banner */}
      {state.phase === 'settled' && state.trueValue !== null && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-blue-800 text-sm font-medium">
              Market settled at <span className="font-mono font-bold">{state.trueValue}</span>
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

'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Order, Trade } from './types';
import { findCrossingOrder } from './orderBook';
import { initializePositions, applyTrade } from './pnl';

let orderIdCounter = 0;
let tradeIdCounter = 0;

function genOrderId(): string {
  return `order-${++orderIdCounter}`;
}

function genTradeId(): string {
  return `trade-${++tradeIdCounter}`;
}

const initialState: GameState = {
  phase: 'setup',
  marketQuestion: '',
  participants: [],
  orders: [],
  trades: [],
  positions: {},
  lastTradePrice: null,
  trueValue: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      orderIdCounter = 0;
      tradeIdCounter = 0;
      return {
        ...initialState,
        phase: 'playing',
        marketQuestion: action.marketQuestion,
        participants: action.participants,
        positions: initializePositions(action.participants),
      };
    }

    case 'ADD_ORDER': {
      const { participant, side, price, quantity } = action;

      // Enforce one order per side per participant — remove any existing order on this side
      const filteredOrders = state.orders.filter(
        o => !(o.participant === participant && o.side === side)
      );

      // Check for crossing order (against filtered book)
      const crossingOrder = findCrossingOrder(side, price, filteredOrders, participant);

      if (crossingOrder) {
        // Execute trade immediately
        const tradeQty = Math.min(quantity, crossingOrder.quantity);
        const buyer = side === 'bid' ? participant : crossingOrder.participant;
        const seller = side === 'ask' ? participant : crossingOrder.participant;
        const tradePrice = crossingOrder.price; // trade at resting order's price

        const trade: Trade = {
          id: genTradeId(),
          buyer,
          seller,
          price: tradePrice,
          quantity: tradeQty,
          timestamp: Date.now(),
        };

        // Update resting order
        let newOrders: Order[];
        if (crossingOrder.quantity <= tradeQty) {
          // Resting order fully filled — remove it
          newOrders = filteredOrders.filter(o => o.id !== crossingOrder.id);
        } else {
          // Partial fill — reduce resting order quantity
          newOrders = filteredOrders.map(o =>
            o.id === crossingOrder.id
              ? { ...o, quantity: o.quantity - tradeQty }
              : o
          );
        }

        // If new order has remaining qty, add it to book
        const remainingQty = quantity - tradeQty;
        if (remainingQty > 0) {
          newOrders.push({
            id: genOrderId(),
            participant,
            side,
            price,
            quantity: remainingQty,
            timestamp: Date.now(),
          });
        }

        return {
          ...state,
          orders: newOrders,
          trades: [...state.trades, trade],
          positions: applyTrade(state.positions, buyer, seller, tradePrice, tradeQty),
          lastTradePrice: tradePrice,
        };
      }

      // No cross — add as resting order
      const newOrder: Order = {
        id: genOrderId(),
        participant,
        side,
        price,
        quantity,
        timestamp: Date.now(),
      };

      return {
        ...state,
        orders: [...filteredOrders, newOrder],
      };
    }

    case 'CANCEL_ORDER': {
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.orderId),
      };
    }

    case 'EXECUTE_TRADE': {
      const { restingOrderId, taker, quantity } = action;
      const restingOrder = state.orders.find(o => o.id === restingOrderId);
      if (!restingOrder) return state;

      const tradeQty = Math.min(quantity, restingOrder.quantity);
      const buyer = restingOrder.side === 'ask' ? taker : restingOrder.participant;
      const seller = restingOrder.side === 'bid' ? taker : restingOrder.participant;

      const trade: Trade = {
        id: genTradeId(),
        buyer,
        seller,
        price: restingOrder.price,
        quantity: tradeQty,
        timestamp: Date.now(),
      };

      let newOrders: Order[];
      if (restingOrder.quantity <= tradeQty) {
        newOrders = state.orders.filter(o => o.id !== restingOrderId);
      } else {
        newOrders = state.orders.map(o =>
          o.id === restingOrderId
            ? { ...o, quantity: o.quantity - tradeQty }
            : o
        );
      }

      return {
        ...state,
        orders: newOrders,
        trades: [...state.trades, trade],
        positions: applyTrade(state.positions, buyer, seller, restingOrder.price, tradeQty),
        lastTradePrice: restingOrder.price,
      };
    }

    case 'SETTLE': {
      const { trueValue } = action;
      // Settle all remaining positions at true value
      // Each participant with a long position "sells" at true value
      // Each participant with a short position "buys" at true value
      let newPositions = { ...state.positions };
      const settlementTrades: Trade[] = [];

      for (const participant of state.participants) {
        const pos = newPositions[participant];
        if (pos.netPosition !== 0) {
          // Settle: cash += netPosition * trueValue, position goes to 0
          newPositions[participant] = {
            netPosition: 0,
            cash: pos.cash + pos.netPosition * trueValue,
          };
          settlementTrades.push({
            id: genTradeId(),
            buyer: pos.netPosition > 0 ? '(settlement)' : participant,
            seller: pos.netPosition > 0 ? participant : '(settlement)',
            price: trueValue,
            quantity: Math.abs(pos.netPosition),
            timestamp: Date.now(),
          });
        }
      }

      return {
        ...state,
        phase: 'settled',
        orders: [],
        trades: [...state.trades, ...settlementTrades],
        positions: newPositions,
        trueValue,
        lastTradePrice: trueValue,
      };
    }

    case 'RESET': {
      orderIdCounter = 0;
      tradeIdCounter = 0;
      return {
        ...initialState,
        participants: state.participants,
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback((marketQuestion: string, participants: string[]) => {
    dispatch({ type: 'START_GAME', marketQuestion, participants });
  }, []);

  const addOrder = useCallback((participant: string, side: 'bid' | 'ask', price: number, quantity: number) => {
    dispatch({ type: 'ADD_ORDER', participant, side, price, quantity });
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    dispatch({ type: 'CANCEL_ORDER', orderId });
  }, []);

  const executeTrade = useCallback((restingOrderId: string, taker: string, quantity: number) => {
    dispatch({ type: 'EXECUTE_TRADE', restingOrderId, taker, quantity });
  }, []);

  const settle = useCallback((trueValue: number) => {
    dispatch({ type: 'SETTLE', trueValue });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { state, startGame, addOrder, cancelOrder, executeTrade, settle, reset };
}

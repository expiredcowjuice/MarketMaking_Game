export interface Order {
  id: string;
  participant: string;
  side: 'bid' | 'ask';
  price: number;
  quantity: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  buyer: string;
  seller: string;
  price: number;
  quantity: number;
  timestamp: number;
}

export interface Position {
  netPosition: number;   // +ve = long, -ve = short
  cash: number;          // cumulative: sell adds price*qty, buy subtracts price*qty
}

export interface GameState {
  phase: 'setup' | 'playing' | 'settled';
  marketQuestion: string;
  participants: string[];
  orders: Order[];
  trades: Trade[];
  positions: Record<string, Position>;
  lastTradePrice: number | null;
  trueValue: number | null;
}

export type GameAction =
  | { type: 'START_GAME'; marketQuestion: string; participants: string[] }
  | { type: 'ADD_ORDER'; participant: string; side: 'bid' | 'ask'; price: number; quantity: number }
  | { type: 'CANCEL_ORDER'; orderId: string }
  | { type: 'EXECUTE_TRADE'; restingOrderId: string; taker: string; quantity: number }
  | { type: 'SETTLE'; trueValue: number }
  | { type: 'RESET' };

'use client';

import { useGameState } from '@/lib/gameState';
import SetupScreen from '@/components/SetupScreen';
import GameScreen from '@/components/GameScreen';

export default function Home() {
  const { state, startGame, addOrder, cancelOrder, executeTrade, settle, reset } = useGameState();

  if (state.phase === 'setup') {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <GameScreen
      state={state}
      addOrder={addOrder}
      cancelOrder={cancelOrder}
      executeTrade={executeTrade}
      settle={settle}
      reset={reset}
    />
  );
}

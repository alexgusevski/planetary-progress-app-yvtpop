
import React, { createContext, useContext, ReactNode } from 'react';
import { GameState } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';

interface GameStateContextType {
  gameState: GameState;
  isLoaded: boolean;
  performLabour: () => void;
  unlockNode: (nodeId: string) => boolean;
  resetGame: () => Promise<void>;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const gameStateHook = useGameState();

  return (
    <GameStateContext.Provider value={gameStateHook}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameStateContext() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
}

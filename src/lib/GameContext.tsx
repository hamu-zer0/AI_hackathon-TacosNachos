'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, UserInput } from '@/types/game';

interface GameContextType {
  gameState: GameState;
  userInputs: UserInput[];
  updateConspiracyLevel: (change: number) => void;
  addUserInput: (input: Omit<UserInput, 'timestamp'>) => void;
  resetGame: () => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  conspiracyLevel: 20,
  totalPersuasive: 0,
  totalEmpathy: 0,
  gameStatus: 'start'
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);

  const updateConspiracyLevel = (change: number) => {
    setGameState(prev => {
      const newLevel = Math.max(0, Math.min(50, prev.conspiracyLevel + change));
      const newStatus = newLevel >= 50 ? 'gameOver' : prev.gameStatus;
      
      return {
        ...prev,
        conspiracyLevel: newLevel,
        gameStatus: newStatus
      };
    });
  };

  const addUserInput = (input: Omit<UserInput, 'timestamp'>) => {
    const newInput: UserInput = {
      ...input,
      timestamp: new Date()
    };
    
    setUserInputs(prev => [...prev, newInput]);
    
    setGameState(prev => ({
      ...prev,
      totalPersuasive: prev.totalPersuasive + input.persuasive,
      totalEmpathy: prev.totalEmpathy + input.empathy
    }));

    // 説得と共感の効果で陰謀度を減少
    const reduction = (input.persuasive + input.empathy);
    updateConspiracyLevel(-reduction);
  };

  const resetGame = () => {
    setGameState(initialGameState);
    setUserInputs([]);
  };

  const setGameStatus = (status: GameState['gameStatus']) => {
    setGameState(prev => ({ ...prev, gameStatus: status }));
  };

  return (
    <GameContext.Provider value={{
      gameState,
      userInputs,
      updateConspiracyLevel,
      addUserInput,
      resetGame,
      setGameStatus
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
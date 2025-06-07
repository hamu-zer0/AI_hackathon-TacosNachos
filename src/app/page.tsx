'use client';

import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import GameScreen from '@/components/GameScreen';
import GameOverScreen from '@/components/GameOverScreen';
import { GameState } from '@/types/game';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    conspiracyLevel: 20,
    totalPersuasive: 0,
    totalEmpathy: 0,
    gameStatus: 'start'
  });

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  };

  const restartGame = () => {
    setGameState({
      conspiracyLevel: 20,
      totalPersuasive: 0,
      totalEmpathy: 0,
      gameStatus: 'start'
    });
  };

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  switch (gameState.gameStatus) {
    case 'start':
      return <StartScreen onStart={startGame} />;
    case 'playing':
      return <GameScreen gameState={gameState} updateGameState={updateGameState} />;
    case 'gameOver':
      return <GameOverScreen onRestart={restartGame} />;
    default:
      return <StartScreen onStart={startGame} />;
  }
}
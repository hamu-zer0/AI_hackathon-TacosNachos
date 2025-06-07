'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Post, PostData } from '@/types/game';
import { evaluateInput } from '@/lib/api';
import TargetSphere from './TargetSphere';
import PostComponent from './PostComponent';
import HistorySidebar from './HistorySidebar';
import postsData from '@/posts.json';

interface GameScreenProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState>) => void;
}

export default function GameScreen({ gameState, updateGameState }: GameScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePosts, setActivePosts] = useState<(Post & { id: number })[]>([]);
  const [userInputs, setUserInputs] = useState<any[]>([]);
  const [nextPostId, setNextPostId] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 全ポストを1つの配列にまとめる
  const allPosts: Post[] = Object.values(postsData as PostData).flat();

  const generateRandomPost = useCallback(() => {
    const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
    const newPost = {
      ...randomPost,
      id: nextPostId
    };
    
    setActivePosts(prev => [...prev, newPost]);
    setNextPostId(prev => prev + 1);
  }, [allPosts, nextPostId]);

  useEffect(() => {
    // BGM開始
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay prevented:', error);
      });
    }

    // 定期的にポストを生成（3秒間隔）
    const postInterval = setInterval(() => {
      if (gameState.gameStatus === 'playing') {
        generateRandomPost();
      }
    }, 3000);

    return () => {
      clearInterval(postInterval);
    };
  }, [gameState.gameStatus, generateRandomPost]);

  // ゲームオーバー判定
  useEffect(() => {
    if (gameState.conspiracyLevel >= 50) {
      updateGameState({ gameStatus: 'gameOver' });
    }
  }, [gameState.conspiracyLevel, updateGameState]);


  const handlePostAbsorbed = (postId: number) => {
    setActivePosts(prev => prev.filter(post => post.id !== postId));
    // ポストが吸収されると陰謀度が1-3増加
    const increase = Math.floor(Math.random() * 3) + 1;
    updateGameState({ 
      conspiracyLevel: Math.min(50, gameState.conspiracyLevel + increase) 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      const result = await evaluateInput(inputText.trim());
      
      const newInput = {
        text: inputText.trim(),
        timestamp: new Date(),
        persuasive: result.persuasive,
        empathy: result.empathy
      };

      setUserInputs(prev => [...prev, newInput]);

      // 説得力と共感力に応じて陰謀度を減少
      const reduction = (result.persuasive + result.empathy) * 0.5;
      const newConspiracyLevel = Math.max(0, gameState.conspiracyLevel - reduction);
      
      updateGameState({
        conspiracyLevel: newConspiracyLevel,
        totalPersuasive: gameState.totalPersuasive + result.persuasive,
        totalEmpathy: gameState.totalEmpathy + result.empathy
      });

      setInputText('');
    } catch (error) {
      console.error('Error evaluating input:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-cover bg-center" style={{
          backgroundImage: "url('/background-game.jpg')"
        }} />
      </div>

      {/* BGM */}
      <audio ref={audioRef} loop>
        <source src="/game-bgm.mp3" type="audio/mpeg" />
        <source src="/game-bgm.ogg" type="audio/ogg" />
      </audio>

      {/* ヘッダー */}
      <div className="relative z-10 p-4 bg-black bg-opacity-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">陰謀論説得ゲーム</h1>
          <div className="flex space-x-6 text-lg">
            <div className="bg-yellow-600 bg-opacity-50 px-3 py-1 rounded">
              説得力: {gameState.totalPersuasive}
            </div>
            <div className="bg-green-600 bg-opacity-50 px-3 py-1 rounded">
              共感力: {gameState.totalEmpathy}
            </div>
          </div>
        </div>
      </div>

      {/* メイン画面 */}
      <div className="relative z-10 flex-1 p-4" style={{ marginRight: '320px' }}>
        {/* ターゲット球（中央） */}
        <div className="flex justify-center items-center h-96">
          <TargetSphere conspiracyLevel={gameState.conspiracyLevel} />
        </div>

        {/* 入力フォーム（下部） */}
        <div className="fixed bottom-0 left-0 right-80 p-4 bg-black bg-opacity-70">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="ターゲットを説得する言葉を入力してください..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {isLoading ? '評価中...' : '送信'}
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-400 text-center">
              効果的な説得と共感でターゲットの陰謀度を下げましょう
            </div>
          </form>
        </div>
      </div>

      {/* 履歴サイドバー */}
      <HistorySidebar 
        userInputs={userInputs}
        totalPersuasive={gameState.totalPersuasive}
        totalEmpathy={gameState.totalEmpathy}
      />

      {/* アクティブなポスト */}
      {activePosts.map((post) => (
        <PostComponent
          key={post.id}
          post={post}
          onAbsorbed={() => handlePostAbsorbed(post.id)}
          startPosition={{ 
            x: -300, 
            y: Math.random() * 400 + 100 
          }}
          targetPosition={{ 
            x: 600, 
            y: 300 
          }}
        />
      ))}

      {/* 成功時のメッセージ */}
      {gameState.conspiracyLevel === 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center">
          <div className="bg-green-500 bg-opacity-90 p-8 rounded-xl text-white">
            <h2 className="text-3xl font-bold mb-4">🎉 成功！ 🎉</h2>
            <p className="text-lg">ターゲットを陰謀論から救い出しました！</p>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameState, Post, PostData, PostWithMetadata } from '@/types/game';
import { evaluateInput } from '@/lib/api';
import TargetSphere from './TargetSphere';
import PostComponent from './PostComponent';
import HistorySidebar from './HistorySidebar';
import WinScreen from './WinScreen';
import postsData from '@/posts.json';

interface GameScreenProps {
  gameState: GameState;
  updateGameState: (newState: Partial<GameState>) => void;
  onRestart?: () => void;
}

export default function GameScreen({ gameState, updateGameState, onRestart }: GameScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePosts, setActivePosts] = useState<PostWithMetadata[]>([]);
  const [userInputs, setUserInputs] = useState<any[]>([]);
  const [nextPostId, setNextPostId] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const theme: string = "反ワクチン・ナノボット";
  const postIntervalMs: number = 10000;
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentBGM, setCurrentBGM] = useState<string>('');

  // 全ポストを1つの配列にまとめる
  const allPosts: Post[] = (postsData as PostData)[theme];

  // 利用可能な縦位置を定義（UIコンポーネントと重ならない範囲）
  const availableYPositions = useMemo(() => [150, 220, 290, 360, 430, 500], []);

  // 陰謀度に応じたBGMを決定
  const getBGMForConspiracyLevel = useCallback((level: number) => {
    if (level >= 40) return '/陰謀論に傾いた.mp3';
    if (level >= 25) return '/陰謀の入口.mp3';
    if (level >= 10) return '/目覚める途中.mp3';
    return '/目覚めた.mp3';
  }, []);

  const generateRandomPost = useCallback(() => {
    const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
    const randomYPosition = availableYPositions[Math.floor(Math.random() * availableYPositions.length)];
    
    // 現在時刻をランダムに過去の時間にする（最大60分前）
    const now = new Date();
    const minutesAgo = Math.floor(Math.random() * 60);
    const postTime = new Date(now.getTime() - minutesAgo * 100000);
    
    const newPost: PostWithMetadata = {
      ...randomPost,
      id: nextPostId,
      yPosition: randomYPosition,
      timestamp: postTime.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      likes: Math.floor(Math.random() * 500) + 10,
      retweets: Math.floor(Math.random() * 200) + 5,
      comments: Math.floor(Math.random() * 100) + 2
    };
    
    setActivePosts(prev => [...prev, newPost]);
    setNextPostId(prev => prev + 1);
  }, [allPosts, nextPostId, availableYPositions]);

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.focus();
    }
  },[inputRef]);

  // BGM管理のuseEffect
  useEffect(() => {
    const requiredBGM = getBGMForConspiracyLevel(gameState.conspiracyLevel);
    
    if (currentBGM !== requiredBGM) {
      console.log(`BGM切り替え: 陰謀度${gameState.conspiracyLevel} → ${requiredBGM}`);
      
      if (audioRef.current && currentBGM) {
        // 現在の音楽をフェードアウト
        const fadeOut = setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
          } else {
            clearInterval(fadeOut);
            // 新しい音楽に切り替え
            setCurrentBGM(requiredBGM);
            if (audioRef.current) {
              audioRef.current.src = requiredBGM;
              audioRef.current.volume = 0;
              audioRef.current.loop = true;
              audioRef.current.play().then(() => {
                // フェードイン
                const fadeIn = setInterval(() => {
                  if (audioRef.current && audioRef.current.volume < 0.25) {
                    audioRef.current.volume = Math.min(0.3, audioRef.current.volume + 0.05);
                  } else {
                    clearInterval(fadeIn);
                  }
                }, 100);
              }).catch(error => {
                console.log('Audio autoplay prevented:', error);
              });
            }
          }
        }, 100);
      } else {
        // 初回再生
        setCurrentBGM(requiredBGM);
        if (audioRef.current) {
          audioRef.current.src = requiredBGM;
          audioRef.current.volume = 0.3;
          audioRef.current.loop = true;
          audioRef.current.play().catch(error => {
            console.log('Audio autoplay prevented:', error);
          });
        }
      }
    }
  }, [gameState.conspiracyLevel, getBGMForConspiracyLevel, currentBGM]);

  // ポスト生成のuseEffect
  useEffect(() => {
    // 定期的にポストを生成（n秒間隔）
    const postInterval = setInterval(() => {
      if (gameState.gameStatus === 'playing') {
        generateRandomPost();
      }
    }, postIntervalMs);

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

  // WIN判定
  useEffect(() => {
    if (gameState.conspiracyLevel === 0) {
      updateGameState({ gameStatus: 'win' });
    }
  }, [gameState.conspiracyLevel, updateGameState]);


  const handlePostAbsorbed = useCallback((postId: number) => {
    console.log(`ポスト ${postId} が吸収されました`);
    setActivePosts(prev => prev.filter(post => post.id !== postId));
    
    // ポストが吸収されると陰謀度が2-4増加（確実に増加させる）
    const increase = Math.floor(Math.random() * 10) + 1;
    console.log(`陰謀度を ${increase} 増加させます`);
    
    const newLevel = Math.min(50, gameState.conspiracyLevel + increase);
    console.log(`陰謀度: ${gameState.conspiracyLevel} → ${newLevel}`);
    updateGameState({ conspiracyLevel: newLevel });
  }, [gameState.conspiracyLevel, updateGameState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      if (inputText.trim() === "9歳") {
        // 魔法の言葉「9歳」が入力された場合、陰謀度を0にリセット
        updateGameState({
          conspiracyLevel: 0,
          totalPersuasive: gameState.totalPersuasive,
          totalEmpathy: gameState.totalEmpathy
        });
      } else {
        const result = await evaluateInput(theme, inputText.trim());

        const newInput = {
          text: inputText.trim(),
          timestamp: new Date(),
          persuasive: result.persuasive,
          empathy: result.empathy
        };

        setUserInputs(prev => [...prev, newInput]);

        // 説得力と共感力に応じて陰謀度を減少
        const reduction = (result.persuasive + result.empathy);

        const newConspiracyLevel = Math.max(0, gameState.conspiracyLevel - reduction);

        updateGameState({
          conspiracyLevel: newConspiracyLevel,
          totalPersuasive: gameState.totalPersuasive + result.persuasive,
          totalEmpathy: gameState.totalEmpathy + result.empathy
        });
      }

      setInputText('');
    } catch (error) {
      console.error('Error evaluating input:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-cover bg-center" style={{
          backgroundImage: "url('/background-game.jpg')"
        }} />
      </div>

      {/* BGM */}
      <audio ref={audioRef} loop>
        {currentBGM && <source src={currentBGM} type="audio/mpeg" />}
      </audio>

      {/* ヘッダー（上部固定） */}
      <div className="fixed top-0 left-0 right-80 h-20 bg-gradient-to-r from-slate-800/90 to-purple-800/90 backdrop-blur-md border-b-2 border-purple-500/50 z-30 shadow-2xl">
        <div className="h-full flex items-center justify-between px-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {theme}
          </h1>
          <div className="flex items-center space-x-6">
            {/* 陰謀度表示 */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 px-6 py-3 rounded-xl border border-red-400/30 backdrop-blur-sm">
              <div className="text-sm text-red-200 font-medium">陰謀度</div>
              <div className="text-2xl font-bold text-red-300">{gameState.conspiracyLevel}/50</div>
            </div>
            {/* スコア表示 */}
            <div className="flex space-x-4">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-3 rounded-xl border border-yellow-400/30 backdrop-blur-sm">
                <div className="text-sm text-yellow-200">説得力</div>
                <div className="text-xl font-bold text-yellow-300">{gameState.totalPersuasive}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-3 rounded-xl border border-green-400/30 backdrop-blur-sm">
                <div className="text-sm text-green-200">共感力</div>
                <div className="text-xl font-bold text-green-300">{gameState.totalEmpathy}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メイン画面（中央エリア） */}
      <div className="fixed top-20 left-0 right-80 bottom-24 flex items-center justify-center z-10">
        <TargetSphere conspiracyLevel={gameState.conspiracyLevel} />
      </div>

      {/* 入力フォーム（下部固定） */}
      <div className="fixed bottom-0 left-0 right-80 h-24 bg-gradient-to-r from-slate-800/95 to-purple-800/95 backdrop-blur-md border-t-2 border-purple-500/50 z-30 shadow-2xl">
        <div className="h-full flex items-center px-8">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="ターゲットを説得する言葉を入力してください..."
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 text-white placeholder-gray-300 border-2 border-gray-600/50 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg backdrop-blur-sm"
                  disabled={isLoading}
                  ref={inputRef}
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? '評価中' : '送信'}
              </button>
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
            x: 200, 
            y: post.yPosition 
          }}
          targetPosition={{ 
            x: 600, 
            y: 300 
          }}
        />
      ))}

      {/* ゲームオーバーが近い警告 */}
      {gameState.conspiracyLevel >= 45 && (
        <div className="fixed top-24 left-8 right-88 z-40">
          <div className="bg-red-500/90 border-2 border-red-400 rounded-xl p-4 animate-pulse">
            <div className="text-center text-white font-bold text-xl">
              ⚠️ 危険！ゲームオーバー寸前！ ⚠️
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useRef } from 'react';

interface GameOverScreenProps {
  onRestart: () => void;
}

export default function GameOverScreen({ onRestart }: GameOverScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // ゲームオーバー時の効果音再生
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.log('Audio play prevented:', error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-900 via-red-800 to-black text-white relative overflow-hidden">
      {/* 背景画像のプレースホルダー */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-cover bg-center" style={{
          backgroundImage: "url('/background-gameover.jpg')"
        }} />
      </div>

      {/* ゲームオーバー効果音 */}
      <audio ref={audioRef}>
        <source src="/gameover.mp3" type="audio/mpeg" />
        <source src="/gameover.ogg" type="audio/ogg" />
      </audio>

      <div className="relative z-10 text-center">
        {/* ゲームオーバータイトル */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold mb-4 text-red-500 animate-pulse">
            GAME OVER
          </h1>
          <div className="text-2xl text-red-300 animate-bounce">
            ⚠️ 陰謀度が最大に達しました ⚠️
          </div>
        </div>

        {/* 結果メッセージ */}
        <div className="mb-8 p-6 bg-black bg-opacity-50 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">
            ターゲットは完全に陰謀論に染まってしまいました...
          </h2>
          <p className="text-lg mb-4 leading-relaxed">
            残念ながら、あなたの説得は間に合いませんでした。<br />
            ターゲットは陰謀論の深い闇に飲み込まれてしまいました。
          </p>
          <div className="text-red-400 font-semibold">
            陰謀度: 50/50 (危険レベル MAX)
          </div>
        </div>

        {/* アドバイス */}
        <div className="mb-8 p-4 bg-gray-900 bg-opacity-70 rounded-lg max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-blue-400">
            次回への教訓
          </h3>
          <ul className="text-left space-y-2 text-sm">
            <li>• より共感的なアプローチを心がけましょう</li>
            <li>• 論理的な説得と感情的な理解のバランスが重要です</li>
            <li>• 陰謀論ポストの吸収を阻止する対策を考えましょう</li>
            <li>• 早期の介入がカギとなります</li>
          </ul>
        </div>

        {/* リスタートボタン */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 もう一度挑戦する
          </button>
          
          <div className="text-gray-400 text-sm">
            諦めずに、再度ターゲットの救済に挑戦しましょう
          </div>
        </div>
      </div>

      {/* 演出効果 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full opacity-10 animate-ping" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-orange-500 rounded-full opacity-10 animate-pulse" />
      <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-yellow-500 rounded-full opacity-10 animate-bounce" />
      
      {/* 不吉な粒子エフェクト */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-400 rounded-full opacity-50 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
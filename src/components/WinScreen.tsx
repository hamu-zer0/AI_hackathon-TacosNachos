'use client';

import { useEffect, useRef, useState } from 'react';

interface WinScreenProps {
  onRestart: () => void;
}

export default function WinScreen({ onRestart }: WinScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // 勝利時の効果音再生
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.log('Audio play prevented:', error);
      });
    }

    // 2秒後にカードをじわっと表示
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 opacity-95 transition-opacity duration-1000">
        <div className="w-full h-full bg-contain bg-center" style={{
          backgroundImage: "url('/kyusai_win.png')"
        }} />
      </div>

      {/* 勝利効果音 */}
      <audio ref={audioRef}>
        <source src="/win.mp3" type="audio/mpeg" />
        <source src="/win.ogg" type="audio/ogg" />
      </audio>

      {/* 勝利カード - じわっと表示 */}
      <div 
        className={`
          relative z-10 text-center bg-gradient-to-br from-green-500/95 to-emerald-600/95 
          p-12 rounded-3xl text-white shadow-2xl border-4 border-green-400/70 backdrop-blur-md
          transform transition-all duration-2000 ease-out
          ${showCard 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-75 translate-y-8'
          }
        `}
      >
        {/* タイトル */}
        <div className={`transition-all duration-1000 delay-500 ${showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-6xl font-bold mb-6 animate-bounce">🎉 勝利！ 🎉</h2>
        </div>

        {/* メッセージ */}
        <div className={`transition-all duration-1000 delay-700 ${showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-3xl mb-6 font-bold">ターゲットを陰謀論から救い出しました！</p>
          <p className="text-xl text-green-100 mb-8">素晴らしい説得力と共感力でした</p>
        </div>
        
        {/* 統計情報 */}
        <div className={`bg-white/20 rounded-xl p-6 mb-8 transition-all duration-1000 delay-1000 ${showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="text-2xl font-bold mb-4">🏆 救済完了 🏆</h3>
          <p className="text-lg">陰謀度を0まで下げることに成功しました！</p>
        </div>

        {/* リスタートボタン */}
        <div className={`transition-all duration-1000 delay-1300 ${showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 タイトルへ戻る
          </button>
        </div>
      </div>

      {/* 花火エフェクト - カード表示後に開始 */}
      {showCard && [...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-80"
          style={{
            left: `${15 + (i * 7)}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${(i * 0.3) + 1}s`,
            animationDuration: '2s'
          }}
        />
      ))}

      {/* 追加の光エフェクト */}
      {showCard && [...Array(6)].map((_, i) => (
        <div
          key={`light-${i}`}
          className="absolute w-6 h-6 bg-white rounded-full animate-pulse opacity-60"
          style={{
            left: `${80 + (i * 3)}%`,
            top: `${25 + (i % 2) * 30}%`,
            animationDelay: `${(i * 0.5) + 1.5}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  );
}
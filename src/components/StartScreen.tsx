'use client';

import { useEffect, useRef } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // BGMの自動再生を試みる（ユーザーインタラクション後に再生される）
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const handleStart = () => {
    // BGMを開始
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay prevented:', error);
      });
    }
    onStart();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* 背景画像のプレースホルダー */}
      {/* <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-cover bg-center" style={{
          backgroundImage: "url('/background-start.jpg')"
        }} />
      </div> */}
      
      {/* BGM */}
      {/* <audio ref={audioRef} loop>
        <source src="/bgm.mp3" type="audio/mpeg" />
        <source src="/bgm.ogg" type="audio/ogg" />
      </audio> */}

      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          陰謀論説得ゲーム
        </h1>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          陰謀論に傾いた人を説得と共感で正気に戻すゲームです。<br />
          あなたの言葉の力で、ターゲットを救い出しましょう。
        </p>

        <div className="mb-8 p-6 bg-black bg-opacity-30 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">ゲームルール</h2>
          <ul className="text-left space-y-2">
            <li>• 陰謀度：初期値20、最大値50でゲームオーバー</li>
            <li>• 説得力と共感力でターゲットを説得</li>
            <li>• 陰謀論ポストが定期的に出現</li>
            <li>• 効果的な対話で陰謀度を下げよう</li>
          </ul>
        </div>

        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          ゲーム開始
        </button>
      </div>

      {/* 装飾的な要素 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-red-400 rounded-full opacity-20 animate-bounce" />
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-ping" />
    </div>
  );
}
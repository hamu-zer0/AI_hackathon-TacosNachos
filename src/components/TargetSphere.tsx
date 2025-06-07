'use client';

import { useEffect, useState } from 'react';

interface TargetSphereProps {
  conspiracyLevel: number;
}

export default function TargetSphere({ conspiracyLevel }: TargetSphereProps) {
  const [animating, setAnimating] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(conspiracyLevel);

  // 陰謀度に応じた球のサイズ計算 (最小50px, 最大200px)
  const baseSize = 50;
  const maxSize = 200;
  const sizeRange = maxSize - baseSize;
  const size = baseSize + (conspiracyLevel / 50) * sizeRange;

  // 陰謀度に応じた色計算
  const getColor = (level: number) => {
    if (level < 15) return 'from-green-400 to-green-600';
    if (level < 30) return 'from-yellow-400 to-yellow-600';
    if (level < 40) return 'from-orange-400 to-orange-600';
    return 'from-red-500 to-red-700';
  };

  // 危険度に応じたグロー効果
  const getGlow = (level: number) => {
    if (level >= 45) return 'shadow-red-500/50 shadow-2xl';
    if (level >= 35) return 'shadow-orange-500/50 shadow-xl';
    if (level >= 25) return 'shadow-yellow-500/50 shadow-lg';
    return 'shadow-green-500/50 shadow-md';
  };

  useEffect(() => {
    if (conspiracyLevel !== previousLevel) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setPreviousLevel(conspiracyLevel);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [conspiracyLevel, previousLevel]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* ターゲット球 */}
      <div className="relative flex items-center justify-center">
        <div
          className={`
            rounded-full
            bg-gradient-to-br ${getColor(conspiracyLevel)}
            ${getGlow(conspiracyLevel)}
            transition-all duration-300 ease-in-out
            ${animating ? 'animate-pulse scale-110' : 'scale-100'}
            border-4 border-white border-opacity-30
            flex items-center justify-center
            text-white font-bold text-lg
          `}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          TARGET
        </div>

        {/* 警告リング（高い陰謀度の時に表示） */}
        {conspiracyLevel >= 40 && (
          <div
            className="absolute rounded-full border-4 border-red-500 animate-ping"
            style={{
              width: `${size + 20}px`,
              height: `${size + 20}px`,
            }}
          />
        )}

        {/* 吸収エフェクト用のリング */}
        <div
          className="absolute rounded-full border-2 border-blue-400 opacity-0 transition-opacity duration-200"
          style={{
            width: `${size + 40}px`,
            height: `${size + 40}px`,
          }}
        />
      </div>

      {/* 陰謀度メーター */}
      <div className="mt-4 text-center">
        <div className="text-white font-bold text-xl mb-2">
          陰謀度: {conspiracyLevel}/50
        </div>
        
        {/* プログレスバー */}
        <div className="w-60 h-6 bg-gray-700 rounded-full overflow-hidden border-2 border-white border-opacity-30">
          <div
            className={`
              h-full transition-all duration-300 ease-in-out
              bg-gradient-to-r ${getColor(conspiracyLevel)}
              ${conspiracyLevel >= 45 ? 'animate-pulse' : ''}
            `}
            style={{
              width: `${(conspiracyLevel / 50) * 100}%`,
            }}
          />
        </div>

        {/* 警告メッセージ */}
        {conspiracyLevel >= 45 && (
          <div className="mt-2 text-red-400 font-bold animate-bounce">
            ⚠️ 危険レベル！ ⚠️
          </div>
        )}
      </div>
    </div>
  );
}
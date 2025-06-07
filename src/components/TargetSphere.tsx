'use client';

import { useEffect, useState } from 'react';

interface TargetSphereProps {
  conspiracyLevel: number;
}

export default function TargetSphere({ conspiracyLevel }: TargetSphereProps) {
  const [animating, setAnimating] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(conspiracyLevel);

  // 陰謀度に応じた球のサイズ計算 (最小120px, 最大300px)
  const baseSize = 120;
  const maxSize = 300;
  const sizeRange = maxSize - baseSize;
  const size = baseSize + (conspiracyLevel / 50) * sizeRange;

  // 陰謀度に応じた色とパルス効果
  const getColor = (level: number) => {
    if (level < 10) return 'from-blue-400 to-blue-600';
    if (level < 20) return 'from-green-400 to-green-600';
    if (level < 30) return 'from-yellow-400 to-yellow-600';
    if (level < 40) return 'from-orange-400 to-orange-600';
    return 'from-red-500 to-red-700';
  };

  // 危険度に応じたグロー効果
  const getGlow = (level: number) => {
    if (level >= 45) return 'shadow-red-500/70 shadow-2xl';
    if (level >= 35) return 'shadow-orange-500/50 shadow-xl';
    if (level >= 25) return 'shadow-yellow-500/50 shadow-lg';
    if (level >= 15) return 'shadow-green-500/50 shadow-md';
    return 'shadow-blue-500/50 shadow-md';
  };

  // フォントサイズを球のサイズに応じて調整
  const getFontSize = (sphereSize: number) => {
    if (sphereSize < 150) return 'text-sm';
    if (sphereSize < 200) return 'text-base';
    if (sphereSize < 250) return 'text-lg';
    return 'text-xl';
  };

  useEffect(() => {
    if (conspiracyLevel !== previousLevel) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setPreviousLevel(conspiracyLevel);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [conspiracyLevel, previousLevel]);

  return (
    <div className="flex items-center justify-center relative">
      {/* ターゲット球 */}
      <div className="relative flex items-center justify-center">
        <div
          className={`
            rounded-full
            bg-gradient-to-br ${getColor(conspiracyLevel)}
            ${getGlow(conspiracyLevel)}
            transition-all duration-500 ease-in-out
            ${animating ? 'animate-pulse scale-105' : 'scale-100'}
            border-4 border-white border-opacity-40
            flex items-center justify-center
            text-white font-bold ${getFontSize(size)}
            relative z-10
            ${conspiracyLevel >= 40 ? 'animate-pulse' : ''}
          `}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <span className="tracking-wider font-extrabold text-shadow-lg">
            TARGET
          </span>
        </div>

        {/* 危険レベルの警告リング */}
        {conspiracyLevel >= 40 && (
          <div
            className="absolute rounded-full border-4 border-red-500 animate-ping opacity-70"
            style={{
              width: `${size + 30}px`,
              height: `${size + 30}px`,
            }}
          />
        )}

        {/* 第二警告リング（最高危険時） */}
        {conspiracyLevel >= 47 && (
          <div
            className="absolute rounded-full border-2 border-red-400 animate-ping opacity-50"
            style={{
              width: `${size + 60}px`,
              height: `${size + 60}px`,
              animationDelay: '0.5s'
            }}
          />
        )}

        {/* 背景の光る効果 */}
        <div
          className={`
            absolute rounded-full opacity-30 -z-10
            bg-gradient-radial ${getColor(conspiracyLevel)}
            blur-xl
          `}
          style={{
            width: `${size + 40}px`,
            height: `${size + 40}px`,
          }}
        />
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/game';

interface PostComponentProps {
  post: Post;
  onAbsorbed: () => void;
  startPosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

export default function PostComponent({ 
  post, 
  onAbsorbed, 
  startPosition = { x: -300, y: Math.random() * 400 + 100 },
  targetPosition = { x: 600, y: 300 }
}: PostComponentProps) {
  const [position, setPosition] = useState(startPosition);
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 初期位置から画面内に移動
    const moveTimer = setTimeout(() => {
      setPosition({ x: 50, y: startPosition.y });
    }, 100);

    // 3秒後に吸収アニメーション開始
    const absorbTimer = setTimeout(() => {
      setIsAbsorbing(true);
      setPosition(targetPosition);
      setOpacity(0);
    }, 3000);

    // 4秒後に完全に削除
    const removeTimer = setTimeout(() => {
      onAbsorbed();
    }, 4000);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(absorbTimer);
      clearTimeout(removeTimer);
    };
  }, [startPosition, targetPosition, onAbsorbed]);

  return (
    <div
      className={`
        fixed z-20 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4
        transition-all duration-1000 ease-in-out
        ${isAbsorbing ? 'transform scale-50' : 'transform scale-100'}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {post.account_name.charAt(0)}
        </div>
        <div className="ml-3">
          <div className="font-bold text-gray-900">{post.account_name}</div>
          <div className="text-gray-500 text-sm">{post.account_id}</div>
        </div>
        <div className="ml-auto text-gray-400 text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 投稿内容 */}
      <div className="text-gray-800 mb-3 leading-relaxed">
        {post.text_content}
      </div>

      {/* ハッシュタグ */}
      <div className="flex flex-wrap gap-1 mb-3">
        {post.hash_tags.map((tag, index) => (
          <span
            key={index}
            className="text-blue-500 text-sm hover:text-blue-600 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* インタラクションボタン */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-1 hover:text-blue-500">
            <span>💬</span>
            <span>{Math.floor(Math.random() * 50)}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-green-500">
            <span>🔄</span>
            <span>{Math.floor(Math.random() * 100)}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-500">
            <span>❤️</span>
            <span>{Math.floor(Math.random() * 200)}</span>
          </button>
        </div>
        <button className="hover:text-gray-700">
          <span>📤</span>
        </button>
      </div>

      {/* 吸収エフェクト */}
      {isAbsorbing && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 rounded-xl animate-pulse" />
      )}
    </div>
  );
}
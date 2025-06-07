'use client';

import { useState, useEffect } from 'react';
import { PostWithMetadata } from '@/types/game';

interface PostComponentProps {
  post: PostWithMetadata;
  onAbsorbed: () => void;
  startPosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

export default function PostComponent({ 
  post, 
  onAbsorbed, 
  startPosition = { x: -300, y: 200 },
  targetPosition = { x: 600, y: 300 }
}: PostComponentProps) {
  const [position, setPosition] = useState(startPosition);
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let moveTimer: NodeJS.Timeout;
    let absorbTimer: NodeJS.Timeout;

    // 100ms後に画面内に移動
    moveTimer = setTimeout(() => {
      setPosition({ x: 50, y: startPosition.y });
    }, 100);

    // 3秒後に吸収アニメーション開始
    absorbTimer = setTimeout(() => {
      setPosition(targetPosition);
      onAbsorbed();
    }, 3000);

    // クリーンアップ関数
    return () => {
      if (moveTimer) clearTimeout(moveTimer);
      if (absorbTimer) clearTimeout(absorbTimer);
    };
  }, [startPosition.y, targetPosition, onAbsorbed]); // 必要な依存関係を追加

  return (
    <div
      className={`
        fixed z-20 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4
        transition-all duration-1000 ease-in-out
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
          {post.timestamp}
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
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-green-500">
            <span>🔄</span>
            <span>{post.retweets}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-red-500">
            <span>❤️</span>
            <span>{post.likes}</span>
          </button>
        </div>
        <button className="hover:text-gray-700">
          <span>📤</span>
        </button>
      </div>
    </div>
  );
}
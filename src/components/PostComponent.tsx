'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PostWithMetadata } from '@/types/game';

interface PostComponentProps {
  post: PostWithMetadata;
  onAbsorbed: () => void;
  // startPosition と targetPosition はCSSカスタムプロパティで渡すために残す
  startPosition?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
}

export default function PostComponent({
  post,
  onAbsorbed,
  startPosition = { x: -300, y: 200 }, // 初期位置
  targetPosition = { x: 600, y: 300 } // 吸収目標位置
}: PostComponentProps) {
  // isAbsorbing ステートを使って、どちらのアニメーションを適用するか制御します
  const [isAbsorbing, setIsAbsorbing] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 3秒後に吸収アニメーションを開始
    // JavaScriptでアニメーション開始のトリガーと onAbsorbed を呼び出す
    const absorbTimer = setTimeout(() => {
      setIsAbsorbing(true); // 吸収アニメーションのトリガー
    }, 6000);

    return () => {
      clearTimeout(absorbTimer);
    };
  }, []);

  // 吸収アニメーションが完了した後に onAbsorbed を呼び出す
  const handleAnimationEnd = useCallback(() => {
    if (isAbsorbing) {
      onAbsorbed();
    }
  }, [isAbsorbing, onAbsorbed]);

  // カスタムプロパティとしてCSSに値を渡す
  const cssVariables = useMemo(() => ({
    '--initial-x-position': `${startPosition.x}px`,
    '--initial-y-position': `${startPosition.y}px`,
    '--target-x': `${targetPosition.x}px`,
    '--target-y': `${targetPosition.y}px`,
  }), [startPosition, targetPosition]);


  return (
    <div
      ref={postRef}
      className={`
        fixed z-20 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4
        ${isAbsorbing ? 'animate-post-absorb' : 'animate-post-in'}
      `}
      style={{
        // CSS変数を使って位置を動的に設定
        left: `var(--initial-x-position)`, // 初期位置はCSSで設定
        top: `var(--initial-y-position)`,
        ...cssVariables // カスタムプロパティをスタイルに適用
      }}
      onAnimationEnd={handleAnimationEnd} // アニメーション終了時のイベントリスナー
    >
      {/* ... 既存のコンテンツ ... */}
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
# CLAUDE.md
全て日本語で回答してください
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

陰謀論に傾いた人を説得で正気に戻すWebゲームです。Next.js + TypeScript + Tailwind CSSで構築されています。

## Common Development Commands

- `npm run dev`: 開発サーバー起動（localhost:3000）
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバー起動
- `npm run lint`: ESLintでコードチェック

## Architecture

- **src/app/**: Next.js App Routerのメインディレクトリ
- **src/components/**: React コンポーネント
  - `StartScreen.tsx`: スタート画面
  - `GameScreen.tsx`: メインゲーム画面
  - `GameOverScreen.tsx`: ゲームオーバー画面
  - `TargetSphere.tsx`: 陰謀度に応じて膨張する球体
  - `PostComponent.tsx`: X風の陰謀論ポスト
  - `HistorySidebar.tsx`: 入力履歴とスコア表示
- **src/lib/**: ユーティリティとContext
  - `GameContext.tsx`: ゲーム状態管理
  - `api.ts`: localhost:8080のAPI連携
- **src/types/**: TypeScript型定義
- **src/posts.json**: 陰謀論ポストデータ
- **public/**: 静的ファイル（背景画像、BGM等）

## Game Logic

- 陰謀度：初期値20、最大値50でゲームオーバー
- 説得力・共感力：localhost:8080のAPIで1-5段階評価
- ポスト自動生成：3秒間隔で陰謀論ポストが画面外から球に吸収
- 吸収時に陰謀度1-3増加、効果的な入力で陰謀度減少

## API Integration

- エンドポイント: http://localhost:8080
- フォーマット: `{"prompt": "テーマを踏まえ、ターゲットに対する入力の説得力と共感力をそれぞれ５段階(1-5)で評価し、json形式{\"persuasive\": (説得力), \"empathy\": (共感力)}で出力してください。エラーの場合はどちらの評価も0でお願いします。\n\n入力: [ユーザー入力]"}`
- レスポンス: `{"persuasive": number, "empathy": number}`
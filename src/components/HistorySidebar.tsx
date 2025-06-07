'use client';

import { UserInput } from '@/types/game';

interface HistorySidebarProps {
  userInputs: UserInput[];
  totalPersuasive: number;
  totalEmpathy: number;
}

export default function HistorySidebar({ 
  userInputs, 
  totalPersuasive, 
  totalEmpathy 
}: HistorySidebarProps) {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 overflow-y-auto border-l-4 border-indigo-500 z-20 shadow-2xl">
      {/* スコア表示 */}
      <div className="mb-6 p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl border border-white/20 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow-lg">累計スコア</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-yellow-300 drop-shadow-md">{totalPersuasive}</div>
            <div className="text-sm text-yellow-100 font-medium">説得力</div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalPersuasive / 50) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-3xl font-bold text-green-300 drop-shadow-md">{totalEmpathy}</div>
            <div className="text-sm text-green-100 font-medium">共感力</div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (totalEmpathy / 50) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 入力履歴 */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center text-white">
          <span className="mr-3 text-2xl">📝</span>
          入力履歴
        </h3>
        
        {userInputs.length === 0 ? (
          <div className="text-gray-300 text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">💭</div>
            <div className="text-lg font-medium">まだ入力がありません</div>
            <div className="text-sm text-gray-400 mt-2">説得を開始してください</div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {userInputs.slice().reverse().map((input, index) => (
              <div
                key={userInputs.length - index - 1}
                className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 rounded-xl p-4 border border-white/10 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all duration-200"
              >
                {/* タイムスタンプ */}
                <div className="text-xs text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">⏰</span>
                  {input.timestamp.toLocaleTimeString()}
                </div>
                
                {/* 入力テキスト */}
                <div className="text-sm mb-4 leading-relaxed text-white bg-white/5 rounded-lg p-3">
                  &ldquo;{input.text}&rdquo;
                </div>
                
                {/* 評価スコア */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg px-3 py-2 text-center border border-yellow-400/30">
                    <span className="font-bold text-yellow-300 text-xs">説得力</span>
                    <div className="flex justify-center mt-1 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < input.persuasive ? 'text-yellow-400' : 'text-gray-500'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <div className="font-bold text-yellow-300 text-lg">{input.persuasive}/5</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg px-3 py-2 text-center border border-green-400/30">
                    <span className="font-bold text-green-300 text-xs">共感力</span>
                    <div className="flex justify-center mt-1 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < input.empathy ? 'text-green-400' : 'text-gray-500'
                          }`}
                        >
                          💚
                        </span>
                      ))}
                    </div>
                    <div className="font-bold text-green-300 text-lg">{input.empathy}/5</div>
                  </div>
                </div>
                
                {/* 効果表示 */}
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center bg-blue-500/20 rounded-full px-3 py-1 border border-blue-400/30">
                    <span className="text-blue-300 text-sm font-medium">
                      ⬇️ 陰謀度 -{((input.persuasive + input.empathy) * 0.5).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 統計情報 */}
      {userInputs.length > 0 && (
        <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="font-semibold mb-2">統計</h4>
          <div className="text-sm space-y-1">
            <div>総入力数: {userInputs.length}</div>
            <div>平均説得力: {(totalPersuasive / userInputs.length).toFixed(1)}</div>
            <div>平均共感力: {(totalEmpathy / userInputs.length).toFixed(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
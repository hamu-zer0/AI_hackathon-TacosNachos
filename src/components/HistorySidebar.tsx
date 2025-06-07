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
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 bg-opacity-95 text-white p-4 overflow-y-auto border-l-2 border-gray-700">
      {/* スコア表示 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
        <h2 className="text-xl font-bold mb-3">累計スコア</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalPersuasive}</div>
            <div className="text-sm">説得力</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalEmpathy}</div>
            <div className="text-sm">共感力</div>
          </div>
        </div>
      </div>

      {/* 入力履歴 */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <span className="mr-2">📝</span>
          入力履歴
        </h3>
        
        {userInputs.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            まだ入力がありません
          </div>
        ) : (
          <div className="space-y-3">
            {userInputs.slice().reverse().map((input, index) => (
              <div
                key={userInputs.length - index - 1}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700"
              >
                {/* タイムスタンプ */}
                <div className="text-xs text-gray-400 mb-2">
                  {input.timestamp.toLocaleTimeString()}
                </div>
                
                {/* 入力テキスト */}
                <div className="text-sm mb-3 leading-relaxed">
                  {input.text}
                </div>
                
                {/* 評価スコア */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-yellow-600 bg-opacity-30 rounded px-2 py-1 text-xs text-center">
                    <span className="font-semibold">説得力</span>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < input.persuasive ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="font-bold">{input.persuasive}/5</div>
                  </div>
                  
                  <div className="bg-green-600 bg-opacity-30 rounded px-2 py-1 text-xs text-center">
                    <span className="font-semibold">共感力</span>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < input.empathy ? 'text-green-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="font-bold">{input.empathy}/5</div>
                  </div>
                </div>
                
                {/* 効果表示 */}
                <div className="mt-2 text-xs text-center">
                  <span className="text-blue-400">
                    陰謀度 -{((input.persuasive + input.empathy) * 0.5).toFixed(1)}
                  </span>
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
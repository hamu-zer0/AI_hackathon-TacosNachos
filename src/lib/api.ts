import { ApiResponse } from '@/types/game';

const API_BASE_URL = 'http://localhost:8080';

export async function evaluateInput(inputText: string): Promise<ApiResponse> {
  try {
    const prompt = `テーマを踏まえ、ターゲットに対する入力の説得力と共感力をそれぞれ５段階(1-5)で評価し、json形式{"persuasive": (説得力), "empathy": (共感力)}で出力してください。エラーの場合はどちらの評価も0でお願いします。\n\n入力: ${inputText}`;
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // レスポンスの形式を検証
    if (typeof data.persuasive === 'number' && typeof data.empathy === 'number') {
      return {
        persuasive: Math.max(0, Math.min(5, data.persuasive)),
        empathy: Math.max(0, Math.min(5, data.empathy))
      };
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('API Error:', error);
    // エラーの場合は両方とも0を返す
    return {
      persuasive: 0,
      empathy: 0
    };
  }
}
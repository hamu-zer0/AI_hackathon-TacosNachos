import { ApiResponse } from '@/types/game';

const API_BASE_URL = 'http://localhost:8080';

export async function evaluateInput(theme: string, inputText: string): Promise<ApiResponse> {
  try {
    const prompt = `${inputText}`;
    console.log("send text")
    console.log(inputText)
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "theme": theme, "input": prompt })
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
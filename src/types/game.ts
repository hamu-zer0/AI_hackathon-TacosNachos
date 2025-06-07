export interface GameState {
  conspiracyLevel: number;
  totalPersuasive: number;
  totalEmpathy: number;
  gameStatus: 'start' | 'playing' | 'gameOver';
}

export interface ApiResponse {
  persuasive: number;
  empathy: number;
}

export interface UserInput {
  text: string;
  timestamp: Date;
  persuasive: number;
  empathy: number;
}

export interface Post {
  account_name: string;
  account_id: string;
  text_content: string;
  hash_tags: string[];
}

export interface PostData {
  [theme: string]: Post[];
}
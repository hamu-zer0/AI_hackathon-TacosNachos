export interface GameState {
  conspiracyLevel: number;
  totalPersuasive: number;
  totalEmpathy: number;
  gameStatus: 'start' | 'playing' | 'gameOver' | 'win';
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

export interface PostWithMetadata extends Post {
  id: number;
  yPosition: number;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
}

export interface PostData {
  [theme: string]: Post[];
}
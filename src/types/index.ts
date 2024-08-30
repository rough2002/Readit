export type Option = {
  value: string;
  label: string;
};

export type Post = {
  id: number;
  created_at: string;
  title: string;
  content: string;
  media_url: string | null;
  author_id: bigint;
  author_name: string;
  subreddit_name: string;
  total_votes: number;
  user_vote: number;
  comment_count: number;
  is_saved: boolean;
};

export interface Chat {
  id: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface Participant {
  id: string;
  chat_id: string;
  user_id: number;
  joined_at: string;
}

export type Comment = {
  post_id: number;
  id: number;
  content: string;
  user_id: number;
  is_deleted: boolean;
  created_at: string;
  username: string;
  replies_count: number;
  children?: Comment[];
};

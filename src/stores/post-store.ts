import { createStore } from "zustand";
import { Post } from "@/types";

type PostState = {
  posts: Post[];
  page: number;
  hasMore: boolean;
  setPosts: (posts: Post[]) => void;
  incrementPage: () => void;
  setHasMore: (hasMore: boolean) => void;
  incrementLikes: (postId: bigint) => void;
  decrementLikes: (postId: bigint) => void;
};

export type PostActions = {
  //   decrementLikes;
};

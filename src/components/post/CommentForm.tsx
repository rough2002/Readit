"use client";

import { useState, useTransition } from "react";
import { submitComment } from "@/lib/actions";
import LoadingButton from "../common/LoadingButton";

type CommentFormProps = {
  postId: number;
  parentId?: number;
};

export default function CommentForm({ postId, parentId }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      await submitComment(String(postId), parentId || null, content);
      setContent("");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 bg-white p-6 rounded-lg shadow-md"
    >
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-20 border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="Write your comment..."
        required
      />
      <LoadingButton
        type="submit"
        className={`bg-blue-500 group rounded px-5 py-2 font-medium text-white focus-visible:outlinet ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        isLoading={isPending}
      >
        Post
      </LoadingButton>
    </form>
  );
}

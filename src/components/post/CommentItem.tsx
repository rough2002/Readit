"use client";

import { useEffect, useState, useTransition } from "react";
import { submitComment, fetchCommentsOrReplies } from "@/lib/actions";
import LoadingButton from "@/components/common/LoadingButton";
import { useParams } from "next/navigation";
import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";

type CommentItemProps = {
  comment: Comment;
  depth: number;
};

export function CommentItem({ comment, depth }: CommentItemProps) {
  const params = useParams();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isPending] = useTransition();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [replyOffset, setReplyOffset] = useState(0);

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Submit the new comment
    const newComment = await submitComment(
      params?.id as string,
      comment.id,
      replyContent
    );

    // Add the new comment to the replies state
    setReplies((prevReplies) => [...prevReplies, newComment]);

    // Clear the form and close it
    setReplyContent("");
    setShowReplyForm(false);
  };

  const handleShowMoreReplies = async () => {
    const additionalReplies = await fetchCommentsOrReplies({
      postId: params.id as string,
      parentId: String(comment.id),
      limit: 10,
      offset: replyOffset,
    });

    setReplies((prevReplies) => {
      // Filter out any replies that are already in the state
      const newReplies = additionalReplies.filter(
        (reply) => !prevReplies.some((prevReply) => prevReply.id === reply.id)
      );

      const updatedReplies = [...prevReplies, ...newReplies];
      return updatedReplies;
    });
    setReplyOffset((prevOffset) => prevOffset + additionalReplies.length);
  };

  useEffect(() => {
    const fetchInitialReplies = async () => {
      if (comment.children && comment.children.length > 0) {
        setReplies(comment.children);
        setReplyOffset(comment.children.length);
      }
    };

    fetchInitialReplies();
  }, [comment.children]);

  const showMoreButton = comment.replies_count > replies.length;

  return (
    <li key={comment.id} className="mb-4 space-y-4">
      <div className="flex items-start gap-2">
        <div>
          <p className="text-sm text-gray-600">u/{comment.username}</p>
          <p>{comment.is_deleted ? "[Deleted]" : comment.content}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at))} ago
          </p>
        </div>
        <button
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="text-blue-500 hover:underline"
        >
          Reply
        </button>
      </div>

      {showReplyForm && (
        <form
          onSubmit={handleReply}
          className="relative bg-white p-4 rounded-lg shadow-md mt-2"
        >
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full h-24 border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
            placeholder="Write your reply..."
            required
          />
          <LoadingButton
            type="submit"
            className={`absolute bottom-2 right-2 bg-blue-500 rounded px-5 py-2 font-medium text-white focus:outline-none ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            isLoading={isPending}
          >
            {isPending ? "Posting..." : "Reply"}
          </LoadingButton>
        </form>
      )}

      {
        <ul className="border-l-2 border-l-orange-500 pl-4">
          {replies.map((child) => (
            <CommentItem comment={child} key={child.id} depth={depth + 1} />
          ))}
        </ul>
      }

      {showMoreButton && (
        <button
          onClick={handleShowMoreReplies}
          className="text-sm text-blue-500 mt-2"
        >
          Show {Math.min(comment.replies_count - replies.length, 10)} more
          replies
        </button>
      )}
    </li>
  );
}

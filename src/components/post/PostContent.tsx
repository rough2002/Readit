import { fetchPostData } from "@/lib/actions"; // Make sure this path is correct
import LikeButton from "./LikeButton";
import CommentsButton from "./CommentsButton";
import Link from "next/link";
import ShareButton from "./ShareButton";
import CommentForm from "./CommentForm";

async function PostContent({ id }: { id: string }) {
  const data = await fetchPostData(id);

  return (
    <>
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col space-y-4">
          <span className="bg-gray-200 text-gray-800 text-md w-fit font-semibold px-3 py-1 rounded-full">
            r/{data.subreddit_name}
          </span>
          <div className="text-sm text-gray-500 mb-6">
            <Link href={`/user/${data.author_name}`}>
              <span className="text-blue-600 font-semibold">
                {" "}
                u/
                {data.author_name}
              </span>
            </Link>
            on
            <span> {new Date(data.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h1>

        <div
          className="prose prose-lg text-gray-800 mb-6"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>

        {/* Conditional rendering for media, if any */}
        {data.media_url && (
          <div className="mt-6">
            <img
              src={data.media_url}
              alt="Post media"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Post statistics */}
        <div className="mt-8 flex space-x-6 text-sm text-gray-600">
          <LikeButton
            postId={data.id}
            initialVoteType={data.user_vote}
            totalVotes={data.total_votes}
          />
          <CommentsButton totalComments={data.comment_count} />
          <ShareButton postId={data.id} title={data.title} />
        </div>
      </div>
      <CommentForm postId={data.id} />
      {/* <CommentsList comments={comments} /> */}
    </>
  );
}

export default PostContent;

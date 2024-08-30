import React from 'react';
import { Post as PostType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from './LikeButton';
import CommentsButton from './CommentsButton';
import ShareButton from './ShareButton';
import SavePostButton from './SaveButton';

interface PostProps {
  post: PostType;
}

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <Link href={`/post/${post.id}`}>
      <div className="p-4 mb-4 bg-white text-black rounded-lg shadow-md">
        <p className="text-sm text-gray-500 mt-4">
          Posted in r/{post.subreddit_name} by user {post.author_name} on{' '}
          {new Date(post.created_at).toLocaleString()}
        </p>
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <div
          className="prose line-clamp-3 overflow-hidden text-ellipsis"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* {post.media_url && (
        <div className="mt-4">
        <Image
        src={post.media_url}
        alt="Post media"
        className="max-w-full h-auto rounded"
        width={40}
        height={60}
        />
        </div>
        )} */}
        <div className="flex space-x-8">
          <LikeButton
            postId={post.id}
            initialVoteType={post.user_vote}
            totalVotes={post.total_votes}
          />
          <CommentsButton totalComments={post.comment_count} />
          <ShareButton postId={post.id} title={post.title} />
          <SavePostButton postId={post.id} initialIsSaved={post.is_saved} />
        </div>
      </div>
    </Link>
  );
};

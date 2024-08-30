'use client';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchCommentsOrReplies } from '@/lib/actions';
import { CommentItem } from './CommentItem';

interface InfiniteCommentsProps {
  postId: string;
}

const pageSize = 10;

const InfiniteComments: React.FC<InfiniteCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (offsetValue: number) => {
    try {
      const newComments = await fetchCommentsOrReplies({
        parentId: null,
        postId,
        limit: pageSize,
        offset: offsetValue
      });
      if (newComments.length === 0) {
        setHasMore(false);
      }
      console.log(comments);
      setComments((prevComments) => [...prevComments, ...newComments]);
      setOffset(offsetValue + pageSize);
    } catch (error) {
      console.error('Error fetching comments', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <InfiniteScroll
      dataLength={comments.length}
      next={() => fetchData(offset)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <ul>
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} depth={0} />
        ))}
      </ul>
    </InfiniteScroll>
  );
};

export default InfiniteComments;

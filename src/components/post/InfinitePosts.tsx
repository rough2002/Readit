'use client';

import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Post } from '@/components/post/Post'; // Adjust the import path to where Post is located

interface InfiniteScrollComponentProps {
  pageSize: number;
  fetchDataFunction: (limit: number, offset: number) => Promise<any[]>;
}

const InfinitePosts: React.FC<InfiniteScrollComponentProps> = ({
  pageSize,
  fetchDataFunction
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (offsetValue: number) => {
    try {
      const newItems = await fetchDataFunction(pageSize, offsetValue);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setOffset(offsetValue + pageSize);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={() => fetchData(offset)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <div>
        {items.map((item) => (
          <Post key={item.id} post={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default InfinitePosts;

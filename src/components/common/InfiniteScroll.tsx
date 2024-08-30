'use client';
import { Post } from '@/types';
import { useState, useEffect } from 'react';

type InfiniteScrollProps = {
  fetchItems: (page: number) => Promise<Post[]>;
  renderItem: (item: Post) => React.ReactNode;
  pageSize: number;
};

function InfiniteScroll<T>({
  fetchItems,
  renderItem,
  pageSize
}: Readonly<InfiniteScrollProps>) {
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const newItems: Post[] = await fetchItems(page);
        setItems((prevItems) => [...prevItems, ...newItems]);
        setError(null);
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [page, fetchItems]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default InfiniteScroll;

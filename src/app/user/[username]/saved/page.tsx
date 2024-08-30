// app/user/[username]/saved/page.tsx

import { auth } from '@/auth';
import InfinitePosts from '@/components/post/InfinitePosts';
import { fetchSavedPosts } from '@/lib/actions'; // Adjust import path

const PAGE_SIZE = 10;

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  const userId = session?.user?.id; // Fetch userId from session
  const currentUser = session?.user?.username; // Fetch current user's username

  if (!userId) {
    return <p>Please log in to view saved posts.</p>;
  }

  if (currentUser !== params.username) {
    // Show an access denied message
    return <p>You don't have access to view this page.</p>;
  }

  if (!userId) {
    return <p>Please log in to view saved posts.</p>;
  }

  const fetchDataFunction = async (limit: number, offset: number) => {
    'use server';
    return fetchSavedPosts(userId, limit, offset);
  };

  return (
    <InfinitePosts pageSize={PAGE_SIZE} fetchDataFunction={fetchDataFunction} />
  );
};

export default Page;

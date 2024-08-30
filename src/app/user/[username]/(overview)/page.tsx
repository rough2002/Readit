// app/user/[username]/posts/page.tsx

import { auth } from '@/auth';
import InfinitePosts from '@/components/post/InfinitePosts';
import { fetchUserPosts, getUserProfileByUsername } from '@/lib/actions'; // Adjust import path

const PAGE_SIZE = 10;

const Page = async ({ params }: { params: { username: string } }) => {
  const session = await auth();
  const user = await getUserProfileByUsername(params.username);
  const userId = session?.user?.id; // Fetch userId from session

  if (!userId) {
    return <p>Please log in to view posts.</p>;
  }

  const fetchDataFunction = async (limit: number, offset: number) => {
    'use server';
    return fetchUserPosts(userId, user.id, limit, offset);
  };

  return (
    <InfinitePosts pageSize={PAGE_SIZE} fetchDataFunction={fetchDataFunction} />
  );
};

export default Page;

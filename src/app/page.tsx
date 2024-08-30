import InfinitePosts from '@/components/post/InfinitePosts';
import { fetchPosts } from '@/lib/actions'; // Your function for fetching posts

const PAGE_SIZE = 10;

const PostsPage = () => {
  return (
    <div>
      <InfinitePosts pageSize={PAGE_SIZE} fetchDataFunction={fetchPosts} />
    </div>
  );
};

export default PostsPage;

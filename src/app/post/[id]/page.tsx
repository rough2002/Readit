import InfiniteComments from '@/components/post/InfiniteComments';
import PostContent from '@/components/post/PostContent';
import { Suspense } from 'react';

interface PageProps {
  params: { id: string };
}

function Page({ params }: PageProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading post...</div>}>
        <PostContent id={params.id} />
        <InfiniteComments postId={params.id} />
      </Suspense>
    </div>
  );
}

export default Page;

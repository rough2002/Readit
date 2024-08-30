// app/api/toggle-save-post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/app/_lib/supabase';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { postId } = await req.json();

  // Check if the post is already saved by the user
  const { data, error: fetchError } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (data) {
    // Unsave the post
    const { error: deleteError } = await supabase
      .from('saved_posts')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post unsaved', is_saved: false });
  } else {
    // Save the post
    const { error: insertError } = await supabase
      .from('saved_posts')
      .insert({ user_id: session.user.id, post_id: postId });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post saved', is_saved: true });
  }
}

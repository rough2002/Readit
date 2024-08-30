import { supabase } from "@/app/_lib/supabase";
import { auth } from "@/auth"; // Assuming auth is a middleware or utility to get the authenticated user
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { post_id, vote_type } = await request.json();

    // Get the authenticated user
    const session = await auth();
    console.log(session);

    if (!session?.user || !post_id || ![1, -1, 0].includes(vote_type)) {
      return NextResponse.json(
        { error: "Invalid request data or unauthorized" },
        { status: 400 }
      );
    }
    console.log({ post_id, user_id: session.user.id, vote_type });

    // Call the stored procedure to handle the vote
    const { data, error } = await supabase.rpc("handle_vote", {
      postid: post_id,
      userid: session.user.id,
      votetype: vote_type,
    });
    console.log(post_id, session.user.id, vote_type);

    if (error) {
      console.error("Error processing vote:", error.message);
      return NextResponse.json(
        { error: "Error processing vote" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

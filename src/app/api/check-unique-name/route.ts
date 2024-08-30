import { supabase } from "@/app/_lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { unique: false, message: "Invalid name" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("subreddits")
    .select("name")
    .eq("name", name);

  if (error) {
    return NextResponse.json(
      { unique: false, message: error.message },
      { status: 500 }
    );
  }

  if (data.length > 0) {
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json(
      { unique: true, message: "Name is available" },
      { status: 200 }
    );
  }
}

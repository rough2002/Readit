import { supabase } from "@/app/_lib/supabase";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const res = await auth();
    console.log(res);
    const formData = await request.formData();
    console.log(formData);
    NextResponse.json({ res });
  } catch (error) {}
}

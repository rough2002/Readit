import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function test() {
  try {
    return "Hello world";
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
}
export async function GET() {
  const session = await auth();
  console.log(session);
  const res = await test();
  console.log("hello");
  return NextResponse.json({ res });
}

// export { handler as GET };

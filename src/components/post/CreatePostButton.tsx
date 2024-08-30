"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";

function CreatePostButton() {
  const router = useRouter();
  const pathname = usePathname();
  const handleCreatePost = () => {
    if (pathname.startsWith("/user/")) {
      // If on a user profile, go to /submit
      router.push("/submit");
    } else if (pathname.startsWith("/r/")) {
      // If on a subreddit page, keep the subreddit context
      const subredditPath = pathname.split("/").slice(0, 2).join("/");
      router.push(`${subredditPath}/submit`);
    } else {
      // Default to /submit
      router.push("/submit");
    }
  };

  return <Button onClick={handleCreatePost}>Create Post</Button>;
}

export default CreatePostButton;

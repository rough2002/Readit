"use client";

import { useState } from "react";
import { createPost } from "@/lib/actions";
import { Option } from "@/types";
import TipTap from "./TipTap";
import { Input } from "../ui/input";
import { ThreadSearch } from "../ThreadSearch";
import showErrorToast from "../Toast/ErrorToast";
import LoadingButton from "../common/LoadingButton";

function CreatePostForm() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState<Option | null>(
    null
  );

  const handleSubmit = async () => {
    if (selectedSubreddit) {
      console.log(title, content, selectedSubreddit.value);
      setLoading(true);
      try {
        await createPost({
          title,
          content,
          subreddit_id: selectedSubreddit.value,
        });
      } catch (error) {
        showErrorToast("Error happened while creating subreddit");
      } finally {
        setLoading(false);
      }
    } else {
      showErrorToast("Please select a subreddit");
    }
  };

  return (
    <div>
      <p>Select Community</p>
      <ThreadSearch
        selectedSubreddit={selectedSubreddit}
        setSelectedSubreddit={setSelectedSubreddit}
      />
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="mb-4 p-2 border border-gray-300 rounded"
        required
      />
      <TipTap content={content} setContent={setContent} />

      <LoadingButton
        onClick={handleSubmit}
        className="group rounded px-5 py-2 font-medium focus-visible:outline bg-blue-500 text-white"
        isLoading={loading}
      >
        Create Post
      </LoadingButton>
    </div>
  );
}

export default CreatePostForm;

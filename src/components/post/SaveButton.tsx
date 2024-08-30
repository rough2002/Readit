'use client';

import { useState, useEffect, MouseEvent } from 'react';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import axios from 'axios';

type SavePostButtonProps = {
  postId: number;
  initialIsSaved: boolean;
};
function SavePostButton({ postId, initialIsSaved }: SavePostButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleToggleSavePost = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/toggle-save-post', { postId });

      if (response.status !== 200) {
        throw new Error('Failed to toggle save post');
      }
      setIsSaved(response.data.is_saved);
    } catch (error) {
      console.error('Error toggling save post:', error);
    }
  };

  return (
    <button
      onClick={(e) => handleToggleSavePost(e)}
      aria-label={isSaved ? 'Unsave' : 'Save'}
      className="hover:bg-blue-200 rounded flex items-center justify-center w-8 h-8"
    >
      {isSaved ? (
        <GoBookmarkFill className="text-blue-500" size={24} />
      ) : (
        <GoBookmark size={24} />
      )}
    </button>
  );
}

export default SavePostButton;

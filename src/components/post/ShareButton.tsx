'use client';
import React, { MouseEvent } from 'react';
import { IoShareSocialOutline } from 'react-icons/io5';

interface ShareButtonProps {
  postId: number;
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ postId, title }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const postUrl = `${baseUrl}/posts/${postId}`;

  const handleShare = (e: MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: postUrl
        })
        .then(() => console.log('Thanks for sharing!'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      alert('Web Share API not supported. Copy the URL to share.');
    }
  };

  return (
    <button
      onClick={(e: MouseEvent) => handleShare(e)}
      className="hover:bg-blue-200 rounded-full flex items-center justify-center"
    >
      <IoShareSocialOutline className="mr-2" size={24} />
    </button>
  );
};

export default ShareButton;

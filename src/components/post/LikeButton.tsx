'use client';
import React, { useState } from 'react';
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote
} from 'react-icons/bi';

interface LikeButtonProps {
  postId: number;
  initialVoteType: number;
  totalVotes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialVoteType = 0,
  totalVotes
}) => {
  const [voteType, setVoteType] = useState<number>(initialVoteType);
  const [votes, setVotes] = useState<number>(Number(totalVotes));

  const handleVoteChange = async (e: React.MouseEvent, newVoteType: number) => {
    e.preventDefault();
    e.stopPropagation(); //
    try {
      const response = await fetch('/api/post/reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post_id: postId,
          vote_type: newVoteType
        })
      });

      const data = await response.json();

      if (response.ok) {
        const voteDifference = newVoteType - voteType;

        // Update the local state with the new vote type and total votes
        setVoteType(newVoteType);
        setVotes((prevVotes) => prevVotes + voteDifference);
      } else {
        console.error('Error updating vote:', data.error);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => handleVoteChange(e, voteType === 1 ? 0 : 1)}
        className={`like-button ${voteType === 1 ? 'text-blue-500' : ''}`}
      >
        {voteType === 1 ? <BiSolidUpvote size={24} /> : <BiUpvote size={24} />}
      </button>
      <span>{votes.toString()}</span>
      <button
        onClick={(e) => handleVoteChange(e, voteType === -1 ? 0 : -1)}
        className={`dislike-button ${voteType === -1 ? 'text-red-500' : ''}`}
      >
        {voteType === -1 ? (
          <BiSolidDownvote size={24} />
        ) : (
          <BiDownvote size={24} />
        )}
      </button>
    </div>
  );
};

export default LikeButton;

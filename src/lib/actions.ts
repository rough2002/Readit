'use server';
import { supabase } from '@/app/_lib/supabase';
import { z } from 'zod';
import { Chat, Message, Comment } from '@/types';
import { subredditSchema } from './validation-schemas';
import { auth } from '@/auth';
import { client } from './pgClient';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCommentsOrReplies } from './queries';

export const createSubreddit = async (
  values: z.infer<typeof subredditSchema>
) => {
  const session = await auth();
  if (session) {
    const { error } = await supabase.from('subreddits').insert([
      {
        ...values,
        naem: values.name.toLowerCase(),
        creator_id: session.user?.id
      }
    ]);
    if (error) {
      throw new Error('Error creating a subreddit');
    }
  } else {
    throw new Error('User session expired');
  }
};

export const createPost = async (args: {
  title: string;
  content: string;
  subreddit_id: string;
}) => {
  const session = await auth();
  console.log(args.content);
  if (session) {
    const { error } = await supabase.from('posts').insert([
      {
        author_id: session.user?.id,
        ...args
      }
    ]);
    if (error) {
      console.log(error);
      throw new Error('Error creating the post');
    }
  } else {
    throw new Error('User session expired');
  }
};

export const fetchSubreddits = async (name: string) => {
  const { data, error } = await supabase
    .from('subreddits')
    .select('id,name,icon')
    .ilike('name', `%${name}%`);
  console.log(data);
  if (error) {
    throw new Error('Error getting subreddit list');
  }

  return data;
};

export const fetchPosts = async (limit: number, offset: number) => {
  const session = await auth();
  const userid = session?.user?.id;

  if (!userid) {
    throw new Error('User is not authenticated');
  }

  const query = `SELECT 
    p.id,
    p.created_at,
    p.title,
    p.content,
    p.media_url,
    p.author_id, -- Include the user_id (author_id) here
    u.username as author_name,
    s.name AS subreddit_name,
    COALESCE(SUM(v.vote_type), 0) AS total_votes,
    COALESCE(
        (SELECT v.vote_type FROM votes v WHERE v.post_id = p.id AND v.user_id = $1 LIMIT 1),
        0
    ) AS user_vote,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
    -- Check if the post is saved by the user
    CASE 
        WHEN sp.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_saved
FROM 
    posts p
JOIN 
    users u ON p.author_id = u.id
JOIN 
    subreddits s ON p.subreddit_id = s.id
LEFT JOIN 
    votes v ON p.id = v.post_id
LEFT JOIN 
    saved_posts sp ON p.id = sp.post_id AND sp.user_id = $1 -- Check if the post is saved by the current user
GROUP BY 
    p.id, p.created_at, p.title, p.content, p.media_url, p.author_id, u.username, s.name, sp.user_id
ORDER BY 
    p.created_at DESC
LIMIT $2 OFFSET $3;
`;

  const values = [userid, limit, offset];

  try {
    // connect();
    const res = await client.query(query, values);
    console.log(res.rows);
    return res.rows;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

export const fetchPostData = async (id: string) => {
  const session = await auth();
  const userid = session?.user?.id;

  if (!userid) {
    throw new Error('User is not authenticated');
  }

  const query = `
    SELECT 
      p.id,
      p.created_at,
      p.title,
      p.content,
      p.media_url,
      p.author_id, 
      u.username AS author_name,
      s.name AS subreddit_name,
      COALESCE(SUM(v.vote_type), 0) AS total_votes,
      COALESCE(
        (SELECT v.vote_type FROM votes v WHERE v.post_id = p.id AND v.user_id = $1 LIMIT 1),
        0
      ) AS user_vote,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
    FROM 
      posts p
    JOIN 
      users u ON p.author_id = u.id
    JOIN 
      subreddits s ON p.subreddit_id = s.id
    LEFT JOIN 
      votes v ON p.id = v.post_id
    WHERE 
      p.id = $2
    GROUP BY 
      p.id, p.created_at, p.title, p.content, p.media_url, p.author_id, u.username, s.name
  `;

  try {
    const values = [userid, id];
    const res = await client.query(query, values);

    if (res.rows.length === 0) {
      throw new Error('Post not found');
    }

    return res.rows[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
};

export async function fetchChatMessages(
  chatId: string,
  userId: number
): Promise<Message[]> {
  // Check if the user is a participant in the chat
  const { data: participant, error: participantError } = await supabase
    .from('participants')
    .select('*')
    .eq('chat_id', chatId)
    .eq('user_id', userId)
    .single();

  if (participantError || !participant) {
    throw new Error('Unauthorized: You are not a participant in this chat.');
  }

  // Fetch the messages if the user is authorized
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    throw new Error('Error fetching messages: ' + messagesError.message);
  }

  return messages;
}

export const fetchChatList = async () => {
  const session = await auth();
  const userid = session?.user?.id;

  if (!userid) {
    throw new Error('User is not authenticated');
  }

  const query = `SELECT 
    chats.id, 
    users.username AS recipient_name,
    users.id AS recipient_id
FROM 
    chats
JOIN 
    participants ON chats.id = participants.chat_id
JOIN 
    users ON participants.user_id = users.id
WHERE 
    participants.chat_id IN (
        SELECT chat_id 
        FROM participants 
        WHERE user_id = $1
    )
AND 
    participants.user_id != $1;
`;

  try {
    const values = [userid];
    const res = await client.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw new Error('Error fetching user chats');
  }
};

export const fetchUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();
  if (error) {
    throw new Error('Error occured while fetching receiver');
  }
  return data;
};

export async function fetchOrCreateChatId(
  currentUserId: number,
  recipientId: number
) {
  try {
    const chatName = `${Math.min(currentUserId, recipientId)}_${Math.max(
      currentUserId,
      recipientId
    )}`;

    // Try to fetch the chat ID
    const { data: chat, error: fetchError } = await supabase
      .from('chats')
      .select('id')
      .eq('name', chatName)
      .single();

    if (fetchError) {
      console.error('Error fetching chat: ', fetchError.message);
    }

    if (chat) {
      // Chat exists, return the chat ID
      return chat.id;
    } else {
      // Chat does not exist, create a new one
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert([
          { name: chatName } // Add any additional fields as needed
        ])
        .select('id')
        .single();

      if (createError) {
        throw new Error('Error creating chat: ' + createError.message);
      }

      const participantEntries = [
        { chat_id: newChat.id, user_id: currentUserId },
        { chat_id: newChat.id, user_id: recipientId }
      ];

      const { error: participantError } = await supabase
        .from('participants')
        .insert(participantEntries);

      if (participantError) {
        throw new Error(
          'Error adding participants: ' + participantError.message
        );
      }

      // Return the newly created chat ID
      return newChat.id;
    }
  } catch (error) {
    console.error('Error in fetchOrCreateChatId: ', error);
    throw error;
  }
}

export async function submitComment(
  postId: string,
  parentId: number | null,
  content: string
) {
  const session = await auth();
  const userid = session?.user?.id;

  if (!userid) {
    throw new Error('User is not authenticated');
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        parent_id: parentId,
        content: content,
        user_id: userid,
        is_deleted: false
      }
    ])
    .select(
      `id, post_id , parent_id , users(id , username),is_deleted, created_at, content`
    ); // Select the newly inserted comment to return it

  if (error) {
    throw new Error(`Error submitting comment: ${error.message}`);
  }

  console.log(data[0]);
  const comment: Comment = {
    id: data?.[0].id as number,
    post_id: data?.[0].post_id as number, // Casting as number | null to handle cases where it might be null
    user_id: data?.[0].users.id, // Access the object directly
    username: data?.[0].users.username as string,
    content: data?.[0].content,
    created_at: data?.[0].created_at,
    is_deleted: data?.[0].is_deleted,
    replies_count: 0, // Assuming replies_count is part of the data
    children: [] // Assuming children might be undefined or an array of Comment
  };
  // Return the first (and only) inserted comment
  return comment;
}

export const fetchCommentsOrReplies = async (args: {
  parentId: string | null;
  postId: string;
  limit: number;
  offset: number;
}) => {
  // Determine if parentId is provided (i.e., fetch replies)
  const isReply = args.parentId !== null;

  // Choose the query and values based on whether we're fetching replies or top-level comments
  const query = getCommentsOrReplies(isReply);
  const values = isReply
    ? [args.parentId, args.postId, args.limit, args.offset]
    : [args.postId, args.limit, args.offset];
  try {
    const res = await client.query(query, values);
    // Map the results to the appropriate format
    const commentsOrReplies = res.rows.map((row) => {
      if (row.result[0].replies_count === 0) {
        return { ...row.result[0], children: [] };
      }
      return row.result[0];
    });
    console.log(commentsOrReplies); // For debugging
    return commentsOrReplies || [];
  } catch (error) {
    console.error('Error fetching comments or replies:', error);
    throw new Error('Failed to fetch comments or replies');
  }
};

export async function getUserProfileByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();
  if (error) {
    throw new Error('Error getting user profile');
  }
  return data;
}

export const fetchUserPosts = async (
  userId: string,
  authorId: string,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT 
        p.id,
        p.created_at,
        p.title,
        p.content,
        p.media_url,
        p.author_id,
        u.username AS author_name,
        s.name AS subreddit_name,
        COALESCE(SUM(v.vote_type), 0) AS total_votes,
        COALESCE(
            (SELECT v.vote_type FROM votes v WHERE v.post_id = p.id AND v.user_id = $1 LIMIT 1),
            0
        ) AS user_vote,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
        CASE 
            WHEN sp.user_id IS NOT NULL THEN TRUE
            ELSE FALSE
        END AS is_saved
    FROM 
        posts p
    JOIN 
        users u ON p.author_id = u.id
    JOIN 
        subreddits s ON p.subreddit_id = s.id
    LEFT JOIN 
        votes v ON p.id = v.post_id
    LEFT JOIN 
        saved_posts sp ON p.id = sp.post_id AND sp.user_id = $1
    WHERE 
        p.author_id = $2
    GROUP BY 
        p.id, p.created_at, p.title, p.content, p.media_url, p.author_id, u.username, s.name, sp.user_id
    ORDER BY 
        p.created_at DESC
    LIMIT $3 OFFSET $4;
  `;

  try {
    const values = [userId, authorId, limit, offset];
    const res = await client.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw new Error('Failed to fetch user posts');
  }
};

export const fetchSavedPosts = async (
  userId: string,
  limit: number,
  offset: number
) => {
  const query = `
    SELECT 
        p.id,
        p.created_at,
        p.title,
        p.content,
        p.media_url,
        p.author_id,
        u.username AS author_name,
        s.name AS subreddit_name,
        COALESCE(SUM(v.vote_type), 0) AS total_votes,
        COALESCE(
            (SELECT v.vote_type FROM votes v WHERE v.post_id = p.id AND v.user_id = $1 LIMIT 1),
            0
        ) AS user_vote,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
        TRUE AS is_saved
    FROM 
        posts p
    JOIN 
        users u ON p.author_id = u.id
    JOIN 
        subreddits s ON p.subreddit_id = s.id
    LEFT JOIN 
        votes v ON p.id = v.post_id
    JOIN
        saved_posts sp ON p.id = sp.post_id
    WHERE 
        sp.user_id = $1
    GROUP BY 
        p.id, p.created_at, p.title, p.content, p.media_url, p.author_id, u.username, s.name
    ORDER BY 
        p.created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  try {
    const values = [userId, limit, offset];
    const res = await client.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw new Error('Failed to fetch saved posts');
  }
};

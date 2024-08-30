export const getCommentsOrReplies = (isReply: boolean) => `
  WITH top_level_comments AS (
  SELECT
    c.id,
    c.content,
    c.user_id,
    c.post_id,
    c.is_deleted,
    c.karma,
    c.created_at,
    u.username AS user_name
  FROM
    comments c
  JOIN
    users u ON c.user_id = u.id
  WHERE
  ${isReply ? "c.parent_id = $1" : "c.parent_id IS NULL"}
      AND c.post_id =  ${isReply ? "$2" : "$1"}
    ORDER BY
      c.created_at ASC
    LIMIT  ${isReply ? "$3" : "$2"}
    OFFSET  ${isReply ? "$4" : "$3"}
),
oldest_replies AS (
  SELECT
    c.id,
    c.content,
    c.user_id,
    c.post_id,
    c.is_deleted,
    c.karma,
    c.created_at,
    c.parent_id,
    u.username AS user_name
  FROM
    comments c
  JOIN
    users u ON c.user_id = u.id
  WHERE
    (c.parent_id, c.created_at) IN (
      SELECT
        parent_id,
        MIN(created_at)
      FROM
        comments
      WHERE
        parent_id IS NOT NULL
      GROUP BY
        parent_id
    )
),
reply_counts AS (
  SELECT
    parent_id,
    COUNT(*) AS reply_count
  FROM
    comments
  WHERE
    parent_id IS NOT NULL
  GROUP BY
    parent_id
),
child_reply_counts AS (
  SELECT
    parent_id,
    COUNT(*) AS reply_count
  FROM
    comments
  WHERE
    parent_id IN (SELECT id FROM oldest_replies)
  GROUP BY
    parent_id
),
comments_with_replies AS (
  SELECT
    tlc.id AS comment_id,
    tlc.content AS comment_content,
    tlc.user_id AS comment_user_id,
    tlc.user_name AS comment_user_name,
    tlc.post_id AS comment_post_id,
    tlc.is_deleted AS comment_is_deleted,
    tlc.created_at AS comment_created_at,
    COALESCE(rc.reply_count, 0) AS replies_count,
    orp.id AS reply_id,
    orp.content AS reply_content,
    orp.user_id AS reply_user_id,
    orp.user_name AS reply_user_name,
    orp.post_id AS reply_post_id,
    orp.is_deleted AS reply_is_deleted,
    orp.karma AS reply_karma,
    orp.created_at AS reply_created_at,
    COALESCE(crc.reply_count, 0) AS reply_replies_count
  FROM
    top_level_comments tlc
  LEFT JOIN
    oldest_replies orp
  ON
    tlc.id = orp.parent_id
  LEFT JOIN
    reply_counts rc
  ON
    tlc.id = rc.parent_id
  LEFT JOIN
    child_reply_counts crc
  ON
    orp.id = crc.parent_id
)
SELECT
  jsonb_agg(
    jsonb_build_object(
      'id', comment_id,
      'content', comment_content,
      'user_id', comment_user_id,
      'username', comment_user_name,
      'post_id', comment_post_id,
      'is_deleted', comment_is_deleted,
      'created_at', comment_created_at,
      'replies_count', replies_count,
      'children', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', reply_id,
            'content', reply_content,
            'user_id', reply_user_id,
            'username', reply_user_name,
            'post_id', reply_post_id,
            'is_deleted', reply_is_deleted,
            'created_at', reply_created_at,
            'replies_count', reply_replies_count
          )
        )
        FROM comments_with_replies AS replies
        WHERE replies.comment_id = comments_with_replies.comment_id
      )
    )
  ) AS result
FROM comments_with_replies
GROUP BY comment_id;`;

//  ${isReply ? "c.parent_id = $1" : "c.parent_id IS NULL"}
//       AND c.post_id =  ${isReply ? "$2" : "$1"}
//     ORDER BY
//       c.created_at ASC
//     LIMIT  ${isReply ? "$3" : "$2"}
//     OFFSET  ${isReply ? "$4" : "$3"}

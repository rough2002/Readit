import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request: Request) {
  try {
    const { senderId, recipientId, content } = await request.json();

    // Check if a chat already exists between the two users
    const { data: existingChat, error: chatError } = await supabase
      .from("chats")
      .select("id")
      .eq(
        "name",
        `${Math.min(senderId, recipientId)}_${Math.max(senderId, recipientId)}`
      )
      .single();

    let chatId: string;

    if (chatError && chatError.code !== "PGRST116") {
      throw new Error("Error checking chat existence: " + chatError.message);
    }

    if (!existingChat) {
      // Chat does not exist, create a new chat
      const { data: newChat, error: insertChatError } = await supabase
        .from("chats")
        .insert([
          {
            name: `${Math.min(senderId, recipientId)}_${Math.max(
              senderId,
              recipientId
            )}`,
          },
        ])
        .select("id")
        .single();

      if (insertChatError) {
        throw new Error("Error creating chat: " + insertChatError.message);
      }

      chatId = newChat.id;

      // Add participants to the chat
      const participantEntries = [
        { chat_id: chatId, user_id: senderId },
        { chat_id: chatId, user_id: recipientId },
      ];

      const { error: participantError } = await supabase
        .from("participants")
        .insert(participantEntries);

      if (participantError) {
        throw new Error(
          "Error adding participants: " + participantError.message
        );
      }
    } else {
      // Chat exists, get its ID
      chatId = existingChat.id;
    }

    // Insert the message into the chat
    const { error: messageError } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender_id: senderId, content }]);

    if (messageError) {
      throw new Error("Error sending message: " + messageError.message);
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

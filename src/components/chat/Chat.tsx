"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
} from "react";
import { supabase } from "@/app/_lib/supabase";
import axios from "axios";
import { fetchOrCreateChatId } from "@/lib/actions";
import { useChatStore } from "@/providers/chat-store-provider"; // Import the custom hook
import { IoChatbubblesOutline } from "react-icons/io5";

interface ChatProps {
  currentUserId: number;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: number;
  content: string;
  created_at: string;
}

const fetchChatMessages = async (chatId: string): Promise<Message[]> => {
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw new Error("Error fetching messages: " + messagesError.message);
  }

  return messages as Message[];
};

const subscribeToChatMessages = (
  chatId: string,
  callback: (newMessage: Message) => void
) => {
  const chatChannel = supabase
    .channel("realtime-chat")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(chatChannel);
  };
};

const Chat: React.FC<ChatProps> = ({ currentUserId }) => {
  const { recipientId, chats } = useChatStore((state) => state);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to the bottom

  // Get recipient from chats array in the store
  const recipient = chats.find((chat) => chat.recipient_id === recipientId);

  useEffect(() => {
    if (!recipientId) return; // If no recipient, return

    const initializeChat = async () => {
      try {
        const chatId = await fetchOrCreateChatId(currentUserId, recipientId);
        setChatId(chatId);
      } catch (error) {
        console.error("Failed to get or create chat ID:", error);
      }
    };

    initializeChat();
  }, [currentUserId, recipientId]);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const messages = await fetchChatMessages(chatId);
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const unsubscribe = subscribeToChatMessages(chatId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // Scroll to the bottom
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId) {
      try {
        const response = await axios.post("/api/messages", {
          chatId,
          senderId: currentUserId,
          recipientId,
          content: newMessage,
        });

        if (response.status !== 200) {
          throw new Error("Failed to send message");
        }

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!recipientId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <IoChatbubblesOutline className="text-6xl text-gray-500 mb-4" />
        <h2 className="text-lg text-gray-500">
          Select a chat from the list to start messaging.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] max-w-lg mx-auto bg-white border rounded-lg shadow-lg">
      <div className="p-4 border-b bg-gray-100 text-gray-900 font-semibold">
        u/{recipient?.recipient_name}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg w-1/2 ${
                message.sender_id === currentUserId
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Ref for scrolling to the bottom */}
        </div>
      </div>
      <div className="p-4 border-t bg-gray-100 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

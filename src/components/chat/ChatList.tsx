"use client";

import { useEffect } from "react";
import { useChatStore } from "@/providers/chat-store-provider";
import { fetchChatList } from "@/lib/actions";

function ChatList() {
  const { chats, setChats, setRecipientId } = useChatStore((state) => state);

  useEffect(() => {
    async function loadChats() {
      try {
        const fetchedChats = await fetchChatList();
        console.log(fetchedChats);
        setChats(fetchedChats);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    }

    loadChats();
  }, [setChats]);

  const handleChatClick = (id: number) => {
    setRecipientId(id);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg h-full border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Chats</h2>
      <ul className="space-y-4">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li
              key={chat.id}
              className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div
                className="w-full px-4 py-3 text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300"
                onClick={() => handleChatClick(chat.recipient_id)}
              >
                {`u/${chat.recipient_name}`}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500 text-center">No chats available</li>
        )}
      </ul>
    </div>
  );
}

export default ChatList;

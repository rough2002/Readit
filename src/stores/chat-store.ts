import { createStore } from "zustand/vanilla";

export type Chat = {
  id: number;
  recipient_name: string;
  recipient_id: number;
};

export type ChatState = {
  recipientId: number | null;
  chats: Chat[];
};

export type ChatActions = {
  setRecipientId: (id: number) => void;
  setChats: (chats: Chat[]) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
  recipientId: null,
  chats: [],
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setRecipientId: (id) => set({ recipientId: id }),
    setChats: (chats) => set({ chats }),
  }));
};

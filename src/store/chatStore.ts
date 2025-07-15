import { create } from "zustand";
import { v4 as uuidv4 } from "uuid"; 

interface Message {
  id: string;
  content: string;
  timestamp: number;
  isUser: boolean; 
}

interface Chatroom {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatState {
  chatrooms: Chatroom[];
  currentChatroomId: string | null; 
  addChatroom: (name: string) => void;
  deleteChatroom: (id: string) => void;
  addMessage: (chatRoomId: string, content: string, isUser: boolean) => void;
  setCurrentChatroom: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatrooms: [],
  currentChatroomId: null, 

  addChatroom: (name) =>
    set((state) => ({
      chatrooms: [
        ...state.chatrooms,
        { id: uuidv4(), name, messages: [] }, 
      ],
    })),

  deleteChatroom: (id) =>
    set((state) => ({
      chatrooms: state.chatrooms.filter((room) => room.id !== id),
      currentChatroomId:
        state.currentChatroomId === id ? null : state.currentChatroomId,
    })),

  addMessage: (chatRoomId, content, isUser) =>
    set((state) => ({
      chatrooms: state.chatrooms.map((room) =>
        room.id === chatRoomId
          ? {
              ...room,
              messages: [
                ...room.messages,
                { id: uuidv4(), content, timestamp: Date.now(), isUser },
              ],
            }
          : room,
      ),
    })),

  setCurrentChatroom: (id) => set(() => ({ currentChatroomId: id })),
}));
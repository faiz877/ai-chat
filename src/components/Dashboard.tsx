// src/components/Dashboard.tsx
import React, { useState } from "react";
import { useChatStore } from "../store/chatStore";

const Dashboard: React.FC = () => {
  const { chatrooms, addChatroom, deleteChatroom, setCurrentChatroom } =
    useChatStore();
  const [newChatroomName, setNewChatroomName] = useState<string>("");

  const handleCreateChatroom = () => {
    if (newChatroomName.trim()) {
      addChatroom(newChatroomName.trim());
      setNewChatroomName("");
      // TODO: Show toast notification for chatroom created
    }
  };

  const handleDeleteChatroom = (id: string) => {
    deleteChatroom(id);
    // TODO: Show toast notification for chatroom deleted
  };

  const handleSelectChatroom = (id: string) => {
    setCurrentChatroom(id);
    // TODO: Navigate to the chatroom interface (ChatroomInterface component)
  };

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar for Chatroom List */}
      <div className='w-1/4 p-4 border-r border-gray-700'>
        <h2 className='text-2xl font-bold mb-4'>Conversations</h2>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='New chatroom name...'
            className='w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500'
            value={newChatroomName}
            onChange={(e) => setNewChatroomName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateChatroom();
              }
            }}
          />
          <button
            onClick={handleCreateChatroom}
            className='mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            + New Chatroom
          </button>
        </div>

        {/* Search Bar - placeholder for now */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search conversations...'
            className='w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500'
            // TODO: Implement debounced search filter here
          />
        </div>

        {/* List of Chatrooms */}
        <div className='space-y-2'>
          {chatrooms.length === 0 ? (
            <p className='text-gray-500'>No chatrooms yet. Create one!</p>
          ) : (
            chatrooms.map((room) => (
              <div
                key={room.id}
                className='flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer'
                onClick={() => handleSelectChatroom(room.id)}
              >
                <div>
                  <h3 className='font-semibold'>{room.name}</h3>
                  {/* TODO: Display last message and time, message count as per UI */}
                  <p className='text-sm text-gray-400'>
                    {room.messages.length > 0
                      ? room.messages[
                          room.messages.length - 1
                        ].content.substring(0, 30) + "..." // Display truncated last message
                      : "No messages"}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {room.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting chatroom when deleting
                    handleDeleteChatroom(room.id);
                  }}
                  className='text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-600'
                  aria-label={`Delete chatroom ${room.name}`}
                >
                  {/* Basic trash icon, replace with actual icon library later */}
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area - Initially empty or welcome message */}
      <div className='flex-1 p-4 flex items-center justify-center'>
        {/*
          TODO: This is where the ChatroomInterface component will be rendered
          based on `currentChatroomId`. You'll need to conditionally render it.
          For now, a simple message:
        */}
        <p className='text-gray-400 text-lg'>
          Select a chatroom or create a new one to start chatting.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

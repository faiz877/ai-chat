import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import ChatroomInterface from "./ChatroomInterface";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const Dashboard: React.FC = () => {
  const {
    chatrooms,
    addChatroom,
    deleteChatroom,
    setCurrentChatroom,
    currentChatroomId,
  } = useChatStore();
  const [newChatroomName, setNewChatroomName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const logout = useAuthStore((state) => state.logout);

  // Debounce search term logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredChatrooms = chatrooms.filter((room) =>
    room.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleCreateChatroom = () => {
    if (newChatroomName.trim()) {
      addChatroom(newChatroomName.trim());
      setNewChatroomName("");
      toast.success("Chatroom created!");
    } else {
      toast.error("Chatroom name cannot be empty.");
    }
  };

  const handleDeleteChatroom = (id: string) => {
    deleteChatroom(id);
    toast.success("Chatroom deleted!");
  };

  const handleSelectChatroom = (id: string) => {
    setCurrentChatroom(id);
  };

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar for Chatroom List */}
      <div className='w-1/4 p-4 border-r border-gray-700 flex flex-col'>
        {/* Header with Moon Icon - Global UX */}
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-extrabold'>Gemini</h1>
          {/* Logout button with icon in top right */}
          <button
            onClick={logout}
            className='text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500'
            aria-label='Logout'
            title='Logout'
          >
            {/* Logout icon (arrow right from a door) */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'
              />
            </svg>
          </button>
        </div>
        <h2 className='text-2xl font-bold mb-4'>Conversations</h2>
        <div className='mb-4 flex space-x-2'>
          <input
            type='text'
            placeholder='New chatroom name...'
            className='flex-grow p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white'
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
            className='flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150'
          >
            + New
          </button>
        </div>

        {/* Search Bar - Debounced */}
        <div className='mb-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search conversations...'
              className='w-full p-2 pl-10 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>

        {/* List of Chatrooms */}
        <div className='space-y-2 flex-grow overflow-y-auto'>
          {filteredChatrooms.length === 0 ? (
            <p className='text-gray-500'>No chatrooms found. Create one!</p>
          ) : (
            filteredChatrooms.map((room) => (
              <div
                key={room.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition duration-150 ${
                  currentChatroomId === room.id
                    ? "bg-gray-700"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => handleSelectChatroom(room.id)}
                role='button' // For accessibility
                tabIndex={0} // For keyboard accessibility
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSelectChatroom(room.id);
                  }
                }}
              >
                <div>
                  <h3 className='font-semibold'>{room.name}</h3>
                  <p className='text-sm text-gray-400'>
                    {room.messages.length > 0
                      ? room.messages[
                          room.messages.length - 1
                        ].content.substring(0, 30) +
                        (room.messages[room.messages.length - 1].content
                          .length > 30
                          ? "..."
                          : "")
                      : "No messages"}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {room.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatroom(room.id);
                  }}
                  className='text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-600 transition duration-150'
                  aria-label={`Delete chatroom ${room.name}`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area - Conditionally render ChatroomInterface */}
      <div className='flex-1'>
        {currentChatroomId ? (
          <ChatroomInterface />
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-400 text-lg'>
              Select a chatroom or create a new one to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

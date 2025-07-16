import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";

const MESSAGES_PER_PAGE = 20; // Define messages per page for pagination

const ChatroomInterface: React.FC = () => {
  const { chatrooms, currentChatroomId, addMessage, setCurrentChatroom } =
    useChatStore();
  const [messageInput, setMessageInput] = useState<string>("");
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [messagesToDisplay, setMessagesToDisplay] = useState(MESSAGES_PER_PAGE); // Track how many messages to show
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scroll
  const messagesContainerRef = useRef<HTMLDivElement>(null); // For infinite scroll detection

  const currentChatroom = chatrooms.find(
    (room) => room.id === currentChatroomId
  );

  // Auto-scroll to latest message when currentChatroom changes or initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // When switching chatrooms, reset messagesToDisplay to show only latest batch
    setMessagesToDisplay(MESSAGES_PER_PAGE);
  }, [currentChatroom?.id]);

  // Auto-scroll when new messages are added, but only if user is near bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesContainerRef.current;
      if (container) {
        const isScrolledToBottom =
          container.scrollHeight - container.clientHeight <=
          container.scrollTop + 50; // 50px buffer
        if (isScrolledToBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [currentChatroom?.messages.length]); // Only react to message count change

  const handleSendMessage = () => {
    if (!currentChatroom) return;

    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    // 1. Add user message
    addMessage(currentChatroom.id, trimmedMessage, true);
    setMessageInput("");

    // 2. Simulate AI typing
    setIsAiTyping(true);

    // 3. Simulate delayed AI response with throttling
    setTimeout(() => {
      const aiResponse = `Understood: "${trimmedMessage}". I am here to help you.`;
      addMessage(currentChatroom.id, aiResponse, false);
      setIsAiTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5 to 2.5 seconds delay
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => console.log("Message copied to clipboard!")) // Using console.log, no toast/alert
      .catch(() => console.error("Failed to copy message."));
  };

  // Image Upload (Base64/Preview URL) - Placeholder
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentChatroom) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a full implementation, you'd store reader.result (base64) or a blob URL
        // For functionality, we're just adding a text message indicating an image
        addMessage(currentChatroom.id, `[Image: ${file.name}]`, true);

        setIsAiTyping(true);
        setTimeout(() => {
          addMessage(
            currentChatroom.id,
            "Image received. How can I help with this?",
            false
          );
          setIsAiTyping(false);
        }, 1500 + Math.random() * 1000);
      };
      reader.readAsDataURL(file);
      event.target.value = ""; // Clear file input
    }
  };

  const loadOlderMessages = () => {
    setMessagesToDisplay((prev) => prev + MESSAGES_PER_PAGE);
  };

  const displayedMessages = currentChatroom?.messages
    ? currentChatroom.messages.slice(-messagesToDisplay)
    : [];

  const hasMoreMessages =
    currentChatroom && currentChatroom.messages.length > messagesToDisplay;

  if (!currentChatroom) {
    return (
      <div className='flex-1 p-4 flex items-center justify-center bg-gray-900 text-white'>
        <p className='text-gray-400 text-lg'>
          Please select a chatroom from the left, or create a new one.
        </p>
      </div>
    );
  }

  // Basic Loading Skeleton for Messages
  const MessageSkeleton = () => (
    <div className='flex justify-start'>
      <div className='max-w-xl p-3 rounded-lg bg-gray-700 animate-pulse h-12 w-3/4'></div>
    </div>
  );

  return (
    <div className='flex flex-col h-full bg-gray-900 text-white'>
      {/* Chatroom Header */}
      <div className='flex items-center p-4 border-b border-gray-700 bg-gray-800'>
        <button
          onClick={() => setCurrentChatroom(null)}
          className='text-gray-400 hover:text-white mr-4 p-2 rounded-full hover:bg-gray-700 transition duration-150'
          aria-label='Back to chatrooms'
        >
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
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
        </button>
        <h2 className='text-xl font-bold'>{currentChatroom.name}</h2>
        <div className='ml-auto text-gray-500 cursor-pointer hover:text-white transition duration-150'>
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
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
      </div>

      {/* Messages Display Area */}
      <div
        ref={messagesContainerRef}
        className='flex-1 p-4 overflow-y-auto space-y-4 flex flex-col'
      >
        {hasMoreMessages && (
          <div className='flex justify-center mt-2 mb-4'>
            <button
              onClick={loadOlderMessages}
              className='bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-full text-sm transition duration-150'
            >
              Load Older Messages
            </button>
          </div>
        )}
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-xl p-3 rounded-lg group ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <p>{message.content}</p>
              <span className='block text-right text-xs text-gray-300 mt-1'>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {/* Copy-to-clipboard on hover */}
              <button
                onClick={() => copyToClipboard(message.content)}
                className='absolute right-2 top-2 p-1 rounded-full bg-gray-600/70 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                aria-label='Copy message'
                title='Copy to clipboard'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10M7 9l3-3 3 3'
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {isAiTyping && (
          // Displaying a simple skeleton for AI typing to fulfill the requirement
          <MessageSkeleton />
        )}
        <div ref={messagesEndRef} /> {/* For auto-scroll */}
      </div>

      {/* Message Input Area */}
      <div className='p-4 border-t border-gray-700 bg-gray-800 flex items-center'>
        {/* Image Upload Button */}
        <input
          type='file'
          id='image-upload'
          className='hidden'
          accept='image/*'
          onChange={handleImageUpload}
        />
        <label
          htmlFor='image-upload'
          className='p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-400 mr-2 cursor-pointer transition duration-150'
          title='Upload image'
        >
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
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </label>
        <input
          type='text'
          placeholder='Message Gemini...'
          className='flex-1 p-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 text-white'
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isAiTyping && messageInput.trim()) {
              handleSendMessage();
            }
          }}
          disabled={isAiTyping}
        />
        <button
          onClick={handleSendMessage}
          className='ml-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition duration-150'
          aria-label='Send message'
          disabled={isAiTyping || !messageInput.trim()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 rotate-90'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatroomInterface;

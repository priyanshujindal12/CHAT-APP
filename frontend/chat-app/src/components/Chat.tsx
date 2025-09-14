import { useState } from 'react';

interface ChatProps {
  roomId: string;
  messages: string[];
  connectionStatus: string;
  onSendMessage: (message: string) => void;
  onLeaveRoom: () => void;
}

export default function Chat({ roomId, messages, connectionStatus, onSendMessage, onLeaveRoom }: ChatProps) {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Room: <span className="font-mono tracking-wider">{roomId}</span>
          </h1>
          <p className="text-sm text-gray-600">
            Status: <span className={connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus}
            </span>
          </p>
        </div>
        <button
          onClick={onLeaveRoom}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Leave Room
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to Room {roomId}!</h3>
              <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
              <p className="text-xs text-gray-400 mt-2">Share the room code <strong>{roomId}</strong> with others to invite them.</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex">
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs break-words">
                {message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || connectionStatus !== 'Connected'}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

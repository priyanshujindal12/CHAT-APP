import { useState } from 'react';

interface HomeProps {
  connectionStatus: string;
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  sendMessage: (type: string, payload: any) => void;
}

const generateRoomCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function Home({ connectionStatus, onJoinRoom, onCreateRoom, sendMessage }: HomeProps) {
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleCreateRoom = () => {
    const roomCode = generateRoomCode();
    
    sendMessage("createRoom", { roomId: roomCode });
    
    // Show the generated room code to user
    alert(`Room created! Your room code is: ${roomCode}\nShare this code with others to join.`);
    
    // Auto-join the created room
    setTimeout(() => {
      onJoinRoom(roomCode);
    }, 100);
  };

  const handleJoinRoom = () => {
    if (joinRoomId.trim()) {
      onJoinRoom(joinRoomId.trim().toUpperCase());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-semibold text-gray-800">Chat Rooms</h1>
        <p className="text-sm text-gray-600 mt-1">
          Status: <span className={connectionStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}>
            {connectionStatus}
          </span>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Join or Create Room</h2>
          
          <div className="space-y-6">
            {/* Create Room Section */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Create New Room</h3>
              <p className="text-sm text-gray-500 mb-4">Generate a 6-letter room code automatically</p>
              <button
                onClick={handleCreateRoom}
                disabled={connectionStatus !== 'Connected'}
                className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Create Room
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Join Existing Room</h3>
              <p className="text-sm text-gray-500 mb-4">Enter the 6-letter room code</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter room code (e.g., ABC123)"
                  maxLength={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-widest uppercase"
                />
                
                <button
                  onClick={handleJoinRoom}
                  disabled={!joinRoomId.trim() || connectionStatus !== 'Connected'}
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

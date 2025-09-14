
import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Chat from './components/Chat'
import { useWebSocket } from './hooks/useWebSocket'


function App() {  
  const [currentRoom, setCurrentRoom] = useState('');
  const [view, setView] = useState<'home' | 'chat'>('home');
  const { connectionStatus, messages, sendMessage, clearMessages } = useWebSocket("ws://localhost:8080");

  const handleCreateRoom = () => {
    // The Home component will handle room creation and auto-join
  };

  const handleJoinRoom = (roomId: string) => {
    sendMessage("join", { roomId });
    setCurrentRoom(roomId);
    setView('chat');
    clearMessages();
  };

  const handleSendMessage = (message: string) => {
    sendMessage("chat", { message });
  };

  const handleLeaveRoom = () => {
    setView('home');
    setCurrentRoom('');
    clearMessages();
  };

  if (view === 'home') {
    return (
      <Home
        connectionStatus={connectionStatus}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        sendMessage={sendMessage}
      />
    );
  }

  return (
    <Chat
      roomId={currentRoom}
      messages={messages}
      connectionStatus={connectionStatus}
      onSendMessage={handleSendMessage}
      onLeaveRoom={handleLeaveRoom}
    />
  );
}

export default App

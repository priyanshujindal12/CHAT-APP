import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('Connected');
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      setMessages(prev => [...prev, event.data]);
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('Disconnected from WebSocket');
    };

    ws.onerror = (error) => {
      setConnectionStatus('Error');
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = { type, payload };
      wsRef.current.send(JSON.stringify(message));
      console.log('Sent message:', message);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    connectionStatus,
    messages,
    sendMessage,
    clearMessages
  };
}

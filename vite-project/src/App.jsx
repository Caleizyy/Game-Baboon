import { io } from 'socket.io-client';
import { useEffect } from 'react';

const socket = io('http://localhost:3000');

function App() {
  useEffect(() => {
    socket.emit('join-room', 'test-room');
    
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return <div>Socket.IO is working!</div>;
}

export default App;
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  const joinRoom = () => {
    if (room) {
      socket.emit('join room', room);
      setJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { room, message });
      setMessage('');
    }
  };

  if (!joined) {
    return (
      <div>
        <h1>Join a Room</h1>
        <input 
          placeholder="Room code" 
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Room: {room}</h1>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          placeholder="Message" 
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            console.log(e.target.value)
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
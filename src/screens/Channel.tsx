import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';

const ChannelScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();

  const socket: Socket = io('localhost:8000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });

  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socket
      .on('connect', () => {
        socket.emit('auth', {
          channel: { id: channelId },
          user: { id: user?.id, nickname: user?.nickname },
        });
      })
      .on('confirm', () => {
        console.log('Connected');
      })
      .on('message', (message: Message) => {
        setMessages((messages) => [...messages, message]);
      });

    return () => {
      socket && socket.disconnect();
    };
  }, [channelId, socket, user?.id]);

  return (
    <div>
      <p>TYPE MESSAGE TO WIN GAME</p>
    </div>
  );
};

export default ChannelScreen;

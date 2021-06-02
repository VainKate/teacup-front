import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';
import { io, Socket } from 'socket.io-client';
import ChatInput from '../components/ChatInput';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import { AuthenticatedUser } from '../models/user.model';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    messageList: {
      height: '100%',
    },
    input: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
    },
  }),
);

type SocketAuthPacket = {
  channel: Pick<Channel, 'id'>;
  user: Pick<AuthenticatedUser, 'id' | 'nickname'>;
};

type Message = {
  id?: string;
  content: string;
} & SocketAuthPacket;

const ChannelScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();
  const classes = useStyles();

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
          channel: { id: parseInt(channelId) },
          user: { id: user?.id, nickname: user?.nickname },
        } as SocketAuthPacket);
      })
      .on('confirm', () => {
        console.log('Connected');
      })
      .on('user:join', ({ channel, user }: SocketAuthPacket) => {
        console.log('an user has joined the room: ', { channel, user });
      })
      .on('message', (message: Message) => {
        setMessages((messages) => [...messages, message]);
      });

    return () => {
      socket && socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const sendMessage = (message: string) => {
    socket.emit('message', {
      user: {
        id: user?.id,
        nickname: user?.nickname,
      },
      channel: {
        id: parseInt(channelId),
      },
      content: message,
    } as Message);
  };

  return (
    <div>
      <div className={classes.messageList}>
        {messages.map((message) => (
          <p>{message.content}</p>
        ))}
      </div>
      <Box position="fixed" bottom="0" width="100%">
        <ChatInput sendMessage={sendMessage} />
      </Box>
    </div>
  );
};

export default ChannelScreen;

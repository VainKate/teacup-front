import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/auth';
import { io, Socket } from 'socket.io-client';
import ChatInput from './ChatInput';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import { Message, SocketAuthPacket } from '../../types';
import MessageItem from './MessageItem';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    messageList: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      maxHeight: 'calc(100vh - 117px)',
    },
    input: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
    },
  }),
);

const ChannelScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();
  const classes = useStyles();

  const socket: Socket = useMemo(
    () =>
      io('localhost:8000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      }),
    [],
  );

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
  }, [channelId, socket, user?.id, user?.nickname]);

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
    <div className={classes.root}>
      <div className={classes.messageList}>
        {messages.map((message) => (
          <MessageItem
            message={message}
            key={message.id}
            isForeign={message.user.id !== user?.id}
          />
        ))}
      </div>
      <Box position="fixed" bottom="0" width="100%">
        <ChatInput sendMessage={sendMessage} />
      </Box>
    </div>
  );
};

export default ChannelScreen;

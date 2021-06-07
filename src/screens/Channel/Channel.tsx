import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/auth';
import { io, Socket } from 'socket.io-client';
import ChatInput from './ChatInput';
import {
  Box,
  createStyles,
  Drawer,
  Hidden,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Channel, Message, SocketAuthPacket } from '../../types';
import MessageItem from './MessageItem';
import axios from 'axios';
import ChannelNav from './ChannelNav';
import ChannelDrawer from './ChannelDrawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        width: `calc(100vw - ${drawerWidth}px)`,
      },
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
      [theme.breakpoints.up('sm')]: {
        width: `calc(100vw - ${drawerWidth + 1}px)`,
      },
    },
    content: {
      flexGrow: 1,
    },
    drawerPaper: {
      [theme.breakpoints.up('sm')]: {
        paddingTop: '60px',
      },
      width: drawerWidth,
    },
  }),
);

const ChannelScreen: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setConnected] = useState(false);

  const getChannel = useCallback(async () => {
    let channelResponse = await axios.get<Channel>(
      `http://localhost:8000/v1/channel/${channelId}`,
      {
        withCredentials: true,
      },
    );

    if (channelResponse.data) {
      setChannel(channelResponse.data);
    }
  }, [channelId]);

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
        getChannel();
        setConnected(true);
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
  }, [channelId, getChannel, socket, user?.id, user?.nickname]);

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

  if (isConnected && channel) {
    return (
      <>
        <ChannelNav channel={channel} />
        <div className={classes.root}>
          <main className={classes.content}>
            <div className={classes.messageList}>
              {messages.map((message) => (
                <MessageItem
                  message={message}
                  key={message.id}
                  isForeign={message.user.id !== user?.id}
                />
              ))}
            </div>
            <Box className={classes.input}>
              <ChatInput sendMessage={sendMessage} />
            </Box>
          </main>
          <nav>
            <Hidden xsDown implementation="css">
              <Drawer
                variant="persistent"
                anchor="right"
                open
                classes={{ paper: classes.drawerPaper }}
              >
                <ChannelDrawer channel={channel} />
              </Drawer>
            </Hidden>
          </nav>
        </div>
      </>
    );
  }

  return null;
};

export default ChannelScreen;

import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/auth';
import { io, Socket } from 'socket.io-client';
import ChatInput from './ChatInput';
import {
  Box,
  CircularProgress,
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

const navDrawerWidth = 240;
const channelDrawerWidth = 290;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100vw',
      [theme.breakpoints.up('sm')]: {
        marginLeft: `${navDrawerWidth}px`,
        width: `calc(100vw - ${navDrawerWidth}px)`,
      },
    },
    messages: {
      display: 'flex',
      alignItems: 'flex-end',
      height: 'calc(100vh - 117px - 0.15em)',
    },
    messageList: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      maxHeight: 'calc(100vh - 117px - 2.2em)',
      padding: '1em 0',
      width: '100vw',
      [theme.breakpoints.up('sm')]: {
        width: `calc(100vw - ${navDrawerWidth}px)`,
      },
      [theme.breakpoints.up('md')]: {
        width: `calc(100vw - ${navDrawerWidth + channelDrawerWidth}px)`,
      },
    },
    input: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: `calc(100vw - ${navDrawerWidth + 1}px)`,
        marginLeft: '1px',
      },
      [theme.breakpoints.up('md')]: {
        width: `calc(100vw - ${navDrawerWidth + channelDrawerWidth + 2}px)`,
        marginLeft: '1px',
      },
    },
    drawerPaper: {
      [theme.breakpoints.up('sm')]: {
        paddingTop: '60px',
      },
      width: channelDrawerWidth,
    },
  }),
);

const ChannelScreen: React.FC = () => {
  const classes = useStyles();
  const { user, login } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();

  const socket = useRef<Socket>();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);

  const messagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setConnected(false);

    socket.current = io(`${process.env.REACT_APP_API_URL}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
    });
  }, [channelId]);

  useEffect(() => {
    const getChannel = async () => {
      let channelResponse = await axios.get<Channel>(
        `${process.env.REACT_APP_API_URL}/v1/channel/${channelId}`,
        {
          withCredentials: true,
        },
      );

      if (channelResponse.data) {
        setChannel(channelResponse.data);

        // Add channel to list of joined channels
        if (
          user?.channels.findIndex(
            (joinedChannel) => joinedChannel.id === parseInt(channelId),
          ) === -1
        ) {
          user.channels.push(channelResponse.data);
          login(user);
        }
      }
    };

    isConnected && getChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const onUserJoin = (user: SocketAuthPacket['user']) => {
    if (!channel) {
      return;
    }

    const userIndex = channel.users!.findIndex(
      (channelUser) => channelUser.id === user.id,
    );

    if (userIndex === -1) {
      channel.users?.push({ ...user, isLogged: true });
    } else {
      channel.users![userIndex].isLogged = true;
    }

    setChannel(channel);
  };

  const onUserLeave = (user: SocketAuthPacket['user']) => {
    if (!channel) {
      return;
    }

    const userIndex = channel.users!.findIndex(
      (channelUser) => channelUser.id === user.id,
    );

    if (userIndex === -1) {
      return;
    }

    channel.users![userIndex].isLogged = false;

    setChannel(channel);
  };

  useEffect(() => {
    socket &&
      socket.current &&
      socket.current
        .on('connect', () => {
          socket.current!.emit('auth', {
            channel: { id: parseInt(channelId) },
            user: { id: user?.id, nickname: user?.nickname },
          } as SocketAuthPacket);
        })
        .on('confirm', () => {
          setConnected(true);
        })
        .on('user:join', ({ user }: SocketAuthPacket) => {
          onUserJoin(user);
        })
        .on('user:leave', ({ user }: SocketAuthPacket) => {
          onUserLeave(user);
        })
        .on('message', (message: Message) => {
          if (message.content) {
            setMessages((messages) => [...messages, message]);

            messagesRef.current?.scrollTo({
              top: messagesRef.current?.scrollHeight,
              behavior: 'smooth',
            });
          }
        });

    return () => {
      socket && socket.current!.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, socket, user?.id, user?.nickname]);

  const sendMessage = (message: string) => {
    socket.current!.emit('message', {
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
      {channel && <ChannelNav channel={channel} />}
      <div className={classes.root}>
        {!isConnected ? (
          <CircularProgress />
        ) : (
          <>
            <div className={classes.messages}>
              <div className={classes.messageList} ref={messagesRef}>
                {messages.map((message) => (
                  <MessageItem
                    message={message}
                    key={message.id}
                    isForeign={message.user.id !== user?.id}
                  />
                ))}
              </div>
            </div>
            <Box className={classes.input}>
              <ChatInput sendMessage={sendMessage} />
            </Box>
          </>
        )}
      </div>
      <Hidden smDown implementation="css">
        <Drawer
          variant="persistent"
          anchor="right"
          open
          classes={{ paper: classes.drawerPaper }}
        >
          {channel && <ChannelDrawer channel={channel} />}
        </Drawer>
      </Hidden>
    </div>
  );
};

export default ChannelScreen;

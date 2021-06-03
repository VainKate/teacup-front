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
  IconButton,
  makeStyles,
  SwipeableDrawer,
  Theme,
} from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import { Channel, Message, SocketAuthPacket } from '../../types';
import MessageItem from './MessageItem';
import UserList from './UserList';
import axios from 'axios';
import ChannelDrawer from './ChannelDrawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
    },
  }),
);

const ChannelScreen: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { channelId } = useParams<{ channelId: string }>();

  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const handleDrawerTogle = () => setMobileDrawerOpen(!isMobileDrawerOpen);

  const [channel, setChannel] = useState<Channel | null>(null);

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

  return (
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
        <Box
          position="fixed"
          bottom="0"
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <ChatInput sendMessage={sendMessage} />
          <Hidden smUp>
            <IconButton color="inherit" edge="end" onClick={handleDrawerTogle}>
              <GroupIcon />
            </IconButton>
          </Hidden>
        </Box>
      </main>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            anchor="right"
            open={isMobileDrawerOpen}
            onOpen={handleDrawerTogle}
            onClose={handleDrawerTogle}
            ModalProps={{ keepMounted: true }}
            classes={{ paper: classes.drawerPaper }}
          >
            {channel && <ChannelDrawer channel={channel} />}
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            variant="persistent"
            anchor="right"
            open
            classes={{ paper: classes.drawerPaper }}
          >
            {channel && <ChannelDrawer channel={channel} />}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default ChannelScreen;

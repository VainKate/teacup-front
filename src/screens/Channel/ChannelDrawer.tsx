import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Channel } from '../../types';
import UserItem from './UserItem';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      padding: '15px 20px',
      backgroundColor: '#454545',
      color: 'white',
    },
    userState: {
      fontWeight: 600,
      marginBottom: '0.5rem',
    },
  }),
);

const ChannelDrawer: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();

  const [onlineUsers, setOnlineUsers] = useState<Channel['users']>([]);
  const [offlineUsers, setOfflineUsers] = useState<Channel['users']>([]);

  useEffect(() => {
    if (channel.users && channel.users.length > 0) {
      setOnlineUsers(channel.users?.filter((user) => user.isLogged));
      setOfflineUsers(channel.users?.filter((user) => !user.isLogged));
    }
  }, [channel.users]);

  return (
    <Box>
      <Box className={classes.title}>
        <Typography variant="h5"># {channel.title}</Typography>
        <Typography component="span">
          {channel.usersCount ?? channel.users?.length} utilisateurs
        </Typography>
      </Box>
      <Box paddingX="20px">
        {onlineUsers && (
          <>
            <Box paddingY="15px">
              <Typography className={classes.userState}>
                En ligne - {onlineUsers.length}
              </Typography>
              {onlineUsers.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </Box>
          </>
        )}
        {offlineUsers && (
          <>
            <Box paddingY="15px">
              <Typography className={classes.userState}>
                Hors ligne - {offlineUsers.length}
              </Typography>
              {offlineUsers!.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChannelDrawer;

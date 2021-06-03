import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';
import { Channel } from '../../types';
import UserList from './UserList';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      padding: '15px',
      backgroundColor: '#454545',
      color: 'white',
    },
  }),
);

const ChannelDrawer: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.title}>
        <Typography variant="h5"># {channel.title}</Typography>
        <Typography component="span">
          {channel.usersCount ?? channel.users?.length} utilisateurs
        </Typography>
      </Box>
      <Box paddingX="10px">
        <UserList users={channel.users} />
      </Box>
    </Box>
  );
};

export default ChannelDrawer;

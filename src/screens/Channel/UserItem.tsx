import {
  makeStyles,
  createStyles,
  Box,
  Avatar,
  withStyles,
  Badge,
  Typography,
  Theme,
} from '@material-ui/core';
import { ChannelUser } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    isOnline: {
      fontWeight: 600,
    },
    nickname: {
      marginLeft: '10px',
    },
  }),
);

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
        content: '"',
      },
    },
  }),
)(Badge);

const UserItem: React.FC<{ user: ChannelUser }> = ({ user }) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" paddingY="5px">
      {user.isLogged ? (
        <StyledBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant="dot"
        >
          <Avatar>{user.nickname.slice(0, 1)}</Avatar>
        </StyledBadge>
      ) : (
        <Avatar>{user.nickname.slice(0, 1)}</Avatar>
      )}
      <Typography component="p" className={classes.nickname}>
        {user.nickname}
      </Typography>
    </Box>
  );
};

export default UserItem;

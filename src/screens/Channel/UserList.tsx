import { makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
import { AuthenticatedUser, Channel } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    isOnline: {
      fontWeight: 600,
    },
  }),
);

const UserList: React.FC<{ users: Channel['users'] }> = ({ users }) => {
  const classes = useStyles();

  return (
    <>
      {users?.map((user) => (
        <div>
          <p className={user.isLogged ? classes.isOnline : ''}>
            {user.nickname}
          </p>
        </div>
      ))}
    </>
  );
};

export default UserList;

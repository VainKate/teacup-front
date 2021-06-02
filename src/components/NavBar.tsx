import {
  AppBar,
  Button,
  createStyles,
  Dialog,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

const NavBar: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const openAuthDialog = () => setAuthDialogOpen(true);
  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton}>
            <MenuIcon
              onClick={() => {
                alert('clicked');
              }}
            />
          </IconButton>
          <Link
            to="/"
            style={{ textDecoration: 'none' }}
            className={classes.title}
          >
            <Typography variant="h1">TeaCup</Typography>
          </Link>
          {!user && (
            <>
              <Button color="inherit" onClick={openAuthDialog}>
                Login
              </Button>
              <Dialog open={isAuthDialogOpen} onClose={handleAuthDialogClose}>
                <LoginForm />
              </Dialog>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;

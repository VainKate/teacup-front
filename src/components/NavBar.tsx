import {
  AppBar,
  Button,
  createStyles,
  Dialog,
  Drawer,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import DrawerContent from './DrawerContent';
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
    drawer: {
      width: 240,
      [theme.breakpoints.up('sm')]: {
        width: 240,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: 240,
    },
  }),
);

const NavBar: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);

  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const openAuthDialog = () => setAuthDialogOpen(true);
  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  return (
    <AppBar position="sticky">
      <div className={classes.root}>
        <Toolbar>
          {user && (
            <>
              <IconButton
                edge="start"
                className={classes.menuButton}
                onClick={toggleDrawer(true)}
                onKeyDown={toggleDrawer(false)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                open={isDrawerOpen}
                variant="temporary"
                anchor={'left'}
                onClose={toggleDrawer(false)}
                classes={{ paper: classes.drawerPaper }}
              >
                <DrawerContent />
              </Drawer>
            </>
          )}
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
      </div>
    </AppBar>
  );
};

export default NavBar;

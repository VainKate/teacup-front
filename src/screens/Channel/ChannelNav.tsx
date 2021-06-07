import {
  AppBar,
  createStyles,
  Drawer,
  Hidden,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useContext, useState } from 'react';
import { Channel } from '../../types';
import ChannelDrawer from './ChannelDrawer';
import GroupIcon from '@material-ui/icons/Group';
import { AuthContext } from '../../context/auth';
import DrawerContent from '../../components/DrawerContent';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: drawerWidth,
      [theme.breakpoints.up('sm')]: {
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
  }),
);

const ChannelNav: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const handleDrawerTogle = () => setMobileDrawerOpen(!isMobileDrawerOpen);
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
    <AppBar position="sticky" className={classes.appBar}>
      <div className={classes.root}>
        <Toolbar>
          {user && (
            <Hidden smUp>
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
            </Hidden>
          )}
          <Typography># {channel.title}</Typography>
          <Hidden smUp>
            <IconButton color="inherit" edge="end" onClick={handleDrawerTogle}>
              <GroupIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
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
        </nav>
      </div>
    </AppBar>
  );
};

export default ChannelNav;

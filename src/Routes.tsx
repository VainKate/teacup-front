import {
  Box,
  createStyles,
  Drawer,
  Hidden,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DrawerContent from './components/DrawerContent';
import { AuthContext } from './context/auth';
import PrivateRoute from './routes/PrivateRoute';
import ChannelScreen from './screens/Channel/Channel';
import DiscoverScreen from './screens/Discover';
import HomeScreen from './screens/Home';
import LandingScreen from './screens/Landing';
import ProfileScreen from './screens/Profile/Profile';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      [theme.breakpoints.up('sm')]: {
        paddingTop: '60px',
      },
      width: drawerWidth,
    },
  }),
);

const Routes = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);
  return (
    <>
      {/* {user && !location.pathname.includes('channel') && <NavBar />} */}
      <Switch>
        {user ? (
          <Route>
            <Box>
              <Hidden xsDown implementation="css">
                <Drawer
                  variant="persistent"
                  anchor="left"
                  open
                  classes={{ paper: classes.drawerPaper }}
                >
                  <DrawerContent />
                </Drawer>
              </Hidden>
              <Switch>
                <PrivateRoute path="/channel/:channelId">
                  <ChannelScreen />
                </PrivateRoute>
                <PrivateRoute path="/discover">
                  <DiscoverScreen />
                </PrivateRoute>
                <PrivateRoute path="/profile">
                  <ProfileScreen />
                </PrivateRoute>
                <PrivateRoute path="/">
                  <HomeScreen />
                </PrivateRoute>
              </Switch>
            </Box>
          </Route>
        ) : (
          <Route path="/">
            <LandingScreen />
          </Route>
        )}
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default Routes;

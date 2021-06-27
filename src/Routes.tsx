import {
  Box,
  createStyles,
  Drawer,
  Hidden,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useContext } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import DrawerContent from './components/DrawerContent';
import { AuthContext } from './context/auth';
import PrivateRoute from './routes/PrivateRoute';
import ChannelScreen from './screens/Channel/Channel';
import DiscoverScreen from './screens/Discover';
import HomeScreen from './screens/Home';
import LandingScreen from './screens/Landing';

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
    <Router>
      <Switch>
        {user ? (
          <Route>
            <Box display="flex" flex="1">
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
    </Router>
  );
};

export default Routes;

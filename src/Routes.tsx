import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import ChannelScreen from './screens/Channel/Channel';
import DiscoverScreen from './screens/Discover';
import HomeScreen from './screens/Home';
import LandingScreen from './screens/Landing';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path="/channel/:channelId">
          <ChannelScreen />
        </PrivateRoute>
        <PrivateRoute path="/home">
          <HomeScreen />
        </PrivateRoute>
        <PrivateRoute path="/discover">
          <DiscoverScreen />
        </PrivateRoute>
        <Route path="/">
          <LandingScreen />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;

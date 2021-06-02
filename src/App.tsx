import './App.css';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { AuthProvider } from './context/auth';
import LandingScreen from './screens/Landing';
import PrivateRoute from './routes/PrivateRoute';
import HomeScreen from './screens/Home';
import DiscoverScreen from './screens/Discover';
import ChannelScreen from './screens/Channel';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
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
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

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

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
            <Switch>
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

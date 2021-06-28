import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { AuthProvider } from './context/auth';
import Routes from './Routes';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Routes />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

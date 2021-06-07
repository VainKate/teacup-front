import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { AuthProvider } from './context/auth';
import Routes from './Routes';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Routes />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

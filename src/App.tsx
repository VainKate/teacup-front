import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

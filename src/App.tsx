import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/navBar';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Router>
      <NavBar />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;

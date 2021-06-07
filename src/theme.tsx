import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#f7be2e',
    },
    info: {
      main: '#FDF6EA',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: '"Quicksand"',
    h1: {
      fontWeight: 700,
      fontSize: '24px',
      color: '#FFFFFF',
    },
    h4: {
      fontWeight: 600,
    },
  },
});

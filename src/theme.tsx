import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#381280',
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
      color: '#DBB46A',
    },
    h4: {
      fontWeight: 600,
    },
  },
});

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FDF6EA',
    },
    info: {
      main: '#FDF6EA',
    },
    text: {
      primary: '#DBB46A',
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
      fontSize: '18px',
    },
  },
});

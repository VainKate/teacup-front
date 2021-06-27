import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      maxHeight: '100vh',
      minWidth: '100vw',
    },
  }),
);

const SplashScreen: React.FC = () => {
  const classes = useStyles();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <Typography variant="h2">Loading...</Typography>
    </Box>
  );
};

export default SplashScreen;

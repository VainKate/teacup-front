import {
  Box,
  Button,
  createStyles,
  Dialog,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      maxHeight: '100vh',
      minWidth: '100vw',
    },
  }),
);

const LandingScreen: React.FC = () => {
  const classes = useStyles();

  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const openAuthDialog = () => setAuthDialogOpen(true);
  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <section>
        <Typography variant="h2">TeaCup</Typography>
        <div>
          <h1>Come chat with us!</h1>
          <p>
            Envie de discuter de ta série du moment, de films d'horreur ou de ta
            passion pour la cuisine ?
          </p>
          <p>
            Rejoins-nous sur les salons de ton choix et viens échanger avec
            d'autres passionnés !
          </p>
        </div>
        <div>
          <Button variant="contained" color="inherit" onClick={openAuthDialog}>
            Login
          </Button>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={isAuthDialogOpen}
            onClose={handleAuthDialogClose}
          >
            <LoginForm />
          </Dialog>
        </div>
      </section>
    </Box>
  );
};

export default LandingScreen;

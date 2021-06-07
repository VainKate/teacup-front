import { Button, Dialog, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import LoginForm from '../components/LoginForm';
import { AuthContext } from '../context/auth';

const LandingScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  if (user) {
    history.replace('/home');
  }

  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const openAuthDialog = () => setAuthDialogOpen(true);
  const handleAuthDialogClose = () => setAuthDialogOpen(false);

  return (
    <section>
      <Typography variant="h1">TeaCup</Typography>
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
        <Dialog open={isAuthDialogOpen} onClose={handleAuthDialogClose}>
          <LoginForm />
        </Dialog>
      </div>
    </section>
  );
};

export default LandingScreen;

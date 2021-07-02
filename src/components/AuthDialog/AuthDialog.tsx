import {
  Box,
  createStyles,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../context/auth';
import { AuthenticatedUser, Channel } from '../../types';
import LoginForm from './LoginForm';
import ResetForm from './ResetForm';
import SignupForm from './SignupForm';

const useStyles = makeStyles(() =>
  createStyles({
    formTitle: {
      paddingBottom: '0',
    },
  }),
);

const AuthDialog: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [context, setContext] = useState<'login' | 'signup' | 'reset'>('login');

  const { login } = useContext(AuthContext);

  const onLogin = async (data: { email: string; password: string }) => {
    try {
      const loginResponse = await axios.post<AuthenticatedUser>(
        `${process.env.REACT_APP_API_URL}/v1/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true },
      );

      if (loginResponse.data) {
        const userChannels = await axios.get<Array<Channel>>(
          `${process.env.REACT_APP_API_URL}/v1/me/channels`,
          { withCredentials: true },
        );
        login({
          ...loginResponse.data,
          channels: userChannels.data,
        });
        history.replace('/');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Box paddingBottom="10px" textAlign="center">
      <DialogTitle className={classes.formTitle}>
        {context === 'signup' ? (
          <>
            Bienvenue !
            <DialogContentText>
              On prépare de nouvelles théières !
            </DialogContentText>
          </>
        ) : context === 'login' ? (
          <>
            Bon retour !
            <DialogContentText>Tes infusions sont prêtes !</DialogContentText>
          </>
        ) : (
          <>
            Ah mince !
            <DialogContentText>
              Donne nous l'adresse mail de ton compte, on s'occupe du reste !
            </DialogContentText>
          </>
        )}
      </DialogTitle>
      {context === 'login' && (
        <LoginForm setContext={setContext} onLogin={onLogin} />
      )}
      {context === 'signup' && (
        <SignupForm setContext={setContext} onLogin={onLogin} />
      )}
      {context === 'reset' && <ResetForm setContext={setContext} />}
    </Box>
  );
};

export default AuthDialog;

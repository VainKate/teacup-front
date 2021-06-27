import { DialogContentText } from '@material-ui/core';
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/auth';
import { AuthenticatedUser, Channel } from '../types';

const LoginForm: React.FC = () => {
  const history = useHistory();
  const [context, setContext] = useState<'login' | 'signup'>('login');

  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState } =
    useForm<{ email: string; nickname: string; password: string }>();

  const onSignup = async (data: {
    email: string;
    nickname: string;
    password: string;
  }) => {
    await axios.post<AuthenticatedUser>(
      `${process.env.REACT_APP_API_URL}/v1/signup`,
      {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
      },
      {
        withCredentials: true,
      },
    );
  };

  const onLogin = async (data: { email: string; password: string }) => {
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
  };

  const onSubmit = handleSubmit(async (data) => {
    if (context === 'signup') {
      await onSignup(data);
    }
    onLogin(data);
  });

  return (
    <Box paddingBottom="10px">
      <DialogTitle>
        {context === 'login' ? 'Bon retour !' : 'Bienvenue !'}
        <DialogContentText>
          {context === 'login'
            ? 'Tes infusions sont prêtes !'
            : 'On prépare de nouvelles théières !'}
        </DialogContentText>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            {context === 'signup' && (
              <TextField
                label="Pseudo"
                margin="dense"
                type="text"
                {...register('nickname', { required: context === 'signup' })}
              />
            )}
            <TextField
              label="Adresse mail"
              margin="dense"
              type="email"
              {...register('email', { required: true })}
            />
            <TextField
              label="Mot de passe"
              margin="dense"
              type="password"
              {...register('password', { required: true })}
            />
          </Box>
        </DialogContent>
        <DialogContent>
          <Button
            variant="contained"
            color="primary"
            size="large"
            name="login"
            id="login"
            type="submit"
            disabled={formState.isSubmitting}
          >
            {context === 'login' ? 'Se connecter' : 'Continuer'}
          </Button>
          {context === 'login' ? (
            <Button size="small" onClick={() => setContext('signup')}>
              Besoin d'un compte ?
            </Button>
          ) : (
            <Button size="small" onClick={() => setContext('login')}>
              Déjà un compte ?
            </Button>
          )}
        </DialogContent>
      </form>
    </Box>
  );
};

export default LoginForm;

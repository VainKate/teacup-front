import {
  Box,
  Button,
  createStyles,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
  Theme,
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/auth';
import { AuthenticatedUser, Channel } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1.5em 0 1em',
      flexWrap: 'wrap',
      [theme.breakpoints.up('sm')]: {
        flexWrap: 'no-wrap',
      },
    },

    formTitle: {
      paddingBottom: '0',
    },

    button: {
      marginTop: '1em',
      [theme.breakpoints.up('sm')]: {
        marginTop: 'none',
      },
    },
  }),
);

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [context, setContext] = useState<'login' | 'signup' | 'reset'>('login');

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

  const onReset = async (data: { email: string }) => {
    const resetResponse = await axios.post<AuthenticatedUser>(
      `${process.env.REACT_APP_API_URL}/v1/forgot-pwd`,
      {
        email: data.email,
      },
      { withCredentials: true },
    );

    if (resetResponse.data) {
      // console.log(resetResponse.data);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (context === 'reset') {
      return onReset(data);
    }
    if (context === 'signup') {
      await onSignup(data);
    }
    onLogin(data);
  });

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
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            {context === 'signup' && (
              <TextField
                label="Pseudo"
                margin="dense"
                type="text"
                required={true}
                {...register('nickname', { required: context === 'signup' })}
              />
            )}
            <TextField
              label="Adresse mail"
              margin="dense"
              type="email"
              required={true}
              {...register('email', { required: true })}
            />
            {(context === 'signup' || context === 'login') && (
              <TextField
                label="Mot de passe"
                margin="dense"
                type="password"
                required={true}
                {...register('password', { required: true })}
              />
            )}
          </Box>
        </DialogContent>
        <DialogContent className={classes.buttonsContainer}>
          {context === 'login' || context === 'reset' ? (
            <>
              <Button
                className={classes.button}
                size="small"
                onClick={() => setContext('signup')}
              >
                Besoin d'un compte ?
              </Button>

              {context === 'login' && (
                <Button
                  className={classes.button}
                  size="small"
                  onClick={() => setContext('reset')}
                >
                  Mot de passe oublié ?
                </Button>
              )}
            </>
          ) : (
            <Button
              className={classes.button}
              size="small"
              onClick={() => setContext('login')}
            >
              Déjà un compte ?
            </Button>
          )}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            name="login"
            id="login"
            type="submit"
            disabled={formState.isSubmitting}
          >
            {context === 'login'
              ? 'Se connecter'
              : context === 'signup'
              ? 'Continuer'
              : 'Envoyer'}
          </Button>
        </DialogContent>
      </form>
    </Box>
  );
};

export default LoginForm;

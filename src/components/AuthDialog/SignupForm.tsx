import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  makeStyles,
  Theme,
} from '@material-ui/core';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { AuthenticatedUser } from '../../types';

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
    button: {
      marginTop: '1em',
      [theme.breakpoints.up('sm')]: {
        marginTop: 'none',
      },
    },
  }),
);

const SignupForm: React.FC<{
  setContext: (context: 'signup' | 'login') => void;
  onLogin: (data: { email: string; password: string }) => void;
}> = ({ setContext, onLogin }) => {
  const classes = useStyles();

  const { handleSubmit, formState, control, getValues, setError } = useForm<{
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
  }>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(
    async (data: { email: string; nickname: string; password: string }) => {
      try {
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

        onLogin(data);
      } catch (error) {
        if (
          error.response.data.message ===
          'Validation error: The mail address is invalid or already in use'
        ) {
          setError('email', {});
          setError('nickname', {});
        }
      }
    },
  );

  return (
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <Controller
            name="nickname"
            control={control}
            defaultValue=""
            rules={{
              required: "Le choix d'un pseudo est obligatoire.",
              validate: (value) => value.replaceAll(' ', '').length !== 0,
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                label="Pseudo"
                margin="dense"
                type="text"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Une adresse mail est obligatoire.',
              validate: (value) => new RegExp(/\S+@\S+\.\S+/).test(value) || '',
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                label="Adresse mail"
                margin="dense"
                type="email"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: 'La choix du mot de passe est obligatoire.',
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                label="Mot de passe"
                margin="dense"
                type="password"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'La confirmation du mot de passe est obligatoire.',
              validate: (value) => getValues('password') === value,
            }}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => (
              <TextField
                label="Confirmation du mot de passe"
                margin="dense"
                type="password"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogContent className={classes.buttonsContainer}>
        <Button
          className={classes.button}
          size="small"
          onClick={() => setContext('login')}
        >
          Déjà un compte ?
        </Button>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={formState.isSubmitting}
        >
          Continuer
        </Button>
      </DialogContent>
    </form>
  );
};

export default SignupForm;

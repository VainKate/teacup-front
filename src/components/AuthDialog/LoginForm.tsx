import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

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

const LoginForm: React.FC<{
  setContext: (context: 'signup' | 'reset') => void;
  onLogin: (data: { email: string; password: string }) => void;
}> = ({ setContext, onLogin }) => {
  const classes = useStyles();

  const { handleSubmit, formState, control, setError } = useForm<{
    email: string;
    password: string;
  }>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = handleSubmit(
    async (data: { email: string; password: string }) => {
      try {
        onLogin(data);
      } catch (error) {
        if (error.response.data.message === 'Your credentials are invalid.') {
          setError('email', {});
          setError('password', {});
        }
      }
    },
  );

  return (
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Box display="flex" flexDirection="column">
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
              required: 'La confirmation du mot de passe est obligatoire.',
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
        </Box>
      </DialogContent>
      <DialogContent className={classes.buttonsContainer}>
        <Button
          className={classes.button}
          size="small"
          onClick={() => setContext('reset')}
        >
          Mot de passe oublié ?
        </Button>
        <Button
          className={classes.button}
          size="small"
          onClick={() => setContext('signup')}
        >
          Besoin d'un compte ?
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={formState.isSubmitting}
        >
          Se connecter
        </Button>
      </DialogContent>
    </form>
  );
};

export default LoginForm;

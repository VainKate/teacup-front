import {
  Box,
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import EmailInput from '../EmailInput';
import PasswordInput from '../PasswordInput';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      flexDirection: 'column',
      padding: '1.5em 1em 1em',
      flexWrap: 'wrap',
      [theme.breakpoints.up('sm')]: {
        flexWrap: 'no-wrap',
        flexDirection: 'row',
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
  onLogin: (data: { email: string; password: string }) => Promise<void>;
}> = ({ setContext, onLogin }) => {
  const classes = useStyles();

  const { handleSubmit, formState, control, setError } = useForm({
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(
    async (data: { email: string; password: string }) => {
      try {
        await onLogin(data);
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
          <EmailInput control={control} name="email" defaultValue="" />
          <PasswordInput control={control} name="password" defaultValue="" />
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

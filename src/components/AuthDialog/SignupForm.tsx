import {
  Box,
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
} from '@material-ui/core';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { AuthenticatedUser } from '../../types';
import EmailInput from '../EmailInput';
import NicknameInput from '../NicknameInput';
import PasswordInput from '../PasswordInput';

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

  const { handleSubmit, formState, control, getValues, setError } = useForm({
    mode: 'onChange',
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
          <NicknameInput control={control} name="nickname" defaultValue="" />
          <EmailInput control={control} name="email" defaultValue="" />
          <PasswordInput
            control={control}
            name="password"
            defaultValue=""
            getValues={getValues}
          />
          <PasswordInput
            control={control}
            name="confirmPassword"
            defaultValue=""
            getValues={getValues}
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

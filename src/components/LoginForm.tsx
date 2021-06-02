import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import axios from 'axios';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  }),
);

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState } =
    useForm<{ email: string; password: string }>();

  const onSubmit = handleSubmit(async (data) => {
    const loginResponse = await axios.post('http://localhost:8000/v1/login', {
      email: data.email,
      password: data.password,
    });

    console.log(loginResponse);

    // if (loginResponse.data) {
    //   login({ ...loginResponse.data });
    // }
  });

  return (
    <div>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField
            label="Mail address"
            margin="dense"
            required
            {...register('email')}
          />
          <TextField
            label="Password"
            margin="dense"
            required
            {...register('password')}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button name="cancel" id="cancel" type="button">
          Cancel
        </Button>
        <Button name="login" id="login" type="submit">
          Login
        </Button>
      </DialogActions>
    </div>
  );
};

export default LoginForm;

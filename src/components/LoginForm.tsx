import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/auth';
import { AuthenticatedUser, Channel } from '../types';

const LoginForm: React.FC = () => {
  const history = useHistory();
  const { login } = useContext(AuthContext);
  const { register, handleSubmit, formState } =
    useForm<{ email: string; password: string }>();

  const onSubmit = handleSubmit(async (data) => {
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
      history.replace('/home');
    }
  });

  return (
    <div>
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            label="Mail address"
            margin="dense"
            type="email"
            {...register('email', { required: true })}
          />
          <TextField
            label="Password"
            margin="dense"
            type="password"
            {...register('password', { required: true })}
          />
        </DialogContent>
        <DialogActions>
          <Button name="cancel" id="cancel" type="button">
            Cancel
          </Button>
          <Button
            name="login"
            id="login"
            type="submit"
            disabled={formState.isSubmitting}
          >
            Login
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export default LoginForm;

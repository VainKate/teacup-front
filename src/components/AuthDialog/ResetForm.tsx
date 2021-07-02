import {
  Box,
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
  Snackbar,
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthenticatedUser } from '../../types';
import EmailInput from '../EmailInput';

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

const ResetForm: React.FC<{
  setContext: (context: 'signup' | 'login') => void;
}> = ({ setContext }) => {
  const classes = useStyles();

  const [success, setSuccess] = useState(false);
  const { handleSubmit, formState, control } = useForm({
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data: { email: string }) => {
    const resetResponse = await axios.post<AuthenticatedUser>(
      `${process.env.REACT_APP_API_URL}/v1/forgot-pwd`,
      {
        email: data.email,
      },
      { withCredentials: true },
    );

    if (resetResponse.data) {
      setSuccess(true);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          <EmailInput control={control} name="email" defaultValue="" />
        </Box>
      </DialogContent>
      <DialogContent className={classes.buttonsContainer}>
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
          Envoyer
        </Button>
      </DialogContent>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Un mail de réinitialisation a été envoyé !"
      />
    </form>
  );
};
export default ResetForm;

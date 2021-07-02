import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  makeStyles,
  Theme,
  Snackbar,
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
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

const ResetForm: React.FC<{
  setContext: (context: 'signup' | 'login') => void;
}> = ({ setContext }) => {
  const classes = useStyles();

  const [success, setSuccess] = useState(false);
  const { handleSubmit, formState, control } = useForm<{
    email: string;
  }>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={success}
        autoHideDuration={6000}
        message="Un mail de réinitialisation a été envoyé !"
      />
    </form>
  );
};
export default ResetForm;

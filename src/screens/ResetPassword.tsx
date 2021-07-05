import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Snackbar,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import { AuthContext } from '../context/auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.main,
      maxHeight: '100vh',
      minWidth: '100vw',
    },
    formContainer: {
      padding: '1.5em',
      maxWidth: '80vw',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '15px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: '1em',
    },
    title: {
      marginBottom: '.5em',
    },
    formTitle: {
      marginBottom: '1em',
    },
    button: {
      margin: '2.5em 0 1em',
    },
  }),
);

const ResetPassword: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { resetKey } = useParams<{ resetKey: string }>();
  const { user, logout } = useContext(AuthContext);
  const [failed, setFailed] = useState(false);

  const { handleSubmit, formState, getValues, setValue, control, setError } =
    useForm({
      mode: 'onChange',
    });

  setValue('resetKey', resetKey);

  const onSubmit = handleSubmit(
    async (data: { email: string; password: string; resetKey: string }) => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/reset-pwd`,
          {
            email: data.email,
            password: data.password,
            resetKey: data.resetKey,
          },
          {
            withCredentials: true,
          },
        );

        if (!!user) {
          logout();
        }

        history.push('/');
      } catch (error) {
        if (
          error.response.data.message === 'Incorrect mail address provided.'
        ) {
          setError('email', {});
        } else {
          setFailed(true);
        }
      }
    },
  );

  return (
    <>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className={classes.root}
      >
        <Box className={classes.formContainer}>
          <Typography variant="h3" className={classes.title}>
            TeaCup
          </Typography>
          <Typography variant="h5" className={classes.formTitle}>
            Renseigne ton nouveau mot de passe
          </Typography>
          <form onSubmit={onSubmit} className={classes.form}>
            <EmailInput control={control} defaultValue="" name="email" />
            <PasswordInput control={control} defaultValue="" name="password" />
            <PasswordInput
              control={control}
              defaultValue=""
              name="confirmPassword"
              getValues={getValues}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              className={classes.button}
              disabled={formState.isSubmitting}
            >
              Valider
            </Button>
          </form>
        </Box>
      </Box>
      <Snackbar
        open={failed}
        autoHideDuration={6000}
        onClose={() => setFailed(false)}
        message="Quelque chose s'est mal passé ... Ta demande de réinitialisation a peut-être expiré."
      />
    </>
  );
};

export default ResetPassword;

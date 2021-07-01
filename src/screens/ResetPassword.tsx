import {
  Box,
  Button,
  createStyles,
  TextField,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';

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

  const { handleSubmit, formState, getValues, control } = useForm<{
    password: string | undefined;
    confirmPassword: string | undefined;
  }>({
    criteriaMode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (data: any) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/reset-pwd`,
        {
          password: data.password,
          resetKey: resetKey,
        },
        {
          withCredentials: true,
        },
      );

      history.push('/');
    } catch (error) {
      // console.log(error.response.data);
    }
  };

  return (
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
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Nouveau mot de passe obligatoire.',
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <>
                <TextField
                  onBlur={onBlur}
                  onChange={onChange}
                  inputRef={ref}
                  value={value}
                  label="Nouveau mot de passe"
                  margin="dense"
                  id="password"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirmation du mot de passe obligatoire.',
              validate: (value) => getValues('password') === value,
            }}
            render={({
              field: { onChange, onBlur, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                onBlur={onBlur}
                onChange={onChange}
                inputRef={ref}
                value={value}
                label="Confirmer le mot de passe"
                margin="dense"
                id="confirmPassword"
                type="password"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            name="updatePassword"
            id="updatePassword"
            type="submit"
            className={classes.button}
            disabled={formState.isSubmitting}
          >
            Valider
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;

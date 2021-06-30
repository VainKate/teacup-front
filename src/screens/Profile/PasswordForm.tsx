import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  makeStyles,
  Theme,
  DialogTitle,
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTitle: {
      paddingBottom: '0',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '2.5em 0 1em',
    },
  }),
);

const PasswordForm: React.FC<{ handlePasswordDialogClose: () => void }> = ({
  handlePasswordDialogClose,
}) => {
  const classes = useStyles();
  const { handleSubmit, formState, setError, getValues, control } = useForm<{
    oldPassword: string | undefined;
    newPassword: string | undefined;
    confirmNewPassword: string | undefined;
  }>({
    criteriaMode: 'all',
  });
  const onSubmit = async (data: any) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          password: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      if (error.response.data.message === 'The current password is incorrect') {
        setError('oldPassword', {
          message: 'Mot de passe incorrect.',
        });
      }
    }
  };

  return (
    <Box paddingBottom="10px" textAlign="center">
      <DialogTitle className={classes.formTitle}>
        Modifie ton mot de passe
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <Controller
              control={control}
              name="oldPassword"
              rules={{ required: 'Mot de passe actuel obligatoire.' }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    onBlur={onBlur}
                    onChange={onChange}
                    inputRef={ref}
                    value={value || ''}
                    label="Mot de passe actuel"
                    margin="dense"
                    id="oldPassword"
                    type="password"
                    error={!!error}
                    helperText={error?.message}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="newPassword"
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
                    id="newPassword"
                    type="password"
                    error={!!error}
                    helperText={error?.message}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="confirmNewPassword"
              rules={{
                required: 'Confirmation du mot de passe obligatoire.',
                validate: (value) => getValues('newPassword') === value,
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
                  id="confirmNewPassword"
                  type="password"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogContent className={classes.buttonsContainer}>
          <Button size="large" onClick={handlePasswordDialogClose}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            name="updatePassword"
            id="updatePassword"
            type="submit"
            disabled={formState.isSubmitting}
          >
            Valider
          </Button>
        </DialogContent>
      </form>
    </Box>
  );
};

export default PasswordForm;

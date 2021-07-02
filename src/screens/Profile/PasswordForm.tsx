import {
  Box,
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
  DialogTitle,
} from '@material-ui/core';
import axios from 'axios';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import PasswordInput from '../../components/PasswordInput';
import { AuthContext } from '../../context/auth';

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
  const { logout } = useContext(AuthContext);
  const { handleSubmit, formState, setError, getValues, control } = useForm({
    mode: 'onChange',
  });
  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          password: data.oldPassword,
          newPassword: data.password,
        },
        {
          withCredentials: true,
        },
      );

      logout();
    } catch (error) {
      if (error.response.data.message === 'The current password is incorrect') {
        setError('oldPassword', {
          message: 'Mot de passe incorrect.',
        });
      }
    }
  });

  return (
    <Box paddingBottom="10px" textAlign="center">
      <DialogTitle className={classes.formTitle}>
        Modifie ton mot de passe
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <PasswordInput
              control={control}
              defaultValue=""
              name="oldPassword"
            />
            <PasswordInput
              control={control}
              defaultValue=""
              name="password"
              getValues={getValues}
            />
            <PasswordInput
              control={control}
              defaultValue=""
              name="confirmPassword"
              getValues={getValues}
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

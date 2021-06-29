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
import React from 'react';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      justifyContent: 'space-evenly',
      [theme.breakpoints.up('sm')]: {
        marginLeft: `240px`,
      },
    },
    updatePassword: {
      marginTop: '2em',
    },
    tagsContainer: {
      height: '20em',
    },
    formTitle: {
      paddingBottom: '0',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '2.5em 0 1em',
    },
    tag: {
      margin: '0.5em',
    },
    userTag: {
      color: '#eca245',
    },
    availableTag: {
      color: 'white',
    },
  }),
);

const PasswordForm: React.FC<{ handlePasswordDialogClose: () => void }> = ({
  handlePasswordDialogClose,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, formState } = useForm<{
    oldPassword: string | undefined;
    newPassword: string | undefined;
  }>({
    defaultValues: {
      oldPassword: undefined,
      newPassword: undefined,
    },
  });
  const onSubmit = (data: any) => console.log(data);

  return (
    <Box paddingBottom="10px" textAlign="center">
      <DialogTitle className={classes.formTitle}>
        Modifie ton mot de passe
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Ancien mot de passe"
              margin="dense"
              type="password"
              {...(register('oldPassword'), { required: true })}
            />
            <TextField
              label="Nouveau mot de passe"
              margin="dense"
              type="password"
              {...(register('newPassword'), { required: true })}
            />
            <TextField
              label="Confirmer le mot de passe"
              margin="dense"
              type="password"
              {...(register('newPassword'), { required: true })}
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

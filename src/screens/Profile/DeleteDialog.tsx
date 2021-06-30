import {
  Box,
  Button,
  createStyles,
  DialogContent,
  makeStyles,
  Theme,
  DialogTitle,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import React, { useContext } from 'react';
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
    deleteButton: {
      backgroundColor: '#bf4646',
      color: 'white',
    },
  }),
);

const DeleteDialog: React.FC<{ handleDeleteDialogClose: () => void }> = ({
  handleDeleteDialogClose,
}) => {
  const classes = useStyles();
  const { logout } = useContext(AuthContext);

  const deleteAccount = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/v1/me`, {
        withCredentials: true,
      });
      logout();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Box paddingBottom="10px" textAlign="center">
      <DialogTitle className={classes.formTitle}>
        Suppression de ton compte
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          Cette action est irréversible, tu es sûr de vouloir supprimer ton
          compte ?
        </Box>
      </DialogContent>
      <DialogContent className={classes.buttonsContainer}>
        <Button size="large" onClick={handleDeleteDialogClose}>
          Annuler
        </Button>
        <Button
          className={classes.deleteButton}
          variant="contained"
          size="large"
          type="button"
          startIcon={<DeleteIcon />}
          onClick={deleteAccount}
        >
          Supprimer
        </Button>
      </DialogContent>
    </Box>
  );
};

export default DeleteDialog;

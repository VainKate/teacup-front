import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  makeStyles,
  Theme,
  Typography,
  FormControl,
  Dialog,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import NavBar from '../../components/NavBar';
import { Tag } from '../../types';
import { AuthContext } from '../../context/auth';
import PasswordForm from './PasswordForm';
import TagsContainer from './TagsContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 .5em 2em',
      [theme.breakpoints.up('sm')]: {
        marginLeft: `240px`,
      },
    },
    personalData: {
      [theme.breakpoints.up('md')]: {
        margin: '10em 0',
      },
    },
    updatePassword: {
      marginTop: '2em',
    },
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

const ProfileScreen: React.FC = () => {
  const classes = useStyles();
  const { user, login } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    nickname: string;
    tags: [string];
  }>();
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);
  const [userTags, setUserTags] = useState<Array<Tag>>(user!.tags);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);

  const onSubmit = async (data: {
    email: string;
    nickname: string;
    tags: [number];
  }) => {
    console.log(data);
    try {
      const meResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          ...data,
          tags: userTags.map((userTag) => userTag.id),
        },
        {
          withCredentials: true,
        },
      );

      if (meResponse.data) {
        login({
          ...meResponse.data,
          channels: user!.channels,
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <NavBar />
      <Box className={classes.root}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.personalData}>
            <Typography variant="h4">Tes infos personnelles</Typography>
            <DialogContent>
              <Box display="flex" flexDirection="column">
                <TextField
                  label="Adresse mail"
                  margin="dense"
                  type="email"
                  defaultValue={user!.email}
                  placeholder={user!.email}
                  {...register('email')}
                />
                <TextField
                  label="Pseudo"
                  margin="dense"
                  type="text"
                  defaultValue={user!.nickname}
                  placeholder={user!.nickname}
                  {...register('nickname')}
                />
                <FormControl margin="dense">
                  <Button
                    size="large"
                    className={classes.updatePassword}
                    onClick={openPasswordDialog}
                  >
                    Modifier ton mot de passe
                  </Button>
                </FormControl>
              </Box>
            </DialogContent>
          </Box>
          {isPasswordDialogOpen && (
            <Dialog
              fullWidth
              maxWidth="sm"
              open={isPasswordDialogOpen}
              onClose={handlePasswordDialogClose}
            >
              <PasswordForm
                handlePasswordDialogClose={handlePasswordDialogClose}
              />
            </Dialog>
          )}
          <Box>
            <Typography variant="h4">Tes centres d'intérêts</Typography>
            <TagsContainer
              userTags={userTags}
              setUserTags={setUserTags}
              availableTags={availableTags}
              setAvailableTags={setAvailableTags}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            name="updateTags"
            id="updateTags"
            type="submit"
            disabled={formState.isSubmitting}
          >
            Valider
          </Button>
        </form>
      </Box>
    </>
  );
};

export default ProfileScreen;

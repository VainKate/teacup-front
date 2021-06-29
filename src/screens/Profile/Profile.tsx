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
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
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

export type FormData = {
  email: string;
  nickname: string;
  tags: Array<Tag>;
};

const ProfileScreen: React.FC = () => {
  const classes = useStyles();

  const { user, login } = useContext(AuthContext);
  console.log(user);

  const { register, handleSubmit, formState, control, setValue, getValues } =
    useForm<FormData>({
      criteriaMode: 'all',
      defaultValues: {
        email: user!.email,
        nickname: user!.nickname,
        tags: user!.tags,
      },
    });

  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);

  const onSubmit = async (data: FormData) => {
    console.log('coucou', data);
    try {
      const meResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          email: data.email,
          nickname: data.nickname,
          tags: data.tags.map((userTag) => userTag.id),
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

  const selectTag = (tag: Tag) => {
    setValue('tags', [...getValues('tags'), tag]);
  };

  const unselectTag = (tag: Tag) => {
    setValue('tags', [
      ...getValues('tags').filter((userTag) => userTag.id !== tag.id),
    ]);
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
                  placeholder={user!.email}
                  {...register('email', { required: true })}
                />
                <TextField
                  label="Pseudo"
                  margin="dense"
                  type="text"
                  placeholder={user!.nickname}
                  {...register('nickname', { required: true })}
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
            <Controller
              control={control}
              name="tags"
              render={() => (
                <TagsContainer
                  userTags={getValues('tags')}
                  selectTag={selectTag}
                  unselectTag={unselectTag}
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
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

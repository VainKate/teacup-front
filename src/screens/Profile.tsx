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
  Chip,
  Dialog,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import NavBar from '../components/NavBar';
import { Tag } from '../types';
import { AuthContext } from '../context/auth';
import PasswordForm from '../components/PasswordForm';

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

const ProfileScreen: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    nickname: string;
    tags: [Tag];
  }>({
    defaultValues: {
      email: user!.email,
      nickname: user!.nickname,
      tags: user!.tags,
    },
  });

  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);
  const onSubmit = (data: any) => console.log(data);
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);
  const [userTags, setUserTags] = useState<Array<Tag>>(user!.tags);

  useEffect(() => {
    const getTags = async () => {
      const tagsResponse = await axios.get<Array<Tag>>(
        `${process.env.REACT_APP_API_URL}/v1/tags`,
      );

      if (tagsResponse.data) {
        setTags([...tagsResponse.data]);
      }
    };

    getTags();
  }, []);

  useEffect(() => {
    const availableTags = tags.filter(
      (tag) => !userTags.some((userTag) => userTag.id === tag.id),
    );
    setAvailableTags([...availableTags]);
  }, [tags, userTags]);

  return (
    <>
      <NavBar />
      <Box className={classes.root}>
        <Box>
          <Typography variant="h4">Tes infos personnelles</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Box display="flex" flexDirection="column">
                <TextField
                  label="Adresse mail"
                  margin="dense"
                  type="text"
                  placeholder={user!.email}
                  {...register('email')}
                />
                <TextField
                  label="Pseudo"
                  margin="dense"
                  type="text"
                  placeholder={user!.nickname}
                  {...register('nickname')}
                />
                <FormControl margin="dense">
                  <Button
                    size="large"
                    className={classes.updatePassword}
                    onClick={openPasswordDialog}
                  >
                    Modifier le mot de passe
                  </Button>
                </FormControl>
              </Box>
            </DialogContent>
          </form>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              {!!userTags.length && (
                <Box margin="3em 0">
                  {userTags
                    .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
                    .map((userTag) => (
                      <Chip
                        key={`tag${userTag.id}`}
                        className={`${classes.tag} ${classes.userTag}`}
                        label={userTag.name}
                      />
                    ))}
                </Box>
              )}
              {!!availableTags.length && (
                <Box margin="3em 0">
                  {availableTags
                    .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
                    .map((availableTag) => {
                      return (
                        <Chip
                          key={`tag${availableTag.id}`}
                          className={`${classes.tag} ${classes.availableTag}`}
                          label={availableTag.name}
                          onClick={() => {
                            const newUserTagsList = [...userTags];
                            newUserTagsList.push(availableTag);

                            setUserTags(newUserTagsList);
                          }}
                        />
                      );
                    })}
                </Box>
              )}
            </DialogContent>
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
      </Box>
    </>
  );
};

export default ProfileScreen;

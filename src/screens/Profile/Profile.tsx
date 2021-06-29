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
import NavBar from '../../components/NavBar';
import { Tag } from '../../types';
import { AuthContext } from '../../context/auth';
import PasswordForm from './PasswordForm';

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
    tags: [string];
  }>();
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [availableTags, setAvailableTags] = useState<Array<Tag>>([]);
  const [userTags, setUserTags] = useState<Array<Tag>>(user!.tags);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const getTags = async () => {
      const tagsResponse = await axios.get<Array<Tag>>(
        `${process.env.REACT_APP_API_URL}/v1/tags`,
        {
          withCredentials: true,
        },
      );

      if (tagsResponse.data) {
        setTags([...tagsResponse.data]);
      }
    };
    console.log('appel des tags');
    getTags();
  }, []);

  useEffect(() => {
    const availableTags = tags.filter(
      (tag) => !userTags.some((userTag) => userTag.id === tag.id),
    );
    setAvailableTags([...availableTags]);
  }, [tags, userTags]);

  const onSubmit = async (data: {
    email: string;
    nickname: string;
    tags: [number];
  }) => {
    try {
      console.log(data);
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
        console.log(meResponse.data);
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
            <DialogContent>
              {!!userTags.length && (
                <Box margin="3em 0">
                  {userTags
                    .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
                    .map((userTag, index) => (
                      <Chip
                        key={`tag${userTag.id}`}
                        className={`${classes.tag} ${classes.userTag}`}
                        label={userTag.name}
                        onDelete={() => {
                          const newUserTagsList = userTags.filter(
                            (tag) => userTag.id !== tag.id,
                          );
                          setUserTags([...newUserTagsList]);
                        }}
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
                            setUserTags([...newUserTagsList]);
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
          </Box>
        </form>
      </Box>
    </>
  );
};

export default ProfileScreen;

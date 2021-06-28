import {
  Box,
  Button,
  createStyles,
  DialogContent,
  TextField,
  InputLabel,
  makeStyles,
  Theme,
  Typography,
  FormControl,
  Dialog,
  DialogTitle,
  Chip,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import NavBar from '../components/NavBar';
import { Tag } from '../types';
import { AuthContext } from '../context/auth';

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
    classic: {
      email: string;
      nickname: string;
      tags: [Tag];
    };
    password: {
      oldPassword: string | undefined;
      newPassword: string | undefined;
    };
  }>({
    defaultValues: {
      classic: {
        email: user!.email,
        nickname: user!.nickname,
        tags: user!.tags,
      },
      password: {
        oldPassword: undefined,
        newPassword: undefined,
      },
    },
  });

  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  //   const handlePasswordDialogClose = () => setPasswordDialogOpen(false);
  const onSubmit = (data: any) => console.log(data);
  const [tags, setTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const getTags = async () => {
      const tagsResponse = await axios.get<Array<Tag>>(
        `${process.env.REACT_APP_API_URL}/v1/tags`,
      );

      if (tagsResponse.data) {
        setTags(tagsResponse.data);
      }
    };

    getTags();
  }, []);

  return (
    <>
      <NavBar />
      <Box className={classes.root}>
        <Typography variant="h4">Tes infos personnelles</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box display="flex" flexDirection="column">
              <TextField
                label="Adresse mail"
                margin="dense"
                type="text"
                placeholder={user!.email}
                {...register('classic.email')}
              />
              <TextField
                label="Pseudo"
                margin="dense"
                type="text"
                placeholder={user!.nickname}
                {...register('classic.nickname')}
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
        {/* <Dialog
          fullWidth
          maxWidth="sm"
          open={isPasswordDialogOpen}
          onClose={handlePasswordDialogClose}
        >
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
                    {...(register('password.oldPassword'), { required: true })}
                  />
                  <TextField
                    label="Nouveau mot de passe"
                    margin="dense"
                    type="password"
                    {...(register('password.newPassword'), { required: true })}
                  />
                  <TextField
                    label="Confirmer le nouveau mot de passe"
                    margin="dense"
                    type="password"
                    {...(register('password.newPassword'), { required: true })}
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
        </Dialog> */}
        <Typography variant="h4">Tes centres d'intérêts</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box>
              {tags
                .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
                .map((tag) => {
                  const tagClass = user!.tags.some(
                    (userTag) => userTag.id === tag.id,
                  )
                    ? classes.userTag
                    : classes.availableTag;

                  return (
                    <Chip
                      key={`tag${tag.id}`}
                      className={tagClass}
                      label={tag.name}
                    />
                  );
                })}
            </Box>
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
    </>
  );
};

export default ProfileScreen;

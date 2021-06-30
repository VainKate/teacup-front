import {
  Box,
  Button,
  createStyles,
  Dialog,
  DialogContent,
  FormControl,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NavBar from '../../components/NavBar';
import { AuthContext } from '../../context/auth';
import { Tag } from '../../types';
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

function ProfileScreen() {
  const classes = useStyles();
  const { user, login } = useContext(AuthContext);
  console.log('coucou');

  const { register, handleSubmit, formState, control, getValues, setValue } =
    useForm({
      defaultValues: {
        nickname: user!.nickname,
        email: user!.email,
        tags: user!.tags,
      },
    });

  const onSubmit = async (data: any) => {
    console.log('coucou', data);
    try {
      const meResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          email: data.email,
          nickname: data.nickname,
          tags: data.tags.map((userTag: Tag) => userTag.id),
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

  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);

  const { ref: nicknameRef, ...nicknameProps } = register('nickname', {
    required: true,
  });
  const { ref: emailRef, ...emailProps } = register('email', {
    required: true,
  });

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
                  inputRef={emailRef}
                  {...emailProps}
                />
                <TextField
                  label="Pseudo"
                  margin="dense"
                  type="text"
                  required={true}
                  placeholder={user!.nickname}
                  inputRef={nicknameRef}
                  {...nicknameProps}
                />
                <FormControl margin="dense">
                  <Button
                    size="large"
                    type="button"
                    className={classes.updatePassword}
                    onClick={openPasswordDialog}
                  >
                    Modifier ton mot de passe
                  </Button>
                </FormControl>
              </Box>
            </DialogContent>
          </Box>

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
            name="update"
            id="update"
            disabled={formState.isSubmitting}
          >
            Valider
          </Button>
        </form>
      </Box>
      {isPasswordDialogOpen && (
        <Dialog
          fullWidth
          maxWidth="sm"
          open={isPasswordDialogOpen}
          onClose={handlePasswordDialogClose}
        >
          <PasswordForm handlePasswordDialogClose={handlePasswordDialogClose} />
        </Dialog>
      )}
    </>
  );
}

export default ProfileScreen;

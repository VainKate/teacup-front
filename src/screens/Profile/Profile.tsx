import {
  Box,
  Button,
  createStyles,
  Dialog,
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
      padding: '0 2em 2em',
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

  // Form
  const { handleSubmit, formState, control, getValues, setValue } =
    useForm<FormData>({
      criteriaMode: 'all',
      defaultValues: {
        nickname: user!.nickname,
        email: user!.email,
        tags: user!.tags,
      },
    });

  const onSubmit = async (data: FormData) => {
    try {
      const meResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          email: data.email,
          nickname: data.nickname,
          tags: data.tags.map((tag) => tag.id),
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

  // Password dialog
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => setPasswordDialogOpen(false);

  return (
    <>
      <NavBar />
      <Box className={classes.root}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.personalData}>
            <Typography variant="h4">Tes infos personnelles</Typography>
            <Box display="flex" flexDirection="column">
              <Controller
                control={control}
                name="email"
                rules={{ required: 'You must provide an email address.' }}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    onBlur={onBlur}
                    onChange={onChange}
                    inputRef={ref}
                    value={value}
                    label="Adresse mail"
                    margin="dense"
                    id="email"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="nickname"
                rules={{ required: 'You must provide an username.' }}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    onBlur={onBlur}
                    onChange={onChange}
                    inputRef={ref}
                    value={value}
                    label="Pseudo"
                    margin="dense"
                    id="nickname"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button
                size="large"
                type="button"
                className={classes.updatePassword}
                onClick={openPasswordDialog}
              >
                Modifier ton mot de passe
              </Button>
            </Box>
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
            disabled={formState.isSubmitting || !formState.isValid}
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
};

export default ProfileScreen;

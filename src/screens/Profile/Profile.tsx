import {
  Box,
  Button,
  createStyles,
  Dialog,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NavBar from '../../components/NavBar';
import { AuthContext } from '../../context/auth';
import { Tag } from '../../types';
import PasswordForm from './PasswordForm';
import PersonalData from './PersonalData';
import TagsContainer from './TagsContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 2em',
      [theme.breakpoints.up('sm')]: {
        marginLeft: `240px`,
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 'calc(100vh - 64px)',
    },
    formTitle: {
      paddingBottom: '0',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '3em 0',
      width: '-webkit-fill-available',
    },
    deleteButton: {
      backgroundColor: '#bf4646',
      color: 'white',
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
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <PersonalData
              openPasswordDialog={openPasswordDialog}
              control={control}
            />
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
          </Box>
          <Box className={classes.buttonsContainer}>
            <Button
              className={classes.deleteButton}
              variant="contained"
              size="large"
              type="button"
              startIcon={<DeleteIcon />}
            >
              Supprimer le compte
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={formState.isSubmitting || !formState.isValid}
            >
              Valider
            </Button>
          </Box>
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

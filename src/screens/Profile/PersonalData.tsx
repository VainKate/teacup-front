import {
  Box,
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { FormData } from './Profile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    personalData: {
      [theme.breakpoints.up('md')]: {
        margin: '5em 0',
      },
    },
    updatePassword: {
      marginTop: '2em',
      backgroundColor: '#0000000a',
      '&:hover': {
        backgroundColor: '#0000002b',
      },
    },
  }),
);

const PersonalData: React.FC<{
  control: Control<FormData>;
  openPasswordDialog: () => void;
}> = ({ control, openPasswordDialog }) => {
  const classes = useStyles();

  return (
    <Box className={classes.personalData}>
      <Typography variant="h4">Tes infos personnelles</Typography>
      <Box display="flex" flexDirection="column" margin="3em 0">
        <Controller
          control={control}
          name="email"
          rules={{
            required: "L'adresse mail est obligatoire.",
            validate: (value) =>
              value && value?.replaceAll(' ', '').length !== 0,
          }}
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
              type="email"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="nickname"
          rules={{
            required: 'Le pseudo est obligatoire.',
            validate: (value) =>
              value && value?.replaceAll(' ', '').length !== 0,
          }}
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
  );
};

export default PersonalData;

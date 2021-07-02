import { TextField } from '@material-ui/core';
import { useController, Control, FieldValues } from 'react-hook-form';

const PasswordInput: React.FC<{
  control: Control<FieldValues>;
  name: 'oldPassword' | 'password' | 'confirmPassword';
  defaultValue: string;
  getValues?: (field: string) => string | undefined;
}> = ({ control, name, defaultValue, getValues }) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue,
    rules: {
      required:
        name === 'password'
          ? 'Le mot de passe est requis.'
          : name === 'oldPassword'
          ? "L'ancien mot de passe est requis."
          : 'La confirmation du mot de passe est requise.',
      validate: (value: string) =>
        name === 'confirmPassword' && !!getValues
          ? getValues('password') === value
          : undefined,
    },
  });

  return (
    <TextField
      label={
        name === 'password'
          ? 'Mot de passe'
          : name === 'oldPassword'
          ? 'Ancien mot de passe'
          : 'Confirmer le mot de passe'
      }
      margin="dense"
      type="password"
      {...inputProps}
      inputRef={ref}
      error={!!error}
      helperText={error ? error.message : null}
    />
  );
};
export default PasswordInput;

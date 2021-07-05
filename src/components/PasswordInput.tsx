import { TextField } from '@material-ui/core';
import { useController, Control, FieldValues } from 'react-hook-form';

const PasswordInput: React.FC<{
  control: Control<FieldValues>;
  name: 'oldPassword' | 'password' | 'confirmPassword';
  defaultValue: string;
  getValues?: (field: string) => string;
}> = ({ control, name, defaultValue, getValues }) => {
  const label = {
    oldPassword: 'Ancien mot de passe',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
  };
  const rules = {
    required: {
      oldPassword: "L'ancien mot de passe est requis.",
      password: 'Le mot de passe est requis.',
      confirmPassword: 'La confirmation du mot de passe est requise.',
    },
    validate: {
      oldPassword: undefined,
      password: (value: string) =>
        getValues!('oldPassword') !== value
          ? true
          : "L'ancien et le nouveau mot de passe ne peuvent pas être identiques.",
      confirmPassword: (value: string) =>
        getValues!('password') === value
          ? true
          : 'Le mot de passe et sa confirmation doivent être identiques.',
    },
  };

  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue,
    rules: {
      required: rules.required[name],
      validate: getValues ? rules.validate[name] : undefined,
    },
  });

  return (
    <TextField
      label={label[name]}
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

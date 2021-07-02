import { TextField } from '@material-ui/core';
import { useController, Control, FieldValues } from 'react-hook-form';

const InputEmail: React.FC<{
  control: Control<FieldValues>;
  name: 'email';
  defaultValue: string;
}> = ({ control, name, defaultValue }) => {
  const {
    field: { ref, ...inputProps },
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue,
    rules: {
      required: 'Une adresse mail est requise.',
      pattern: /\S+@\S+\.\S+/,
    },
  });

  return (
    <TextField
      label="Adresse mail"
      margin="dense"
      type="email"
      {...inputProps}
      inputRef={ref}
      error={!!error}
      helperText={error ? error.message : null}
    />
  );
};
export default InputEmail;

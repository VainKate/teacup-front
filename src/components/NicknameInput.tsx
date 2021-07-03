import { TextField } from '@material-ui/core';
import { useController, Control, FieldValues } from 'react-hook-form';

const NicknameInput: React.FC<{
  control: Control<FieldValues>;
  name: 'nickname';
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
      required: 'Le pseudo est requis.',
      validate: (value) => value.replaceAll(' ', '').length !== 0,
    },
  });

  return (
    <TextField
      label="Pseudo"
      margin="dense"
      type="text"
      {...inputProps}
      inputRef={ref}
      error={!!error}
      helperText={error ? error.message : null}
    />
  );
};
export default NicknameInput;

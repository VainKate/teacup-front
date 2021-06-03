import { createStyles, makeStyles, TextField } from '@material-ui/core';
import React, { FormEvent, useState } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  }),
);

const ChatInput: React.FC<{ sendMessage: (messageInput: string) => void }> = ({
  sendMessage,
}) => {
  const classes = useStyles();
  const [messageInput, setMessageInput] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleMessage = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(messageInput);
    setMessageInput('');
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleMessage}
      className={classes.root}
    >
      <TextField
        id="chat"
        label="Type to chat"
        variant="outlined"
        fullWidth
        value={messageInput}
        onChange={handleChange}
      />
    </form>
  );
};

export default ChatInput;

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Message } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    foreign: {
      textAlign: 'left',
      padding: '10px 15px',
      margin: '5px 10px',
      maxWidth: '70%',
      backgroundColor: '#258AF7',
      borderRadius: '10px',
      alignSelf: 'flex-start',
    },
    own: {
      textAlign: 'left',
      padding: '10px 15px',
      margin: '5px 10px',
      maxWidth: '70%',
      backgroundColor: '#A4A4A4',
      borderRadius: '10px',
      flex: 1,
      alignSelf: 'flex-end',
    },
    author: {
      fontWeight: 600,
      margin: '0 0 5px 0',
      color: 'white',
    },
    contents: {
      wordWrap: 'break-word',
      color: 'white',
    },
  }),
);

const MessageItem: React.FC<{ message: Message; isForeign: boolean }> = ({
  message,
  isForeign,
}) => {
  const classes = useStyles();

  return (
    <div className={isForeign ? classes.foreign : classes.own}>
      {isForeign && <p className={classes.author}>{message.user.nickname}</p>}
      <span className={classes.contents}>{message.content}</span>
    </div>
  );
};

export default MessageItem;

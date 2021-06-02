import {
  Card,
  CardContent,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Channel } from '../models/channel.model';
import { theme } from '../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    tag: {
      paddingLeft: '5px',
      paddingRight: '5px',
    },
  }),
);

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{channel.title}</Typography>
        <div className={classes.tagContainer}>
          {channel.tags?.map((tag) => (
            <Typography
              variant="h6"
              color="textSecondary"
              className={classes.tag}
            >
              {tag.name}
            </Typography>
          ))}
        </div>
      </CardContent>
      <CardContent>
        {channel.usersCount} utilisateurs dans ce salon.
      </CardContent>
    </Card>
  );
};

export default ChannelCard;

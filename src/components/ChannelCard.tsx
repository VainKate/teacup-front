import {
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Channel } from '../models/channel.model';

const useStyles = makeStyles(() =>
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
    card: {
      height: '100%',
    },
  }),
);

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className={classes.card}>
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
    </Grid>
  );
};

export default ChannelCard;

import {
  Card,
  CardContent,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { Channel } from '../types';

const useStyles = makeStyles(() =>
  createStyles({
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingTop: '1rem',
    },
    tag: {
      paddingLeft: '5px',
      paddingRight: '5px',
      fontSize: '1rem',
    },
    tagActive: {
      color: '#ECA245',
      fontWeight: 'bold',
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
  }),
);

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const classes = useStyles();
  const history = useHistory();

  const enterChannel = () => {
    history.push(`/channel/${channel.id}`);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className={classes.card} onClick={enterChannel}>
        <CardContent className={classes.content}>
          <Typography variant="h5">{channel.title}</Typography>
          <div className={classes.tagContainer}>
            {channel.tags?.map((tag) => (
              <Typography
                variant="h6"
                color="textSecondary"
                className={
                  tag.matchingTag
                    ? `${classes.tag} ${classes.tagActive}`
                    : `${classes.tag}`
                }
                key={tag.name}
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

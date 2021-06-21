import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ChannelList from '../components/ChannelList';
import NavBar from '../components/NavBar';
import { Channel } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: `240px`,
      },
    },
  }),
);

const DiscoverScreen: React.FC = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Array<Channel> | null>(null);

  const getChannels = async () => {
    const channelsResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1/channels`,
      { withCredentials: true },
    );

    if (channelsResponse.data) {
      setChannels(channelsResponse.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div>
      <NavBar />
      <Box className={classes.root}>
        <Typography variant="h4">Découvrir</Typography>
        <ChannelList loading={loading} channels={channels} />
      </Box>
    </div>
  );
};

export default DiscoverScreen;

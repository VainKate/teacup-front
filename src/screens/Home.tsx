import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ChannelCard from '../components/ChannelCard';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingRecommendedChannels, setLoadingRecommendedChannels] =
    useState(true);
  const [userChannels, setUserChannels] = useState<Array<Channel> | null>(null);
  const [userRecommendedChannels, setUserRecommendedChannels] =
    useState<Array<Channel> | null>(null);

  const getChannels = async () => {
    const channelsResponse = await axios.get(
      'http://localhost:8000/v1/me/channels',
      { withCredentials: true },
    );

    if (channelsResponse.data) {
      setUserChannels(channelsResponse.data);
      setLoadingChannels(false);
    }
  };

  const getRecommendedChannels = async () => {
    const channelsResponse = await axios.get(
      'http://localhost:8000/v1/me/recommended',
      {
        withCredentials: true,
      },
    );

    if (channelsResponse.data) {
      setUserRecommendedChannels(channelsResponse.data);
      setLoadingRecommendedChannels(false);
    }
  };

  useEffect(() => {
    getChannels();
    getRecommendedChannels();
  }, []);

  return (
    <div>
      <Typography variant="h4">Tes Salons</Typography>
      <Box padding="20px">
        <Grid container spacing={3}>
          {loadingChannels ? (
            <CircularProgress />
          ) : (
            <>
              {userChannels?.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </>
          )}
        </Grid>
      </Box>
      <Typography variant="h4">Recommandé pour toi</Typography>
      <Box padding="20px">
        <Grid container spacing={3}>
          {loadingRecommendedChannels ? (
            <CircularProgress />
          ) : (
            <>
              {userRecommendedChannels?.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default HomeScreen;

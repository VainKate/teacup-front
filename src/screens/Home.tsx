import { Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ChannelList from '../components/ChannelList';
import { Channel } from '../models/channel.model';

const HomeScreen: React.FC = () => {
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
      <ChannelList loading={loadingChannels} channels={userChannels} />
      <Typography variant="h4">Recommandé pour toi</Typography>
      <ChannelList
        loading={loadingRecommendedChannels}
        channels={userRecommendedChannels}
      />
    </div>
  );
};

export default HomeScreen;

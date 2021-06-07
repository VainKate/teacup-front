import { Typography } from '@material-ui/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ChannelList from '../components/ChannelList';
import NavBar from '../components/NavBar';
import { AuthContext } from '../context/auth';
import { Channel } from '../types';

const HomeScreen: React.FC = () => {
  const [loadingRecommendedChannels, setLoadingRecommendedChannels] =
    useState(true);
  const [userRecommendedChannels, setUserRecommendedChannels] =
    useState<Array<Channel> | null>(null);

  const { user } = useContext(AuthContext);

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
    getRecommendedChannels();
  }, []);

  return (
    <div>
      <NavBar />
      <Typography variant="h4">Tes Salons</Typography>
      {user && user.channels && (
        <ChannelList loading={!user} channels={user.channels} />
      )}

      <Typography variant="h4">Recommandé pour toi</Typography>
      <ChannelList
        loading={loadingRecommendedChannels}
        channels={userRecommendedChannels}
      />
    </div>
  );
};

export default HomeScreen;

import { Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ChannelList from '../components/ChannelList';
import NavBar from '../components/NavBar';
import { Channel } from '../types';

const DiscoverScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Array<Channel> | null>(null);

  const getChannels = async () => {
    const channelsResponse = await axios.get(
      'http://localhost:8000/v1/channels',
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
      <Typography variant="h4">Découvrir</Typography>
      <ChannelList loading={loading} channels={channels} />
    </div>
  );
};

export default DiscoverScreen;

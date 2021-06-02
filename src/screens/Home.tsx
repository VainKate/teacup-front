import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ChannelCard from '../components/ChannelCard';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [loadingChannels, setLoadingChannels] = useState(true);
  const [userChannels, setUserChannels] = useState<Array<Channel> | null>(null);

  const getChannels = async () => {
    const channelsResponse = await axios.get(
      'http://localhost:8000/v1/channels',
      { withCredentials: true },
    );

    if (channelsResponse.data) {
      setUserChannels(channelsResponse.data);
      setLoadingChannels(false);
    }
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div>
      <h5>Tes Salons</h5>
      {loadingChannels ? (
        <CircularProgress />
      ) : (
        <>
          {userChannels?.map((channel) => (
            <ChannelCard channel={channel} />
          ))}
        </>
      )}
      <h5>Recommandé pour toi</h5>
    </div>
  );
};

export default HomeScreen;

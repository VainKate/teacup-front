import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ChannelCard from '../components/ChannelCard';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';

const DiscoverScreen: React.FC = () => {
  const { user } = useContext(AuthContext);

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
      <Typography variant="h4">Découvrir</Typography>
      <Box padding="20px">
        <Grid container spacing={3}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {channels?.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default DiscoverScreen;

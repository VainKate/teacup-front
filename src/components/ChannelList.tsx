import { Box, CircularProgress, Grid } from '@material-ui/core';
import { Channel } from '../models/channel.model';
import ChannelCard from './ChannelCard';

const ChannelList: React.FC<{
  loading: Boolean;
  channels: Array<Channel> | null;
}> = ({ loading, channels }) => {
  return (
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
  );
};

export default ChannelList;

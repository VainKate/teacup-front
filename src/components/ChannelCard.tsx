import { Card, CardContent, Typography } from '@material-ui/core';
import { Channel } from '../models/channel.model';

const ChannelCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{channel.title}</Typography>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;

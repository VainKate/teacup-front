import { useContext } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../context/auth';
import { Channel } from '../models/channel.model';

const ChannelScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <p>TYPE MESSAGE TO WIN GAME</p>
    </div>
  );
};

export default ChannelScreen;

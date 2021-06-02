import { useContext } from 'react';
import { AuthContext } from '../context/auth';

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h5>Tes Salons</h5>
      {user?.channels.map((channel) => (
        <div>{channel.title}</div>
      ))}
      <h5>Recommandé pour toi</h5>
    </div>
  );
};

export default HomeScreen;

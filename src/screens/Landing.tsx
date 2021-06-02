import { useContext } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/auth';

const LandingScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  if (user) {
    history.replace('/home');
  }

  return (
    <section>
      <div>
        <h1>Come chat with us!</h1>
        <p>
          Envie de discuter de ta série du moment, de films d'horreur ou de ta
          passion pour la cuisine ?
        </p>
        <p>
          Rejoins-nous sur les salons de ton choix et viens échanger avec
          d'autres passionnés !
        </p>
      </div>
    </section>
  );
};

export default LandingScreen;

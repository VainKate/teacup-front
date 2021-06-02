import { Link } from 'react-router-dom';

const DrawerContent: React.FC = () => {
  return (
    <div>
      <Link to="/home">
        <p>Home</p>
      </Link>
      <Link to="/discover">
        <p>Découvrir</p>
      </Link>
    </div>
  );
};

export default DrawerContent;

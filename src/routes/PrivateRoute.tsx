import { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import { RouteProps } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const PrivateRoute: React.FC<{ children: any } & RouteProps> = ({
  children,
  ...rest
}) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;

import axios from 'axios';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { AuthenticatedUser } from '../types';

const AuthContext = createContext<{
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}>({
  user: null,
  loading: true,
  login: (user: AuthenticatedUser) => {},
  logout: () => {},
});

const authReducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  });

  const getMe = async () => {
    try {
      const meResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/me`,
        {
          withCredentials: true,
        },
      );

      if (meResponse.data) {
        const userChannels = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/me/channels`,
          {
            withCredentials: true,
          },
        );

        dispatch({
          type: 'LOGIN',
          payload: { ...meResponse.data, channels: userChannels.data },
        });
        dispatch({
          type: 'LOADING',
          payload: { loading: false },
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGOUT',
        payload: { user: null },
      });
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const login = useCallback((user: AuthenticatedUser) => {
    dispatch({
      type: 'LOGIN',
      payload: user,
    });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT', payload: { user: null } });
  }, []);

  const value = useMemo(() => {
    return { user: state.user, loading: state.loading, login, logout };
  }, [state.user, state.loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };

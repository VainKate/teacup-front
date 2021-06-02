import axios from 'axios';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { AuthenticatedUser } from '../models/user.model';

const AuthContext = createContext<{
  user: AuthenticatedUser | null;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
}>({
  user: null,
  login: (user: AuthenticatedUser) => {},
  logout: () => {},
});

const authReducer = (state: any, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  const getMe = async () => {
    try {
      const meResponse = await axios.get('http://localhost:8000/v1/me', {
        withCredentials: true,
      });

      if (meResponse.data) {
        dispatch({
          type: 'LOGIN',
          payload: meResponse.data,
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
    return { user: state.user, login, logout };
  }, [state.user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };

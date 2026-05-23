import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from '../../features/user/userApi';
import { setUser, logout as logoutAction } from '../../features/user/userSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Persist user session on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && !isAuthenticated) {
      // If user info is stored, use it; otherwise, fallback to dummy
      let userObj = user;
      try {
        userObj = storedUser ? JSON.parse(storedUser) : user;
      } catch {
        userObj = user;
      }
      dispatch(setUser(userObj || { name: 'User', role: 'Member' }));
    }
  }, [dispatch, isAuthenticated, user]);

  const { data: userData, isSuccess } = useGetUserQuery(undefined, {
    skip: !localStorage.getItem('token'),
  });

  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(setUser(userData));
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [userData, isSuccess, dispatch]);

  const login = async (credentials) => {
    try {
      // const result = await loginMutation(credentials).unwrap();
      // const result = {
      //   token: 'token1',
      //   user: credentials,
      // };
      const result = {
        token: 'loggedin-token',
        user: credentials,
      };
      localStorage.setItem('token', 'loggedin-token');
      localStorage.setItem('user', JSON.stringify(credentials));
      dispatch(setUser(credentials));
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logoutAction());
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth-service';
import toast from 'react-hot-toast';

export const AuthContext = React.createContext({
  isAuthenticated: false,
  user: null,
  loading: null
});

const storedUser = localStorage.getItem('user');

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await AuthService.getUser();
        loginUser(response.data);
      } catch (error) {
        setIsAuthenticated(() => false);
        if (error?.response?.status !== 401) {
          toast.error(
            error?.response?.data?.message ||
              'Server Error. Please confirm that the NodeJS server is running.'
          );
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const loginUser = ({ user }) => {
    localStorage.setItem('user', user.id);
    setUser(() => user);
    setIsAuthenticated(() => true);
  };

  const logoutUser = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    await AuthService.logout();
    toast.success('Successfully Logged out!');
  };

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

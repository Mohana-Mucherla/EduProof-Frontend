import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getToken();

    if (storedToken && storedUser) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');
  const isStudent = user && (user.role === 'ROLE_STUDENT' || user.role === 'STUDENT');

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

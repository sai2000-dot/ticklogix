import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole',  userData.role);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
    isEmployee:  user?.role === 'employee',
    isManager:   user?.role === 'manager',
    isAdmin:     user?.role === 'admin',
    canApprove:  user?.role === 'manager' || user?.role === 'admin',
    canGenerate: user?.role === 'manager' || user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
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

  const loginWithToken = async (token) => {
    localStorage.setItem('authToken', token);
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('userRole', res.data.role);
    } catch {
      localStorage.removeItem('authToken');
    }
  };

  // ── Trial / Subscription helpers ──────────────────────────────────────

  const getTrialDaysLeft = () => {
    if (!user) return 0;
    if (user.subscriptionStatus === 'active') return null; // not on trial
    const start = new Date(user.trialStartDate || user.createdAt || Date.now());
    const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays);
  };

  const isTrialExpired = () => {
    if (!user) return false;
    if (user.subscriptionStatus === 'active') return false;
    return getTrialDaysLeft() === 0;
  };

  const hasAccess = () => {
    if (!user) return false;
    if (user.subscriptionStatus === 'active') return true;
    return getTrialDaysLeft() > 0;
  };

  const refreshUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch { /* silent */ }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    loginWithToken,
    refreshUser,
    isAuthenticated:  Boolean(user),
    isEmployee:       user?.role === 'employee',
    isManager:        user?.role === 'manager',
    isAdmin:          user?.role === 'admin',
    canApprove:       user?.role === 'manager' || user?.role === 'admin',
    canManageInvoices:user?.role === 'admin',
    canManageEmployees:user?.role === 'admin',
    getTrialDaysLeft,
    isTrialExpired,
    hasAccess,
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

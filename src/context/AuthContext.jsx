import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ADMIN_CONFIG } from '../config/adminConfig';
import * as storageService from '../services/storageService';
import { useToast } from './ToastContext';

/**
 * BIYA FASHION - Admin Authentication Context
 * 
 * IMPORTANT:
 * Frontend-only authentication. Hardcoded credentials are NOT secure for production.
 * A real production application requires server-side authentication.
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const session = storageService.getAdminSession();
    if (session && session.authenticated) {
      setAdminUser(session.username);
      setIsAuthenticated(true);
    } else {
      setAdminUser(null);
      setIsAuthenticated(false);
    }
    setAuthLoading(false);
  }, []);

  const login = useCallback(
    (username, password) => {
      // Validate credentials against adminConfig
      const trimmedUser = (username || '').trim();
      const trimmedPass = (password || '').trim();

      if (
        trimmedUser === ADMIN_CONFIG.ADMIN_USERNAME &&
        trimmedPass === ADMIN_CONFIG.ADMIN_PASSWORD
      ) {
        const session = storageService.setAdminSession(trimmedUser);
        setAdminUser(session.username);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${trimmedUser}! Logged in successfully.`);
        return { success: true };
      } else {
        toast.error('Invalid username or password. Please try again.');
        return {
          success: false,
          error: 'Invalid credentials. Please verify your admin username and password.',
        };
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    storageService.clearAdminSession();
    setAdminUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out of the admin panel.');
  }, [toast]);

  const value = {
    isAuthenticated,
    adminUser,
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

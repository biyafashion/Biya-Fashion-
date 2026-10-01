import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storageService from '../services/storageService';
import { useToast } from './ToastContext';

const CustomerAuthContext = createContext(null);

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' or 'register'
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const session = storageService.getCurrentCustomer();
      if (session) {
        setCustomer(session);
      }
    } catch (err) {
      console.error('Failed to load customer session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((tab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(
    (identifier, password) => {
      const res = storageService.loginCustomer(identifier, password);
      if (res.success) {
        setCustomer(res.customer);
        setIsAuthModalOpen(false);
        toast.success(`Welcome back, ${res.customer.name}!`);
        return { success: true };
      } else {
        toast.error(res.error || 'Failed to sign in.');
        return { success: false, error: res.error };
      }
    },
    [toast]
  );

  const register = useCallback(
    (data) => {
      const res = storageService.registerCustomer(data);
      if (res.success) {
        setCustomer(res.customer);
        setIsAuthModalOpen(false);
        toast.success(`Account created successfully! Welcome, ${res.customer.name}.`);
        return { success: true };
      } else {
        toast.error(res.error || 'Registration failed.');
        return { success: false, error: res.error };
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    storageService.logoutCustomer();
    setCustomer(null);
    toast.info('Signed out of your customer account.');
  }, [toast]);

  const updateProfile = useCallback(
    (updates) => {
      const updated = storageService.updateCustomerProfile(updates);
      if (updated) {
        setCustomer(updated);
        toast.success('Delivery address & profile updated.');
        return { success: true, customer: updated };
      }
      return { success: false };
    },
    [toast]
  );

  const value = {
    customer,
    isLoggedIn: !!customer,
    loading,
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export default CustomerAuthContext;

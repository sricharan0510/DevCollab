import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await ApiService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Step 1: Pre-register → send OTP
  const preRegister = async (userData) => {
    try {
      const response = await ApiService.preRegister(userData);
      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Step 2: Verify OTP → create account
  const verifyRegistration = async (verificationData) => {
    try {
      const response = await ApiService.verifyRegistration(verificationData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await ApiService.updateProfile(profileData);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await ApiService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    preRegister,
    verifyRegistration,
    logout,
    updateProfile,
    checkAuthStatus,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

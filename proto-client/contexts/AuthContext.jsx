'use client'

import { AuthAPI } from '@/lib/Services';
import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthAPI.login(email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        email: response.email,
        name: response.name,
      }));
      
      setUser({
        id: response.id,
        email: response.email,
        name: response.name,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const signup = async(name , email , password) => {
    try {
      await AuthAPI.signup(name, email , password);
      return { success: true};
    } catch (error) {
      return { success: false, error: error.message};
    }
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


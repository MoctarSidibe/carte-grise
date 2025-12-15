import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  /**
   * Check if user has a specific role (works with dynamic role names)
   * @param {string} roleName - Role name (e.g., 'Patrimoine', 'DCRTCT', 'SYSTEM_ADMIN')
   */
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;

    // Support both string array and object array formats
    return user.roles.some(role =>
      (typeof role === 'string' && role === roleName) ||
      (role.name && role.name === roleName)
    );
  };

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission name
   */
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;

    // Support both string array and object array formats
    return user.permissions.some(perm =>
      (typeof perm === 'string' && perm === permission) ||
      (perm.name && perm.name === permission)
    );
  };

  /**
   * Check if user has SYSTEM_ADMIN role
   */
  const isSystemAdmin = () => {
    return hasRole('SYSTEM_ADMIN');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
    isSystemAdmin
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

// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('ff_token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    return t || null;
  });
  const [loading, setLoading] = useState(false);

  // Attach token to every axios request
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('ff_token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('ff_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('ff_user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('ff_user', JSON.stringify(res.data.user));
      toast.success(`Account created! Welcome, ${res.data.user.name.split(' ')[0]}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ff_user');
    toast.success('Logged out successfully');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('ff_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

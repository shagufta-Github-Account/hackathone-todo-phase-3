import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
  email: string;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (token && savedEmail) {
      return { email: savedEmail, token };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.auth.login({ email, password }) as { access_token: string };
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('email', email);
      setUser({ email, token: response.access_token });
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      await api.auth.register({ email, password });
      return true;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  }, []);

  return { user, login, register, logout, loading, error, setError };
}

import { useState, useEffect } from 'react';
import backend from '~backend/client';

interface User {
  id: string;
  username: string;
  email: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user info
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      // This would be implemented when we have the actual auth endpoint
      // For now, we'll just check if token exists
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // This will need to be updated when we have the actual login endpoint
      // const response = await backend.users.login({ email, password });
      // For now, we'll simulate a successful login
      const mockResponse: AuthResponse = {
        user: {
          id: 'mock-user-id',
          username: 'mockuser',
          email: email,
          isAnonymous: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'mock-token'
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', mockResponse.token);
      
      // Set user state
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // This will need to be updated when we have the actual register endpoint
      // const response = await backend.users.register({ username, email, password });
      // For now, we'll simulate a successful registration
      const mockResponse: AuthResponse = {
        user: {
          id: 'mock-user-id',
          username: username,
          email: email,
          isAnonymous: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'mock-token'
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', mockResponse.token);
      
      // Set user state
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };
}
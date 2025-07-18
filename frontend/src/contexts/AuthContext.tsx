import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_ME, LOGOUT_USER } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const client = useApolloClient();

  const { data, loading, error, refetch } = useQuery(GET_ME, {
    errorPolicy: 'ignore',
  });

  const [logoutMutation] = useMutation(LOGOUT_USER);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    } else if (error) {
      setUser(null);
    }
  }, [data, error]);

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
      await client.clearStore();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refetchUser = async () => {
    try {
      const result = await refetch();
      if (result.data?.me) {
        setUser(result.data.me);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('refetch error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
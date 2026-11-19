"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

import { getAuthToken, performAutoLogin } from '@/@api/config/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Mesmo login (e mesmo endereço /api/auth/login) usado pelo resto do site.
      const ok = getAuthToken() !== null || (await performAutoLogin());
      setIsAuthenticated(ok);
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

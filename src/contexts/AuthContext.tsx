import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { login, register, signOut, onAuthStateChangedListener } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log("Auth state changed:", user ? user.email : null);
      setCurrentUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Logging in with email:", email);
      await login(email, password);
      console.log("Login successful, waiting for auth state to update...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log("Registering with email:", email);
      await register(email, password, name);
      console.log("Registration successful, waiting for auth state to update...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      console.log("Signing out...");
      await signOut();
      console.log("Sign out successful");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
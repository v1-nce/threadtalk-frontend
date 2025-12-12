"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signup, login, logout, getProfile } from '../lib/api';
import type { SignupRequest, LoginRequest, SignupResponse, LoginResponse, LogoutResponse, User } from '../lib/api';

interface AuthContext {
    user: User | null;
    loading: boolean;
    signup: (data: SignupRequest) => Promise<SignupResponse>;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<LogoutResponse>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeauth = async () => {
            try {
                const response = await getProfile()
                setUser(response);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeauth();
    }, []);

    const signupUser = async (data: SignupRequest): Promise<SignupResponse> => {
        try {
          const response = await signup(data);
          setUser(response.user);
          return response;
        } catch (err) {
          console.error(err);
          setUser(null);
          throw err;
        }
    };
    
    const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
        try {
          const response = await login(data);
          setUser(response.user);
          return response;
        } catch (err) {
          console.error(err);
          setUser(null);
          throw err;
        }
    };
    
    const logoutUser = async (): Promise<LogoutResponse> => {
        try {
          const response = await logout();
          setUser(null);
          return response;
        } catch(err) {
          console.error(err);
          throw err;
        };
    };

    return (
        <AuthContext.Provider
          value={{
            user,
            loading,
            signup: signupUser,
            login: loginUser,
            logout: logoutUser,
          }}
        >
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

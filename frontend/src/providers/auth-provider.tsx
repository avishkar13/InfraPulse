"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/api/client";
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_ME } from "@/api/endpoints";

interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, string>) => Promise<void>;
  register: (userData: Record<string, string>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await apiClient.get(AUTH_ME);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: Record<string, string>) => {
    const response = await apiClient.post(AUTH_LOGIN, credentials);
    const { access, refresh, user: userData } = response.data;
    
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    
    if (userData) {
        setUser(userData);
    } else {
        // If login doesn't return user data, fetch it
        const meResponse = await apiClient.get(AUTH_ME);
        setUser(meResponse.data);
    }
  };

  const register = async (userData: Record<string, string>) => {
    const response = await apiClient.post(AUTH_REGISTER, userData);
    const { access, refresh, user: newUserData } = response.data;
    
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    
    if (newUserData) {
        setUser(newUserData);
    } else {
        const meResponse = await apiClient.get(AUTH_ME);
        setUser(meResponse.data);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/auth/sign-in");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

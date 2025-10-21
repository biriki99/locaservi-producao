import React, { createContext, useContext, useState, useEffect } from "react";
import { MockUser, UserRole } from "@/types";
import { mockUsuarios } from "@/data/mockData";

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    // Carregar usuário do localStorage na inicialização
    const savedUser = localStorage.getItem("mockUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, _password: string): boolean => {
    // Mock login - aceita qualquer senha
    const foundUser = mockUsuarios.find((u) => u.email === email);
    
    if (foundUser) {
      const mockUser: MockUser = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        nome: foundUser.nome
      };
      
      setUser(mockUser);
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("mockUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

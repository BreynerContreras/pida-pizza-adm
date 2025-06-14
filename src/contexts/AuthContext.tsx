
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  {
    id: '1',
    username: 'Contadora',
    password: '12345678',
    role: 'contadora',
    nombre: 'Contadora Principal',
    lastAccess: new Date().toISOString()
  },
  {
    id: '2',
    username: 'proveedor',
    password: '12345678',
    role: 'proveedor',
    nombre: 'Proveedor General',
    lastAccess: new Date().toISOString()
  },
  {
    id: '3',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    nombre: 'Administrador',
    lastAccess: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastAccess: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
      
      setUsers(updatedUsers);
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

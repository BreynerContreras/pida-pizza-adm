
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Usuarios por defecto del sistema
  const defaultUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      nombre: 'Administrador Principal',
      email: 'admin@pidapizza.com',
      telefono: '+507 6000-0000'
    },
    {
      id: '2',
      username: 'contadora',
      password: '12345678',
      role: 'contadora',
      nombre: 'María González',
      email: 'contadora@pidapizza.com',
      telefono: '+507 6000-0001'
    },
    {
      id: '3',
      username: 'proveedor',
      password: '12345678',
      role: 'gerente_operativo',
      nombre: 'Juan Pérez',
      nombreEmpresa: 'Distribuidora La Rosa',
      contacto: 'Juan Pérez',
      categoria: 'Carnes y Embutidos',
      telefono: '+507 6000-0002',
      email: 'juan@distribuidoralarosa.com',
      direccion: 'Calle 50, Ciudad de Panamá',
      rif: 'J-12345678-9'
    }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    
    // Initialize users in localStorage if they don't exist
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const savedUsers = localStorage.getItem('users');
    const allUsers = savedUsers ? JSON.parse(savedUsers) : defaultUsers;
    const foundUser = allUsers.find((u: User) => u.username === username && u.password === password);
    
    if (foundUser) {
      const updatedUser = { ...foundUser, lastAccess: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('authenticate_user', {
        input_username: username,
        input_password: password
      });

      if (error || !data || data.length === 0) {
        return false;
      }

      const userData = data[0];
      const user: User = {
        id: userData.user_id,
        username: userData.username,
        password: '', // No almacenamos la contraseña en el frontend
        role: userData.role as 'contadora' | 'gerente_operativo' | 'admin',
        nombre: userData.nombre,
        telefono: userData.telefono,
        email: userData.email,
        direccion: userData.direccion,
        rif: userData.rif,
        nombreEmpresa: userData.nombre_empresa,
        contacto: userData.contacto,
        categoria: userData.categoria,
        lastAccess: new Date().toISOString()
      };

      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
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

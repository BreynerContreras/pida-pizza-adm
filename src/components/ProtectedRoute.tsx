
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);

  // Si no está autenticado, no debería llegar aquí por la lógica en App.tsx
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - redirecting to login');
    return null;
  }

  // Si no hay roles especificados, permitir acceso
  if (!allowedRoles) {
    return <>{children}</>;
  }

  // Verificar si el usuario tiene el rol permitido
  if (!allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - access denied for role:', user.role);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <p className="text-sm text-gray-500">Tu rol: {user.role}</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - access granted');
  return <>{children}</>;
};

export default ProtectedRoute;

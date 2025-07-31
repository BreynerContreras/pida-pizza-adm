
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import FacturasPagadas from "./pages/FacturasPagadas";
import Proveedores from "./pages/Proveedores";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('AppContent - isAuthenticated:', isAuthenticated);
  console.log('AppContent - user:', user);

  const getDefaultRoute = () => {
    console.log('Getting default route for user role:', user?.role);
    if (user?.role === 'admin') return '/inicio';
    if (user?.role === 'contadora') return '/inicio';
    if (user?.role === 'gerente_operativo') return '/facturas';
    return '/facturas';
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="/inicio" element={
            <ProtectedRoute allowedRoles={['admin', 'contadora']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/facturas" element={
            <ProtectedRoute allowedRoles={['contadora', 'gerente_operativo', 'admin']}>
              <Layout>
                <Facturas />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/facturas-pagadas" element={
            <ProtectedRoute allowedRoles={['contadora', 'admin']}>
              <Layout>
                <FacturasPagadas />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/proveedores" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Proveedores />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Usuarios />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

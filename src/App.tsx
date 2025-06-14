
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Proveedores from "./pages/Proveedores";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/facturas" element={
              <ProtectedRoute allowedRoles={['contadora', 'proveedor', 'admin']}>
                <Layout>
                  <Facturas />
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
            <Route path="/reportes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Módulo de Reportes</h2>
                    <p className="text-gray-600 mt-2">Próximamente disponible</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/configuracion" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
                    <p className="text-gray-600 mt-2">Próximamente disponible</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

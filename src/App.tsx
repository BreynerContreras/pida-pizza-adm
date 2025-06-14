
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Proveedores from "./pages/Proveedores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/proveedores" element={<Proveedores />} />
            {/* Rutas adicionales que se pueden implementar */}
            <Route path="/reportes" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Módulo de Reportes</h2><p className="text-gray-600 mt-2">Próximamente disponible</p></div>} />
            <Route path="/analytics" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Módulo de Analytics</h2><p className="text-gray-600 mt-2">Próximamente disponible</p></div>} />
            <Route path="/usuarios" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Gestión de Usuarios</h2><p className="text-gray-600 mt-2">Próximamente disponible</p></div>} />
            <Route path="/configuracion" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold">Configuración del Sistema</h2><p className="text-gray-600 mt-2">Próximamente disponible</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


export interface User {
  id: string;
  username: string;
  password: string;
  role: 'contadora' | 'gerente_operativo' | 'admin';
  nombre?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  rif?: string;
  lastAccess?: string;
  // Campos específicos para gerente operativo
  nombreEmpresa?: string;
  contacto?: string;
  categoria?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Factura {
  id: string;
  numeroFactura: string;
  monto: number;
  fecha: string;
  nombreEmpresa: string;
  proveedor: string;
  imagenes?: string[];
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  createdBy?: string; // ID del usuario que creó la factura
}

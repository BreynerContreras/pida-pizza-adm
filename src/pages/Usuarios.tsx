
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Building2,
  Calendar,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User as UserType } from '../types/auth';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SeleccionarRolModal from '../components/usuarios/SeleccionarRolModal';
import NuevoUsuarioModal from '../components/usuarios/NuevoUsuarioModal';
import VerDetallesUsuarioModal from '../components/usuarios/VerDetallesUsuarioModal';
import EditarUsuarioModal from '../components/usuarios/EditarUsuarioModal';

const Usuarios = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'contadora' | 'gerente_operativo' | 'admin'>('gerente_operativo');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios.",
          variant: "destructive"
        });
        return;
      }

      const mappedUsers: UserType[] = data.map(profile => ({
        id: profile.user_id,
        username: profile.username,
        password: '', // No mostramos contraseñas
        role: profile.role as 'contadora' | 'gerente_operativo' | 'admin',
        nombre: profile.nombre,
        telefono: profile.telefono,
        email: profile.email,
        direccion: profile.direccion,
        rif: profile.rif,
        nombreEmpresa: profile.nombre_empresa,
        contacto: profile.contacto,
        categoria: profile.categoria,
        lastAccess: profile.updated_at
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar los usuarios.",
        variant: "destructive"
      });
    }
  };

  const handleRoleSelected = (role: 'contadora' | 'gerente_operativo' | 'admin') => {
    setSelectedRole(role);
    setIsRoleSelectionOpen(false);
    setIsNewUserModalOpen(true);
  };

  const handleSaveUser = async (userData: Omit<UserType, 'id' | 'lastAccess'>) => {
    // El usuario ya se creó en la base de datos desde el modal
    // Solo necesitamos refrescar la lista
    await fetchUsers();
    
    toast({
      title: "Usuario creado",
      description: `El ${getRoleTitle(userData.role)} ha sido creado exitosamente.`,
    });
  };

  const handleEditUser = async (editedUser: UserType) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editedUser.username,
          nombre: editedUser.nombre,
          telefono: editedUser.telefono,
          email: editedUser.email,
          direccion: editedUser.direccion,
          rif: editedUser.rif,
          nombre_empresa: editedUser.nombreEmpresa,
          contacto: editedUser.contacto,
          categoria: editedUser.categoria
        })
        .eq('user_id', editedUser.id);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el usuario.",
          variant: "destructive"
        });
        return;
      }

      await fetchUsers();
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al actualizar el usuario.",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario.",
          variant: "destructive"
        });
        return;
      }

      await fetchUsers();
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al eliminar el usuario.",
        variant: "destructive"
      });
    }
  };

  const openDetailsModal = (user: UserType) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contadora': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'gerente_operativo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'contadora': return 'Contador/a';
      case 'gerente_operativo': return 'Gerente Operativo';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsRoleSelectionOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Total de usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.nombre || user.username}</CardTitle>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    {user.role === 'gerente_operativo' && user.nombreEmpresa && (
                      <p className="text-sm text-green-600 font-medium">{user.nombreEmpresa}</p>
                    )}
                  </div>
                </div>
                <Badge className={getRoleColor(user.role)} variant="outline">
                  {getRoleTitle(user.role)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {user.telefono && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.telefono}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                )}
                {user.direccion && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.direccion}</span>
                  </div>
                )}
                {user.rif && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">RIF: {user.rif}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm pt-4 border-t border-gray-100">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Último acceso: {user.lastAccess ? formatDate(user.lastAccess) : 'Nunca'}
                </span>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openDetailsModal(user)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openEditModal(user)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                {user.role !== 'admin' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El usuario "{user.nombre || user.username}" será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteUser(user.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-600">Comienza agregando un nuevo usuario al sistema.</p>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <SeleccionarRolModal
        isOpen={isRoleSelectionOpen}
        onClose={() => setIsRoleSelectionOpen(false)}
        onRoleSelected={handleRoleSelected}
      />

      <NuevoUsuarioModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSave={handleSaveUser}
        role={selectedRole}
      />

      <VerDetallesUsuarioModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        usuario={selectedUser}
      />

      <EditarUsuarioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        usuario={selectedUser}
        onSave={handleEditUser}
      />
    </div>
  );
};

export default Usuarios;


import React from 'react';
import {
  Building2,
  FileText,
  Home,
  Users,
  PizzaIcon,
  CheckCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'contadora') {
      return [
        {
          title: "Facturas",
          url: "/facturas",
          icon: FileText,
        },
        {
          title: "Facturas Pagadas",
          url: "/facturas-pagadas",
          icon: CheckCircle,
        }
      ];
    }

    if (user?.role === 'proveedor') {
      return [
        {
          title: "Mis Facturas",
          url: "/facturas",
          icon: FileText,
        }
      ];
    }

    if (user?.role === 'admin') {
      return [
        {
          title: "Inicio",
          url: "/",
          icon: Home,
        },
        {
          title: "Facturas",
          url: "/facturas",
          icon: FileText,
        },
        {
          title: "Facturas Pagadas",
          url: "/facturas-pagadas",
          icon: CheckCircle,
        },
        {
          title: "Gerentes Operativos",
          url: "/proveedores",
          icon: Building2,
        }
      ];
    }

    return [];
  };

  const getAdminItems = () => {
    if (user?.role !== 'admin') return [];
    
    return [
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: Users,
      }
    ];
  };

  const menuItems = getMenuItems();
  const adminItems = getAdminItems();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <PizzaIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pida Pizza</h2>
            <p className="text-sm text-gray-600">Portal de Facturas</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-semibold mb-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full justify-start gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-semibold mb-2">
              Administración
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className="w-full justify-start gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.nombre || user?.username}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

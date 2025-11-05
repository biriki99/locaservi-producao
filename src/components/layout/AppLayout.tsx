import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceType } from "@/hooks/use-device-type";

export const AppLayout = () => {
  const { user, userRole, userStatus, loading } = useAuth();
  const { isMobile } = useDeviceType();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Rotas permitidas para usuário comum
  const commonUserRoutes = ["/dashboard", "/clientes", "/leads", "/servicos", "/alertas", "/relatorios", "/configuracoes"];
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userStatus === "inativo") {
    return <Navigate to="/inativo" replace />;
  }

  if (userRole === "nenhum") {
    return <Navigate to="/pendente" replace />;
  }

  // Verificar se usuário comum está tentando acessar rota restrita
  if (userRole === "user_comum" && !commonUserRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar com lógica mobile */}
      <div className={`
        ${isMobile ? 'fixed z-50 transition-transform' : 'relative'}
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className={`flex flex-1 flex-col ${!isMobile && 'pl-64'}`}>
        <Topbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={isMobile}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

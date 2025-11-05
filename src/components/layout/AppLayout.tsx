import { useState, useEffect, useMemo } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDeviceType } from "@/hooks/use-device-type";

type SidebarState = 'open' | 'mini' | 'closed';

export const AppLayout = () => {
  const { user, userRole, userStatus, loading } = useAuth();
  const { isMobile, isTablet } = useDeviceType();
  const location = useLocation();
  
  // Estado da sidebar: open (256px), mini (64px), closed (0px)
  const [sidebarState, setSidebarState] = useState<SidebarState>(
    isMobile ? 'closed' : 'open'
  );

  // Ajustar estado da sidebar quando o tamanho da tela muda
  useEffect(() => {
    if (isMobile && sidebarState === 'open') {
      setSidebarState('closed');
    }
  }, [isMobile]);

  // IMPORTANTE: Calcular padding ANTES de qualquer retorno condicional
  const mainPadding = useMemo(() => {
    if (isMobile) return '';
    if (sidebarState === 'open') return 'pl-64';
    if (sidebarState === 'mini') return 'pl-16';
    return '';
  }, [isMobile, sidebarState]);

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

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarState(sidebarState === 'closed' ? 'open' : 'closed');
    } else {
      setSidebarState(sidebarState === 'open' ? 'mini' : 'open');
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Overlay para mobile quando sidebar está aberta */}
      {isMobile && sidebarState === 'open' && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarState('closed')}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        state={sidebarState}
        onClose={() => setSidebarState('closed')}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${mainPadding}`}>
        <Topbar 
          onMenuToggle={handleSidebarToggle}
          sidebarState={sidebarState}
        />
        <main className="flex-1 p-4 md:p-6 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

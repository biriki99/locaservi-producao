import { useState, useEffect, useMemo, useRef } from "react";
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

  // Estado de "pin" da sidebar (apenas para desktop)
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-pinned') === 'true';
    }
    return false;
  });

  // Referência para detectar mudança de dispositivo
  const prevIsMobileRef = useRef(isMobile);

  // Ajustar estado da sidebar quando o tamanho da tela muda
  useEffect(() => {
    const prevIsMobile = prevIsMobileRef.current;
    
    // Apenas fecha quando MUDA de desktop para mobile (resize)
    if (!prevIsMobile && isMobile && sidebarState === 'open') {
      setSidebarState('closed');
    } 
    // Desktop com sidebar pinada deve estar sempre aberta
    else if (!isMobile && sidebarPinned && sidebarState !== 'open') {
      setSidebarState('open');
    }
    
    prevIsMobileRef.current = isMobile;
  }, [isMobile, sidebarPinned]);

  // Garantir que sidebar pinada sempre fica aberta no desktop
  useEffect(() => {
    if (!isMobile && sidebarPinned && sidebarState !== 'open') {
      setSidebarState('open');
    }
  }, [isMobile, sidebarPinned, sidebarState]);

  // IMPORTANTE: Calcular padding ANTES de qualquer retorno condicional
  const mainPadding = useMemo(() => {
    if (isMobile) return '';
    if (sidebarState === 'open') return 'pl-64';
    if (sidebarState === 'mini') return 'pl-16';
    return '';
  }, [isMobile, sidebarState]);

  // Rotas permitidas para usuário comum
  const commonUserRoutes = ["/dashboard", "/clientes", "/agendamentos", "/servicos", "/alertas", "/relatorios", "/configuracoes"];
  
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
      // Desktop: só permite minimizar se não estiver pinada
      if (!sidebarPinned) {
        setSidebarState(sidebarState === 'open' ? 'mini' : 'open');
      }
    }
  };

  const handlePinToggle = () => {
    const newPinned = !sidebarPinned;
    setSidebarPinned(newPinned);
    localStorage.setItem('sidebar-pinned', newPinned.toString());
    
    if (newPinned) {
      // Quando pina, força abrir
      setSidebarState('open');
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
        isPinned={sidebarPinned}
        onPinToggle={handlePinToggle}
      />

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${mainPadding}`}>
        <Topbar 
          onMenuToggle={handleSidebarToggle}
          sidebarState={sidebarState}
          sidebarPinned={sidebarPinned}
          isMobile={isMobile}
          onPinToggle={handlePinToggle}
        />
        <main className="flex-1 px-4 md:px-6 pb-4 md:pb-6 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

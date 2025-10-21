import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export const AppLayout = () => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Rotas permitidas para usuário comum
  const commonUserRoutes = ["/dashboard", "/clientes", "/leads", "/servicos", "/configuracoes"];
  
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

  if (userRole === "nenhum") {
    return <Navigate to="/pendente" replace />;
  }

  // Verificar se usuário comum está tentando acessar rota restrita
  if (userRole === "user_comum" && !commonUserRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

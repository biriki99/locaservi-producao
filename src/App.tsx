import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { InstallPWA } from "@/components/pwa/InstallPWA";
import { useDeviceType } from "@/hooks/use-device-type";
import Login from "./pages/Login";
import LoginCliente from "./pages/LoginCliente";
import Pendente from "./pages/Pendente";
import Inativo from "./pages/Inativo";
import NotFound from "./pages/NotFound";

// Lazy load das páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Categorias = lazy(() => import("./pages/Categorias"));
const Servicos = lazy(() => import("./pages/Servicos"));
const Leads = lazy(() => import("./pages/Leads"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const AlertasServicos = lazy(() => import("./pages/AlertasServicos"));

// Loading component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  const { isMobileDevice } = useDeviceType();

  return (
    <BrowserRouter>
      <InstallPWA />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={isMobileDevice ? <LoginCliente /> : <Login />} 
        />
        <Route path="/pendente" element={<Pendente />} />
        <Route path="/inativo" element={<Inativo />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/clientes" element={
            <Suspense fallback={<PageLoader />}>
              <Clientes />
            </Suspense>
          } />
          <Route path="/categorias" element={
            <Suspense fallback={<PageLoader />}>
              <Categorias />
            </Suspense>
          } />
          <Route path="/servicos" element={
            <Suspense fallback={<PageLoader />}>
              <Servicos />
            </Suspense>
          } />
          <Route path="/alertas" element={
            <Suspense fallback={<PageLoader />}>
              <AlertasServicos />
            </Suspense>
          } />
          <Route path="/leads" element={
            <Suspense fallback={<PageLoader />}>
              <Leads />
            </Suspense>
          } />
          <Route path="/relatorios" element={
            <Suspense fallback={<PageLoader />}>
              <Relatorios />
            </Suspense>
          } />
          <Route path="/usuarios" element={
            <Suspense fallback={<PageLoader />}>
              <Usuarios />
            </Suspense>
          } />
          <Route path="/configuracoes" element={
            <Suspense fallback={<PageLoader />}>
              <Configuracoes />
            </Suspense>
          } />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Pendente from "./pages/Pendente";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Categorias from "./pages/Categorias";
import Servicos from "./pages/Servicos";
import Leads from "./pages/Leads";
import Usuarios from "./pages/Usuarios";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pendente" element={<Pendente />} />
              
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

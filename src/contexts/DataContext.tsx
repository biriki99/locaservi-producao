import React, { createContext, useContext, useState } from "react";
import { Cliente, Categoria, Servico, Lead, Usuario, Filtros } from "@/types";
import { 
  mockClientes as initialClientes, 
  mockCategorias as initialCategorias,
  mockServicos as initialServicos,
  mockLeads as initialLeads,
  mockUsuarios as initialUsuarios
} from "@/data/mockData";

interface DataContextType {
  clientes: Cliente[];
  categorias: Categoria[];
  servicos: Servico[];
  leads: Lead[];
  usuarios: Usuario[];
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  addCategoria: (categoria: Categoria) => void;
  updateCategoria: (id: string, categoria: Partial<Categoria>) => void;
  deleteCategoria: (id: string) => void;
  addServico: (servico: Servico) => void;
  updateServico: (id: string, servico: Partial<Servico>) => void;
  deleteServico: (id: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [servicos, setServicos] = useState<Servico[]>(initialServicos);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [filtros, setFiltros] = useState<Filtros>({
    mes: "all",
    ano: "2024",
    categoria_id: "all"
  });

  // Clientes
  const addCliente = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
  };

  const updateCliente = (id: string, updatedData: Partial<Cliente>) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  // Categorias
  const addCategoria = (categoria: Categoria) => {
    setCategorias([...categorias, categoria]);
  };

  const updateCategoria = (id: string, updatedData: Partial<Categoria>) => {
    setCategorias(categorias.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCategoria = (id: string) => {
    setCategorias(categorias.filter(c => c.id !== id));
  };

  // Serviços
  const addServico = (servico: Servico) => {
    setServicos([...servicos, servico]);
  };

  const updateServico = (id: string, updatedData: Partial<Servico>) => {
    setServicos(servicos.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteServico = (id: string) => {
    setServicos(servicos.filter(s => s.id !== id));
  };

  // Leads
  const addLead = (lead: Lead) => {
    setLeads([...leads, lead]);
  };

  const updateLead = (id: string, updatedData: Partial<Lead>) => {
    setLeads(leads.map(l => l.id === id ? { ...l, ...updatedData } : l));
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id));
  };

  // Usuários
  const updateUsuario = (id: string, updatedData: Partial<Usuario>) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  return (
    <DataContext.Provider
      value={{
        clientes,
        categorias,
        servicos,
        leads,
        usuarios,
        filtros,
        setFiltros,
        addCliente,
        updateCliente,
        deleteCliente,
        addCategoria,
        updateCategoria,
        deleteCategoria,
        addServico,
        updateServico,
        deleteServico,
        addLead,
        updateLead,
        deleteLead,
        updateUsuario
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

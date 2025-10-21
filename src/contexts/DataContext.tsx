import React, { createContext, useContext, useState, useEffect } from "react";
import { Cliente, Categoria, Servico, Lead, Usuario, Filtros, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DataContextType {
  clientes: Cliente[];
  categorias: Categoria[];
  servicos: Servico[];
  leads: Lead[];
  usuarios: Usuario[];
  filtros: Filtros;
  loading: boolean;
  setFiltros: (filtros: Filtros) => void;
  addCliente: (cliente: Omit<Cliente, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  addCategoria: (categoria: Omit<Categoria, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateCategoria: (id: string, categoria: Partial<Categoria>) => Promise<void>;
  deleteCategoria: (id: string) => Promise<void>;
  addServico: (servico: Omit<Servico, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateServico: (id: string, servico: Partial<Servico>) => Promise<void>;
  deleteServico: (id: string) => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateUsuario: (id: string, role: string) => Promise<void>;
  deleteUsuario: (id: string) => Promise<void>;
  inactivateUsuario: (id: string, status: 'ativo' | 'inativo') => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userRole } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({
    mes: "all",
    ano: new Date().getFullYear().toString(),
    categoria_id: "all",
    cliente_id: "all",
    data_inicio: "",
    data_fim: ""
  });

  useEffect(() => {
    if (user && userRole && userRole !== 'nenhum') {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [user, userRole]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchClientes(),
        fetchCategorias(),
        fetchServicos(),
        fetchLeads(),
        fetchUsuarios()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return;
    }

    setClientes(data || []);
  };

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return;
    }

    setCategorias(data || []);
  };

  const fetchServicos = async () => {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços:', error);
      return;
    }

    setServicos(data || []);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return;
    }

    setLeads(data || []);
  };

  const fetchUsuarios = async () => {
    if (userRole !== 'admin') return;

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.error('Erro ao buscar roles:', rolesError);
      return;
    }

    const usuariosData = profiles?.map(profile => {
      const userRole = roles?.find(r => r.user_id === profile.id);
      const role: UserRole = (userRole?.role as UserRole) || 'nenhum';
      return {
        id: profile.id,
        email: profile.email,
        nome: profile.nome,
        role: role,
        status: (profile.status || 'ativo') as 'ativo' | 'pendente' | 'inativo',
        created_at: profile.created_at
      } as Usuario;
    }) || [];

    setUsuarios(usuariosData);
  };

  // CLIENTES
  const addCliente = async (cliente: Omit<Cliente, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase
      .from('clientes')
      .insert([{ ...cliente, user_id: user!.id }]);

    if (error) {
      toast.error('Erro ao criar cliente');
      throw error;
    }

    toast.success('Cliente criado com sucesso');
    await fetchClientes();
  };

  const updateCliente = async (id: string, updatedData: Partial<Cliente>) => {
    const { error } = await supabase
      .from('clientes')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar cliente');
      throw error;
    }

    toast.success('Cliente atualizado com sucesso');
    await fetchClientes();
  };

  const deleteCliente = async (id: string) => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar cliente');
      throw error;
    }

    toast.success('Cliente deletado com sucesso');
    await fetchClientes();
  };

  // CATEGORIAS
  const addCategoria = async (categoria: Omit<Categoria, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase
      .from('categorias')
      .insert([{ ...categoria, user_id: user!.id }]);

    if (error) {
      toast.error('Erro ao criar categoria');
      throw error;
    }

    toast.success('Categoria criada com sucesso');
    await fetchCategorias();
  };

  const updateCategoria = async (id: string, updatedData: Partial<Categoria>) => {
    const { error } = await supabase
      .from('categorias')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar categoria');
      throw error;
    }

    toast.success('Categoria atualizada com sucesso');
    await fetchCategorias();
  };

  const deleteCategoria = async (id: string) => {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar categoria');
      throw error;
    }

    toast.success('Categoria deletada com sucesso');
    await fetchCategorias();
  };

  // SERVICOS
  const addServico = async (servico: Omit<Servico, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase
      .from('servicos')
      .insert([{ ...servico, user_id: user!.id }]);

    if (error) {
      toast.error('Erro ao criar serviço');
      throw error;
    }

    toast.success('Serviço criado com sucesso');
    await fetchServicos();
  };

  const updateServico = async (id: string, updatedData: Partial<Servico>) => {
    const { error } = await supabase
      .from('servicos')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar serviço');
      throw error;
    }

    toast.success('Serviço atualizado com sucesso');
    await fetchServicos();
  };

  const deleteServico = async (id: string) => {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar serviço');
      throw error;
    }

    toast.success('Serviço deletado com sucesso');
    await fetchServicos();
  };

  // LEADS
  const addLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase
      .from('leads')
      .insert([{ ...lead, user_id: user!.id }]);

    if (error) {
      toast.error('Erro ao criar lead');
      throw error;
    }

    toast.success('Lead criado com sucesso');
    await fetchLeads();
  };

  const updateLead = async (id: string, updatedData: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar lead');
      throw error;
    }

    toast.success('Lead atualizado com sucesso');
    await fetchLeads();
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao deletar lead');
      throw error;
    }

    toast.success('Lead deletado com sucesso');
    await fetchLeads();
  };

  // USUARIOS
  const updateUsuario = async (id: string, role: string) => {
    // Deletar role antiga
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', id);

    // Inserir nova role
    const { error } = await supabase
      .from('user_roles')
      .insert([{ user_id: id, role: role as UserRole }]);

    if (error) {
      toast.error('Erro ao atualizar usuário');
      throw error;
    }

    toast.success('Usuário atualizado com sucesso');
    await fetchUsuarios();
  };

  const deleteUsuario = async (id: string) => {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      toast.error('Erro ao deletar usuário');
      throw profileError;
    }

    toast.success('Usuário deletado com sucesso');
    await fetchUsuarios();
  };

  const inactivateUsuario = async (id: string, status: 'ativo' | 'inativo') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar status do usuário');
      throw error;
    }

    toast.success(`Usuário ${status === 'ativo' ? 'ativado' : 'inativado'} com sucesso`);
    await fetchUsuarios();
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
        loading,
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
        updateUsuario,
        deleteUsuario,
        inactivateUsuario,
        refreshData
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

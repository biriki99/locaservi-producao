export type UserRole = "admin" | "user_comum" | "nenhum";

export interface MockUser {
  id: string;
  email: string;
  role: UserRole;
  nome: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cpf_cnpj: string;
  endereco: string;
  observacoes: string;
  created_at: string;
  user_id: string;
}

export interface Categoria {
  id: string;
  nome_maquina: string;
  observacao: string;
  created_at: string;
  user_id: string;
}

export interface Servico {
  id: string;
  user_id: string;
  cliente_id: string;
  maquina_id: string;
  titulo_servico: string;
  descricao: string;
  valor: number;
  status: "concluido" | "pendente" | "cancelado";
  status_cobranca: "pago" | "a_receber";
  forma_pagamento: "dinheiro" | "pix" | "cartao" | "boleto" | "a_receber";
  data_inicio: string;
  data_fim: string;
  observacoes: string;
  created_at: string;
}

export interface Agendamento {
  id: string;
  user_id: string;
  cliente_id: string;
  titulo: string;
  descricao: string;
  status: "reservado_maquina" | "agendado_pagamento" | "confirmado" | "em_andamento" | "cancelado";
  data_agendamento: string;
  observacoes: string;
  created_at: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  status: "ativo" | "pendente" | "inativo";
  created_at: string;
}

export interface Filtros {
  mes: string;
  ano: string;
  categoria_id: string;
  cliente_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

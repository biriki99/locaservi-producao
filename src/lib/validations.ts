import { z } from "zod";

// Cliente validation schema
export const clienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .optional()
    .or(z.literal("")),
  telefone: z
    .string()
    .trim()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .optional()
    .or(z.literal("")),
  cpf_cnpj: z
    .string()
    .trim()
    .max(18, "CPF/CNPJ deve ter no máximo 18 caracteres")
    .optional()
    .or(z.literal("")),
  endereco: z
    .string()
    .trim()
    .max(500, "Endereço deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  observacoes: z
    .string()
    .trim()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

// Categoria validation schema
export const categoriaSchema = z.object({
  nome_maquina: z
    .string()
    .trim()
    .min(1, "Nome da máquina é obrigatório")
    .max(100, "Nome da máquina deve ter no máximo 100 caracteres"),
  observacao: z
    .string()
    .trim()
    .max(1000, "Observação deve ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

// Serviço validation schema
export const servicoSchema = z.object({
  cliente_id: z
    .string()
    .uuid("Cliente inválido")
    .min(1, "Cliente é obrigatório"),
  maquina_id: z
    .string()
    .uuid("Máquina inválida")
    .min(1, "Máquina é obrigatória"),
  titulo_servico: z
    .string()
    .trim()
    .max(200, "Título deve ter no máximo 200 caracteres")
    .optional()
    .or(z.literal("")),
  descricao: z
    .string()
    .trim()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
  valor: z
    .number()
    .min(0, "Valor deve ser maior ou igual a zero")
    .max(9999999.99, "Valor deve ser menor que 10 milhões"),
  status: z.enum(["pendente", "concluido", "cancelado"]),
  status_cobranca: z.enum(["a_receber", "pago"]),
  forma_pagamento: z.enum(["a_receber", "dinheiro", "pix", "cartao", "boleto"]),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_fim: z.string().min(1, "Data de fim é obrigatória"),
  observacoes: z
    .string()
    .trim()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
}).refine((data) => {
  // Validate that data_fim is not before data_inicio
  if (data.data_inicio && data.data_fim) {
    return new Date(data.data_fim) >= new Date(data.data_inicio);
  }
  return true;
}, {
  message: "Data de fim deve ser posterior à data de início",
  path: ["data_fim"],
});

// Lead validation schema
export const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  telefone: z
    .string()
    .trim()
    .min(1, "Telefone é obrigatório")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .optional()
    .or(z.literal("")),
  interesse: z
    .string()
    .trim()
    .min(1, "Interesse é obrigatório")
    .max(200, "Interesse deve ter no máximo 200 caracteres"),
  status: z.enum(["novo", "contato_feito", "negociacao", "convertido", "perdido"]).optional(),
  observacoes: z
    .string()
    .trim()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
});

// Signup validation schema
export const signupSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
});

export type TipoRelatorio = 'servicos' | 'clientes' | 'categorias';

export interface FiltrosServicos {
  cliente_id?: string;
  status_cobranca?: 'pago' | 'a_receber' | 'all';
  forma_pagamento?: 'dinheiro' | 'pix' | 'cartao' | 'boleto' | 'a_receber' | 'all';
  data_inicio?: string;
  data_fim?: string;
  categoria_id?: string;
  somar_valores: boolean;
  exibir_descricao: boolean;
  campos_selecionados: CampoServico[];
}

export type CampoServico = 
  | 'titulo_servico'
  | 'cliente'
  | 'categoria'
  | 'data_inicio'
  | 'data_fim'
  | 'valor'
  | 'status'
  | 'status_cobranca'
  | 'forma_pagamento'
  | 'descricao'
  | 'observacoes';

export interface FiltrosClientes {
  nome_cliente?: string;
  campos_servicos: CampoServicoCliente[];
}

export type CampoServicoCliente =
  | 'data_inicio'
  | 'data_fim'
  | 'valor'
  | 'categoria'
  | 'descricao'
  | 'status'
  | 'status_cobranca';

export interface FiltrosCategorias {
  data_inicio?: string;
  data_fim?: string;
  status_cobranca?: 'pago' | 'a_receber' | 'all';
}

export interface ResultadoRelatorioServico {
  id: string;
  titulo_servico?: string;
  cliente?: string;
  categoria?: string;
  data_inicio?: string;
  data_fim?: string;
  valor?: number;
  status?: string;
  status_cobranca?: string;
  forma_pagamento?: string;
  descricao?: string;
  observacoes?: string;
}

export interface ResultadoRelatorioCliente {
  cliente: string;
  servicos: Array<{
    data_inicio?: string;
    data_fim?: string;
    valor?: number;
    categoria?: string;
    descricao?: string;
    status?: string;
    status_cobranca?: string;
  }>;
}

export interface ResultadoRelatorioCategoria {
  categoria: string;
  quantidade_servicos: number;
  total_valor: number;
}

import { Cliente, Categoria, Servico, Agendamento, Usuario } from "@/types";

export const mockClientes: Cliente[] = [
  {
    id: "cliente-1",
    nome: "Construtora Silva & Cia",
    telefone: "+55 11 99999-0001",
    email: "contato@silvaecia.com.br",
    cpf_cnpj: "12.345.678/0001-99",
    endereco: "Av. Paulista, 1500 - São Paulo, SP",
    observacoes: "Cliente VIP - Parceiro há 5 anos",
    created_at: "2024-01-15T10:00:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-2",
    nome: "Engenharia Costa",
    telefone: "+55 11 98888-0002",
    email: "engenharia@costa.com.br",
    cpf_cnpj: "23.456.789/0001-88",
    endereco: "Rua Oscar Freire, 320 - São Paulo, SP",
    observacoes: "Preferência por pagamento via PIX",
    created_at: "2024-02-20T14:30:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-3",
    nome: "Obras Rápidas Ltda",
    telefone: "+55 11 97777-0003",
    email: "contato@obrasrapidas.com.br",
    cpf_cnpj: "34.567.890/0001-77",
    endereco: "Av. Faria Lima, 2500 - São Paulo, SP",
    observacoes: "Solicita nota fiscal antecipada",
    created_at: "2024-03-10T09:15:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-4",
    nome: "João Pedro Reformas",
    telefone: "+55 11 96666-0004",
    email: "jp@reformas.com",
    cpf_cnpj: "123.456.789-00",
    endereco: "Rua Augusta, 800 - São Paulo, SP",
    observacoes: "Autônomo - Pagamento em dinheiro",
    created_at: "2024-04-05T11:20:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-5",
    nome: "Construtora Horizonte",
    telefone: "+55 11 95555-0005",
    email: "horizonte@construcoes.com.br",
    cpf_cnpj: "45.678.901/0001-66",
    endereco: "Av. Brigadeiro Faria Lima, 1800 - São Paulo, SP",
    observacoes: "Grande cliente - Obras em múltiplos estados",
    created_at: "2024-05-12T08:45:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-6",
    nome: "Reforma Fácil",
    telefone: "+55 11 94444-0006",
    email: "contato@reformafacil.com.br",
    cpf_cnpj: "56.789.012/0001-55",
    endereco: "Rua da Consolação, 1200 - São Paulo, SP",
    observacoes: "Aluguéis de curta duração",
    created_at: "2024-06-08T13:10:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-7",
    nome: "Maria Santos - MEI",
    telefone: "+55 11 93333-0007",
    email: "maria.santos@email.com",
    cpf_cnpj: "234.567.890-11",
    endereco: "Rua Haddock Lobo, 500 - São Paulo, SP",
    observacoes: "Microempreendedora - Parcelamento preferencial",
    created_at: "2024-07-22T16:30:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-8",
    nome: "Construtora Mega Obras",
    telefone: "+55 11 92222-0008",
    email: "financeiro@megaobras.com.br",
    cpf_cnpj: "67.890.123/0001-44",
    endereco: "Av. Rebouças, 3000 - São Paulo, SP",
    observacoes: "Contrato anual - Desconto especial",
    created_at: "2024-08-15T10:00:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-9",
    nome: "Arquitetura e Design Ltda",
    telefone: "+55 11 91111-0009",
    email: "projetos@arquiteturadesign.com",
    cpf_cnpj: "78.901.234/0001-33",
    endereco: "Rua Estados Unidos, 1500 - São Paulo, SP",
    observacoes: "Parceiro comercial - Indicações frequentes",
    created_at: "2024-09-03T14:20:00Z",
    user_id: "user-123"
  },
  {
    id: "cliente-10",
    nome: "Ricardo Almeida Construções",
    telefone: "+55 11 90000-0010",
    email: "ricardo@almeidaconstrucoes.com.br",
    cpf_cnpj: "345.678.901-22",
    endereco: "Av. Paulista, 2300 - São Paulo, SP",
    observacoes: "Cliente pontual - Sem restrições",
    created_at: "2024-09-20T09:30:00Z",
    user_id: "user-123"
  }
];

export const mockCategorias: Categoria[] = [
  {
    id: "cat-1",
    nome_maquina: "Betoneira 200L",
    observacao: "Motor trifásico 220V - Ideal para grandes volumes",
    created_at: "2024-01-10T10:00:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-2",
    nome_maquina: "Furadeira de Impacto",
    observacao: "Profissional - 850W",
    created_at: "2024-01-10T10:05:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-3",
    nome_maquina: "Serra Circular",
    observacao: "1500W - Corte até 70mm",
    created_at: "2024-01-10T10:10:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-4",
    nome_maquina: "Andaime Metálico 4m",
    observacao: "Capacidade 200kg - Conjunto completo",
    created_at: "2024-01-10T10:15:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-5",
    nome_maquina: "Compressor de Ar",
    observacao: "50L - 2HP",
    created_at: "2024-01-10T10:20:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-6",
    nome_maquina: "Martelete Perfurador",
    observacao: "1100W - SDS-Plus",
    created_at: "2024-01-10T10:25:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-7",
    nome_maquina: "Escada Extensível 6m",
    observacao: "Alumínio - 120kg",
    created_at: "2024-01-10T10:30:00Z",
    user_id: "user-123"
  },
  {
    id: "cat-8",
    nome_maquina: "Gerador de Energia 5KVA",
    observacao: "Diesel - Silencioso",
    created_at: "2024-01-10T10:35:00Z",
    user_id: "user-123"
  }
];

export const mockServicos: Servico[] = [
  {
    id: "svc-1",
    user_id: "user-123",
    cliente_id: "cliente-1",
    maquina_id: "cat-1",
    titulo_servico: "Aluguel Betoneira - Obra Shopping Zona Sul",
    descricao: "Aluguel de betoneira 200L para obra de fundação",
    valor: 1200.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "pix",
    data_inicio: "2024-09-01",
    data_fim: "2024-09-05",
    observacoes: "Cliente satisfeito - Renovou contrato",
    created_at: "2024-08-28T09:00:00Z",
    nfe_emitido: true
  },
  {
    id: "svc-2",
    user_id: "user-123",
    cliente_id: "cliente-2",
    maquina_id: "cat-4",
    titulo_servico: "Locação Andaime - Reforma Prédio Comercial",
    descricao: "Andaime metálico 4m para pintura externa",
    valor: 800.00,
    status: "pendente",
    status_cobranca: "a_receber",
    forma_pagamento: "a_receber",
    data_inicio: "2024-10-15",
    data_fim: "2024-10-20",
    observacoes: "Aguardando confirmação de data",
    created_at: "2024-10-10T14:30:00Z",
    nfe_emitido: false
  },
  {
    id: "svc-3",
    user_id: "user-123",
    cliente_id: "cliente-3",
    maquina_id: "cat-8",
    titulo_servico: "Gerador - Evento Corporativo",
    descricao: "Gerador 5KVA para evento noturno",
    valor: 1500.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "cartao",
    data_inicio: "2024-09-20",
    data_fim: "2024-09-21",
    observacoes: "Entrega e retirada noturna",
    created_at: "2024-09-15T11:20:00Z",
    nfe_emitido: true
  },
  {
    id: "svc-4",
    user_id: "user-123",
    cliente_id: "cliente-5",
    maquina_id: "cat-1",
    titulo_servico: "Betoneira - Obra Residencial",
    descricao: "Locação mensal betoneira para construção casa",
    valor: 3200.00,
    status: "pendente",
    status_cobranca: "a_receber",
    forma_pagamento: "a_receber",
    data_inicio: "2024-10-01",
    data_fim: "2024-10-31",
    observacoes: "Contrato mensal renovável",
    created_at: "2024-09-25T08:45:00Z",
    nfe_emitido: false
  },
  {
    id: "svc-5",
    user_id: "user-123",
    cliente_id: "cliente-4",
    maquina_id: "cat-2",
    titulo_servico: "Furadeira - Instalação Elétrica",
    descricao: "Aluguel furadeira de impacto por 3 dias",
    valor: 180.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "dinheiro",
    data_inicio: "2024-09-10",
    data_fim: "2024-09-13",
    observacoes: "Pagamento na retirada",
    created_at: "2024-09-08T13:10:00Z",
    nfe_emitido: false
  },
  {
    id: "svc-6",
    user_id: "user-123",
    cliente_id: "cliente-8",
    maquina_id: "cat-5",
    titulo_servico: "Compressor - Pintura Industrial",
    descricao: "Compressor 50L para pintura de galpão",
    valor: 950.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "boleto",
    data_inicio: "2024-08-15",
    data_fim: "2024-08-22",
    observacoes: "Empresa parceira - Desconto aplicado",
    created_at: "2024-08-10T10:00:00Z",
    nfe_emitido: true
  },
  {
    id: "svc-7",
    user_id: "user-123",
    cliente_id: "cliente-6",
    maquina_id: "cat-3",
    titulo_servico: "Serra Circular - Corte de Madeira",
    descricao: "Aluguel serra circular para deck",
    valor: 320.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "pix",
    data_inicio: "2024-09-05",
    data_fim: "2024-09-08",
    observacoes: "Equipamento devolvido em perfeito estado",
    created_at: "2024-09-03T16:30:00Z",
    nfe_emitido: true
  },
  {
    id: "svc-8",
    user_id: "user-123",
    cliente_id: "cliente-7",
    maquina_id: "cat-6",
    titulo_servico: "Martelete - Demolição Parede",
    descricao: "Martelete para demolição parcial",
    valor: 280.00,
    status: "pendente",
    status_cobranca: "a_receber",
    forma_pagamento: "a_receber",
    data_inicio: "2024-10-18",
    data_fim: "2024-10-19",
    observacoes: "Cliente MEI - Parcelamento 2x",
    created_at: "2024-10-14T14:20:00Z",
    nfe_emitido: false
  },
  {
    id: "svc-9",
    user_id: "user-123",
    cliente_id: "cliente-9",
    maquina_id: "cat-7",
    titulo_servico: "Escada - Instalação Luminária",
    descricao: "Escada extensível para obra de iluminação",
    valor: 150.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "pix",
    data_inicio: "2024-09-25",
    data_fim: "2024-09-26",
    observacoes: "Serviço rápido - 1 dia útil",
    created_at: "2024-09-24T09:30:00Z",
    nfe_emitido: false
  },
  {
    id: "svc-10",
    user_id: "user-123",
    cliente_id: "cliente-10",
    maquina_id: "cat-4",
    titulo_servico: "Andaime - Manutenção Fachada",
    descricao: "Andaime para limpeza e pintura externa",
    valor: 1100.00,
    status: "concluido",
    status_cobranca: "pago",
    forma_pagamento: "cartao",
    data_inicio: "2024-09-28",
    data_fim: "2024-10-05",
    observacoes: "Cliente pontual - Sem pendências",
    created_at: "2024-09-26T11:00:00Z",
    nfe_emitido: true
  }
];


export const mockUsuarios: Usuario[] = [
  {
    id: "user-123",
    email: "admin@locaservi.com.br",
    nome: "Administrador Sistema",
    role: "admin",
    status: "ativo",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "user-456",
    email: "usuario@locaservi.com.br",
    nome: "Usuário Comum",
    role: "user_comum",
    status: "ativo",
    created_at: "2024-02-15T10:00:00Z"
  },
  {
    id: "user-789",
    email: "pendente@locaservi.com.br",
    nome: "Usuário Pendente",
    role: "nenhum",
    status: "pendente",
    created_at: "2024-10-10T14:30:00Z"
  },
  {
    id: "user-101",
    email: "joao.silva@locaservi.com.br",
    nome: "João Silva",
    role: "user_comum",
    status: "ativo",
    created_at: "2024-03-20T09:15:00Z"
  },
  {
    id: "user-102",
    email: "maria.santos@locaservi.com.br",
    nome: "Maria Santos",
    role: "nenhum",
    status: "pendente",
    created_at: "2024-10-12T11:20:00Z"
  }
];

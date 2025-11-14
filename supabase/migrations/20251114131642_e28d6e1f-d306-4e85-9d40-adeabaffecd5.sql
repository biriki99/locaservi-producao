-- Criar tabela agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'reservado_maquina',
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX idx_agendamentos_cliente_id ON public.agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data_agendamento);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON public.agendamentos
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar seus próprios agendamentos"
  ON public.agendamentos
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos"
  ON public.agendamentos
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar seus próprios agendamentos"
  ON public.agendamentos
  FOR DELETE
  USING (user_id = auth.uid());
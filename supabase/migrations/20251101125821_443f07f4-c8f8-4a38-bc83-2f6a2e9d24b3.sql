-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user_comum', 'nenhum');

-- Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('ativo', 'pendente', 'inativo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Habilitar RLS em user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar role (SECURITY DEFINER para evitar recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Criar função para popular profiles automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    'pendente'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'nenhum');
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Criar tabela de clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  endereco TEXT,
  observacoes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Criar tabela de categorias
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_maquina TEXT NOT NULL,
  observacao TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em categorias
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Criar tabela de serviços
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  maquina_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  titulo_servico TEXT NOT NULL,
  descricao TEXT,
  valor NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('concluido', 'pendente', 'cancelado')),
  status_cobranca TEXT NOT NULL DEFAULT 'a_receber' CHECK (status_cobranca IN ('pago', 'a_receber')),
  forma_pagamento TEXT NOT NULL DEFAULT 'a_receber' CHECK (forma_pagamento IN ('dinheiro', 'pix', 'cartao', 'boleto', 'a_receber')),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em servicos
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- Criar tabela de leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  interesse TEXT,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contato_feito', 'negociacao', 'convertido', 'perdido')),
  observacoes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLICIES RLS PARA PROFILES
-- ========================================

-- Usuários autenticados podem ver todos os perfis
CREATE POLICY "Usuários autenticados podem ver perfis"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Apenas admins podem atualizar perfis
CREATE POLICY "Admins podem atualizar perfis"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- POLICIES RLS PARA USER_ROLES
-- ========================================

-- Usuários podem ver suas próprias roles
CREATE POLICY "Usuários podem ver suas próprias roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem inserir roles
CREATE POLICY "Admins podem inserir roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem atualizar roles
CREATE POLICY "Admins podem atualizar roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem deletar roles
CREATE POLICY "Admins podem deletar roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- POLICIES RLS PARA CLIENTES
-- ========================================

-- Usuários podem ver seus próprios clientes
CREATE POLICY "Usuários podem ver seus próprios clientes"
ON public.clientes
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem criar seus próprios clientes
CREATE POLICY "Usuários podem criar seus próprios clientes"
ON public.clientes
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar seus próprios clientes
CREATE POLICY "Usuários podem atualizar seus próprios clientes"
ON public.clientes
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem deletar seus próprios clientes
CREATE POLICY "Usuários podem deletar seus próprios clientes"
ON public.clientes
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- POLICIES RLS PARA CATEGORIAS
-- ========================================

-- Usuários podem ver suas próprias categorias
CREATE POLICY "Usuários podem ver suas próprias categorias"
ON public.categorias
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem criar suas próprias categorias
CREATE POLICY "Usuários podem criar suas próprias categorias"
ON public.categorias
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar suas próprias categorias
CREATE POLICY "Usuários podem atualizar suas próprias categorias"
ON public.categorias
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem deletar suas próprias categorias
CREATE POLICY "Usuários podem deletar suas próprias categorias"
ON public.categorias
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- POLICIES RLS PARA SERVICOS
-- ========================================

-- Usuários podem ver seus próprios serviços
CREATE POLICY "Usuários podem ver seus próprios serviços"
ON public.servicos
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem criar seus próprios serviços
CREATE POLICY "Usuários podem criar seus próprios serviços"
ON public.servicos
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar seus próprios serviços
CREATE POLICY "Usuários podem atualizar seus próprios serviços"
ON public.servicos
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem deletar seus próprios serviços
CREATE POLICY "Usuários podem deletar seus próprios serviços"
ON public.servicos
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- POLICIES RLS PARA LEADS
-- ========================================

-- Usuários podem ver seus próprios leads
CREATE POLICY "Usuários podem ver seus próprios leads"
ON public.leads
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem criar seus próprios leads
CREATE POLICY "Usuários podem criar seus próprios leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar seus próprios leads
CREATE POLICY "Usuários podem atualizar seus próprios leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Usuários podem deletar seus próprios leads
CREATE POLICY "Usuários podem deletar seus próprios leads"
ON public.leads
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
-- Adicionar coluna status à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente'));

-- Atualizar registros existentes para ter status 'ativo'
UPDATE public.profiles SET status = 'ativo' WHERE status IS NULL;

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Policy para permitir admin atualizar status de perfis
CREATE POLICY "Admins podem atualizar status de perfis"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Policy para permitir admin deletar perfis
CREATE POLICY "Admins podem deletar perfis"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
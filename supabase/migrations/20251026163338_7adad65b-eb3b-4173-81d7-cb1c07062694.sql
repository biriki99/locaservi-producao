-- ==========================================
-- TABELA: clientes
-- ==========================================

-- 1. Remover política antiga de SELECT
DROP POLICY IF EXISTS "Usuários podem ver seus clientes" ON public.clientes;

-- 2. Criar nova política de SELECT (todos os usuários autenticados veem tudo)
CREATE POLICY "Usuários autenticados podem ver todos os clientes"
ON public.clientes
FOR SELECT
TO authenticated
USING (true);

-- 3. Atualizar política de UPDATE (admins podem tudo, users comuns só seus próprios)
DROP POLICY IF EXISTS "Usuários podem atualizar seus clientes" ON public.clientes;

CREATE POLICY "Usuários podem atualizar clientes"
ON public.clientes
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR is_admin(auth.uid()));

-- 4. Atualizar política de DELETE
DROP POLICY IF EXISTS "Somente admin pode deletar clientes" ON public.clientes;

CREATE POLICY "Usuários podem deletar clientes"
ON public.clientes
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));


-- ==========================================
-- TABELA: categorias
-- ==========================================

DROP POLICY IF EXISTS "Usuários podem ver suas categorias" ON public.categorias;

CREATE POLICY "Usuários autenticados podem ver todas as categorias"
ON public.categorias
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar suas categorias" ON public.categorias;

CREATE POLICY "Usuários podem atualizar categorias"
ON public.categorias
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Somente admin pode deletar categorias" ON public.categorias;

CREATE POLICY "Usuários podem deletar categorias"
ON public.categorias
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));


-- ==========================================
-- TABELA: servicos
-- ==========================================

DROP POLICY IF EXISTS "Usuários podem ver seus serviços" ON public.servicos;

CREATE POLICY "Usuários autenticados podem ver todos os serviços"
ON public.servicos
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar seus serviços" ON public.servicos;

CREATE POLICY "Usuários podem atualizar serviços"
ON public.servicos
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Somente admin pode deletar serviços" ON public.servicos;

CREATE POLICY "Usuários podem deletar serviços"
ON public.servicos
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));


-- ==========================================
-- TABELA: leads
-- ==========================================

DROP POLICY IF EXISTS "Usuários podem ver seus leads" ON public.leads;

CREATE POLICY "Usuários autenticados podem ver todos os leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar seus leads" ON public.leads;

CREATE POLICY "Usuários podem atualizar leads"
ON public.leads
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()))
WITH CHECK ((auth.uid() = user_id) OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Somente admin pode deletar leads" ON public.leads;

CREATE POLICY "Usuários podem deletar leads"
ON public.leads
FOR DELETE
TO authenticated
USING ((auth.uid() = user_id) OR is_admin(auth.uid()));
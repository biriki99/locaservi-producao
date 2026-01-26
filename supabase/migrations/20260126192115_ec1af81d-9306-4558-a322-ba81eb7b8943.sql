-- Adicionar coluna nfe_emitido na tabela servicos
ALTER TABLE public.servicos 
ADD COLUMN nfe_emitido boolean NOT NULL DEFAULT false;
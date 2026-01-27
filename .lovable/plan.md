
Objetivo
- Corrigir o bug onde, ao editar um Serviço e marcar “Emitido NF-e”, a alteração não é salva no banco — e por consequência o relatório/filtro de NF-e não funciona corretamente.

Diagnóstico (o que está acontecendo hoje)
- Em src/lib/validations.ts, o servicoSchema (Zod) não possui o campo nfe_emitido.
- Em src/pages/Servicos.tsx, no fluxo de edição, o updateServico recebe “...result.data”.
  - Como result.data vem do Zod, e o Zod não conhece nfe_emitido, ele “descarta” esse campo.
  - Resultado: o update no Supabase nunca recebe nfe_emitido, então ele não muda (fica como estava, normalmente false).
- Isso explica exatamente os sintomas:
  - Ao editar e marcar NF-e, volta a ficar desmarcado depois (não persistiu).
  - No relatório, “Todos” aparece, mas a coluna NF-e fica “Não” para todos (porque no banco continua false).
  - Os filtros “Somente com NF-e” / “Somente sem NF-e” não retornam como esperado (porque quase tudo está false).

Evidência no código (pontos chave)
- src/lib/validations.ts: servicoSchema não tem nfe_emitido.
- src/pages/Servicos.tsx:
  - handleSubmit (edição): updateServico(editingServico.id, { ...result.data, ... })
  - handleSubmit (criação): nfe_emitido está sendo enviado via formData.nfe_emitido || false (criação tende a funcionar; edição não).

Plano de correção (mudanças a fazer)
1) Atualizar validação Zod para aceitar nfe_emitido
   - Arquivo: src/lib/validations.ts
   - Adicionar dentro do servicoSchema:
     - nfe_emitido: z.boolean().default(false)
   - Por que:
     - Assim o campo passa a existir em result.data e pode ser salvo tanto em criação quanto em edição de forma consistente.

2) Garantir que a edição envie nfe_emitido para o update
   - Arquivo: src/pages/Servicos.tsx
   - Ajustar o handleSubmit:
     a) Normalização do dado (segurança)
        - No dataToValidate, garantir que nfe_emitido vá como boolean (ex.: !!formData.nfe_emitido), evitando qualquer caso “undefined”.
     b) No bloco if (editingServico):
        - Incluir explicitamente nfe_emitido no objeto do update (idealmente vindo de result.data após corrigir o schema).
        - Recomendo também tornar o update “await” (como já é no addServico) para consistência e para evitar qualquer sensação de “salvou/fechou mas não atualizou”.

3) (Opcional, mas recomendado) Padronizar criação para usar o mesmo dado validado
   - Ainda em src/pages/Servicos.tsx
   - No addServico, trocar nfe_emitido: formData.nfe_emitido || false por nfe_emitido: result.data.nfe_emitido
   - Motivo:
     - Evita divergências entre “o que foi validado” e “o que é salvo”.

Como validar que ficou corrigido (passo a passo de teste)
1) Ir em Serviços → editar um serviço que está com NF-e “Não”
2) Marcar “Emitido NF-e” → Salvar
3) Reabrir o mesmo serviço para editar:
   - O checkbox deve permanecer marcado
4) Ir em Relatórios → Relatório de Serviços:
   - Selecionar “Somente com NF-e emitida” → deve listar esse serviço
   - Selecionar “Somente sem NF-e” → deve remover esse serviço da lista
   - Em “Todos” → a coluna “NF-e Emitida” deve mostrar “Sim” para ele

Observação importante (para evitar confusão)
- Os serviços que você “marcou” no passado, enquanto esse bug existia, provavelmente NÃO ficaram salvos como NF-e emitida.
- Depois da correção, será necessário reabrir e salvar novamente os serviços que devem ficar com NF-e “Sim”.

Arquivos que serão alterados
- src/lib/validations.ts
  - Adicionar o campo nfe_emitido ao servicoSchema
- src/pages/Servicos.tsx
  - Garantir que nfe_emitido é enviado no update (edição)
  - (Opcional) Padronizar criação para usar result.data.nfe_emitido

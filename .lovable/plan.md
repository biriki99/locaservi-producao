
## Plano: Adicionar Campo "Emitido NF-e" em Serviços e Filtro em Relatórios

### Resumo
Adicionar um campo de marcação "Emitido NF-e" no cadastro de serviços e um filtro correspondente na página de relatórios para filtrar serviços com ou sem NF-e emitida.

---

### 1. Alteração no Banco de Dados

Adicionar uma nova coluna `nfe_emitido` na tabela `servicos`:

```sql
ALTER TABLE servicos 
ADD COLUMN nfe_emitido boolean NOT NULL DEFAULT false;
```

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `nfe_emitido` | boolean | false | Indica se a NF-e foi emitida para o serviço |

---

### 2. Atualizar Tipos TypeScript

**Arquivo:** `src/types/index.ts`

Adicionar o campo `nfe_emitido` na interface `Servico`:

```typescript
export interface Servico {
  // ... campos existentes ...
  nfe_emitido: boolean;  // Novo campo
}
```

---

### 3. Atualizar Página de Serviços

**Arquivo:** `src/pages/Servicos.tsx`

#### 3.1 Importar componente Checkbox
Adicionar import do Checkbox do shadcn/ui.

#### 3.2 No formulário de cadastro/edição
Adicionar checkbox "Emitido NF-e" após o campo "Forma de Pagamento":

```text
┌─────────────────────────────────────────┐
│ Forma de Pagamento    │ Status Cobrança │
├─────────────────────────────────────────┤
│ ☐ Emitido NF-e                          │  ← Novo campo
├─────────────────────────────────────────┤
│ Data Início           │ Data Fim        │
└─────────────────────────────────────────┘
```

#### 3.3 Inicialização do formulário
- Novo serviço: `nfe_emitido: false` (desmarcado por padrão)
- Edição: carregar valor existente do serviço

#### 3.4 Dialog de visualização
Exibir badge indicando se NF-e foi emitida quando visualizar detalhes do serviço.

---

### 4. Atualizar Tipos de Relatórios

**Arquivo:** `src/types/relatorios.ts`

Adicionar campo de filtro NF-e:

```typescript
export interface FiltrosServicos {
  // ... campos existentes ...
  filtro_nfe?: 'all' | 'com_nfe' | 'sem_nfe';  // Novo filtro
}
```

---

### 5. Atualizar Filtros de Relatórios

**Arquivo:** `src/components/relatorios/FiltrosServicos.tsx`

Adicionar uma seção de filtro NF-e abaixo de "Somar valores no rodapé":

```text
☐ Somar valores no rodapé
☐ Exibir campo de Descrição

Filtrar por NF-e:
○ Todos (com e sem NF-e)
○ Somente com NF-e emitida
○ Somente sem NF-e
```

**Comportamento:**
- "Todos" (padrão): Exibe todos os serviços independente do status NF-e
- "Somente com NF-e": Filtra apenas serviços com `nfe_emitido = true`
- "Somente sem NF-e": Filtra apenas serviços com `nfe_emitido = false`

---

### 6. Aplicar Filtro NF-e nos Relatórios

**Arquivo:** `src/pages/Relatorios.tsx`

#### 6.1 Estado inicial
```typescript
const [filtrosServicos, setFiltrosServicos] = useState<FiltrosServicos>({
  // ... campos existentes ...
  filtro_nfe: 'all'  // Novo campo
});
```

#### 6.2 Lógica de filtragem
Adicionar condição no `useMemo` de `dadosRelatorio`:

```typescript
if (filtrosServicos.filtro_nfe === 'com_nfe') {
  servicosFiltrados = servicosFiltrados.filter(s => s.nfe_emitido === true);
} else if (filtrosServicos.filtro_nfe === 'sem_nfe') {
  servicosFiltrados = servicosFiltrados.filter(s => s.nfe_emitido === false);
}
// Se 'all', não filtra
```

#### 6.3 Limpar filtros
Resetar `filtro_nfe` para `'all'` na função `handleLimparFiltros`.

---

### 7. Adicionar Campo NF-e na Tabela de Relatório (Opcional)

**Arquivo:** `src/types/relatorios.ts`

Adicionar `'nfe_emitido'` ao tipo `CampoServico` para permitir exibir a coluna no relatório:

```typescript
export type CampoServico = 
  | 'titulo_servico'
  // ... outros campos ...
  | 'nfe_emitido';  // Novo campo
```

---

### Resumo das Alterações por Arquivo

| Arquivo | Alteração |
|---------|-----------|
| **Migração SQL** | Adicionar coluna `nfe_emitido` |
| `src/types/index.ts` | Adicionar campo na interface `Servico` |
| `src/types/relatorios.ts` | Adicionar tipo de filtro NF-e e campo exibível |
| `src/pages/Servicos.tsx` | Checkbox no formulário + exibição na visualização |
| `src/components/relatorios/FiltrosServicos.tsx` | Radio buttons para filtro NF-e |
| `src/pages/Relatorios.tsx` | Lógica de filtragem e estado inicial |

---

### Detalhes Técnicos

#### Validação
O campo `nfe_emitido` será um boolean simples, não requer validação Zod adicional pois o tipo já garante true/false.

#### Compatibilidade
- Serviços existentes receberão `nfe_emitido = false` por padrão
- Não há breaking changes nos dados existentes

#### Componentes UI
- Checkbox do shadcn/ui para o formulário de serviço
- RadioGroup ou Select do shadcn/ui para o filtro de relatório



## Plano: Filtros de Data do Relatório Baseados na Data Final do Serviço

### Problema Identificado

Atualmente, os filtros de data nos relatórios funcionam assim:
- **Filtro "Data Início"**: filtra serviços onde `s.data_inicio >= filtro.data_inicio`
- **Filtro "Data Fim"**: filtra serviços onde `s.data_fim <= filtro.data_fim`

**O que você precisa**: Ambos os filtros devem usar a `data_fim` do serviço como referência.

Exemplo prático:
- Período do relatório: 01/01/2026 até 31/01/2026
- Serviço 1: início 20/12/2025 → fim **15/01/2026** → **Deve aparecer** ✓
- Serviço 2: início 05/01/2025 → fim **20/01/2026** → **Deve aparecer** ✓
- Serviço 3: início 20/01/2025 → fim **01/02/2026** → **Não deve aparecer** ✗

---

### Alterações Necessárias

#### Arquivo: `src/pages/Relatorios.tsx`

**1. Relatório de Serviços (linhas 61-66)**

**Antes:**
```typescript
if (filtrosServicos.data_inicio) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_inicio) >= new Date(filtrosServicos.data_inicio!));
}
if (filtrosServicos.data_fim) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosServicos.data_fim!));
}
```

**Depois:**
```typescript
if (filtrosServicos.data_inicio) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) >= new Date(filtrosServicos.data_inicio!));
}
if (filtrosServicos.data_fim) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosServicos.data_fim!));
}
```

**2. Relatório de Categorias (linhas 137-142)**

**Antes:**
```typescript
if (filtrosCategorias.data_inicio) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_inicio) >= new Date(filtrosCategorias.data_inicio!));
}
if (filtrosCategorias.data_fim) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosCategorias.data_fim!));
}
```

**Depois:**
```typescript
if (filtrosCategorias.data_inicio) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) >= new Date(filtrosCategorias.data_inicio!));
}
if (filtrosCategorias.data_fim) {
  servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosCategorias.data_fim!));
}
```

---

### Resumo da Lógica

| Filtro | Campo do Serviço Usado | Operação |
|--------|------------------------|----------|
| Data Início (do período) | `s.data_fim` | >= filtro |
| Data Fim (do período) | `s.data_fim` | <= filtro |

A data de término do serviço (`data_fim`) é usada como referência para ambos os filtros, garantindo que o serviço seja atribuído ao período em que foi concluído.

---

### Arquivos Alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Relatorios.tsx` | Mudar lógica de filtro de datas (linhas 61-66 e 137-142) |

---

### Consistência com Dashboard

Esta alteração segue o mesmo padrão já implementado no Dashboard (conforme memória do projeto), onde os KPIs "Total em Aluguéis", "Total a Receber" e "Faturamento por Categoria" também usam `data_fim` para cálculos periódicos.


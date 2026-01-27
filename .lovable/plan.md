

## Plano: Simplificar Filtro NF-e usando Select/Dropdown

### Problema Atual
O filtro "Filtrar por NF-e" está usando `RadioGroup` que ocupa mais espaço vertical e destoa visualmente dos outros filtros que usam `Select`.

### Solução
Substituir o `RadioGroup` por um `Select` (dropdown) com as 3 opções, mantendo a mesma funcionalidade mas com visual mais limpo e consistente.

---

### Alteração em `src/components/relatorios/FiltrosServicos.tsx`

**Substituir (linhas 162-183):**

```text
ANTES:
┌─────────────────────────────────────┐
│ Filtrar por NF-e                    │
│ ○ Todos (com e sem NF-e)            │
│ ○ Somente com NF-e emitida          │
│ ○ Somente sem NF-e                  │
└─────────────────────────────────────┘

DEPOIS:
┌─────────────────────────────────────┐
│ Filtrar por NF-e                    │
│ [▼ Todos (com e sem NF-e)        ]  │
└─────────────────────────────────────┘
```

**Código:**

Substituir a seção do RadioGroup (linhas 162-183) por um Select:

```tsx
{/* Filtro NF-e */}
<div className="space-y-2">
  <Label>Filtrar por NF-e</Label>
  <Select
    value={filtros.filtro_nfe || "all"}
    onValueChange={(value) => onChange({ ...filtros, filtro_nfe: value as 'all' | 'com_nfe' | 'sem_nfe' })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Todos (com e sem NF-e)" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todos (com e sem NF-e)</SelectItem>
      <SelectItem value="com_nfe">Somente com NF-e emitida</SelectItem>
      <SelectItem value="sem_nfe">Somente sem NF-e</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

### Limpeza de Imports

Remover o import não utilizado do `RadioGroup`:

```tsx
// Remover esta linha:
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
```

---

### Resumo

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Componente | RadioGroup | Select |
| Espaço visual | 4 linhas | 2 linhas |
| Consistência | Diferente dos outros filtros | Igual aos outros filtros |
| Funcionalidade | 3 opções | 3 opções (sem alteração) |


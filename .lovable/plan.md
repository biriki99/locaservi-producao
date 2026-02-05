

## Plano: Corrigir Ordenação de Serviços

### Problema Identificado

Os valores do dropdown "Ordenar por" **não correspondem** aos valores esperados pela função de ordenação. Por isso a mensagem de sucesso aparece, mas a lista não é reordenada.

**Valores no dropdown (`FiltrosServicos.tsx`):**
- `data_asc`, `data_desc`
- `valor_desc`, `valor_asc`
- `titulo_asc`, `titulo_desc`
- `categoria_asc`, `categoria_desc`
- `status_asc`, `status_desc`

**Valores esperados pela função (`Servicos.tsx`):**
- `data_mais_antigo`, `data_mais_recente`
- `valor_maior`, `valor_menor`
- `titulo_az`, `titulo_za`
- `categoria_az`, `categoria_za`
- `status_crescente`, `status_decrescente`

---

### Solução

Atualizar a função `aplicarOrdenacaoAutomatica` em `src/pages/Servicos.tsx` para usar os mesmos valores que o dropdown envia.

---

### Alterações Necessárias

**Arquivo:** `src/pages/Servicos.tsx` (função `aplicarOrdenacaoAutomatica`, linhas 230-283)

Substituir os case statements para usar os novos valores:

| Valor Atual (não funciona) | Novo Valor (correto) |
|----------------------------|----------------------|
| `data_mais_antigo` | `data_asc` |
| `data_mais_recente` | `data_desc` |
| `valor_maior` | `valor_desc` |
| `valor_menor` | `valor_asc` |
| `titulo_az` | `titulo_asc` |
| `titulo_za` | `titulo_desc` |
| `categoria_az` | `categoria_asc` |
| `categoria_za` | `categoria_desc` |
| `status_crescente` | `status_asc` |
| `status_decrescente` | `status_desc` |

---

### Código Corrigido

```typescript
const aplicarOrdenacaoAutomatica = (servicosArray: Servico[], tipoOrdenacao: string) => {
  if (tipoOrdenacao === "padrao") return servicosArray;
  
  const sortedArray = [...servicosArray];
  
  switch (tipoOrdenacao) {
    case "data_asc":
      return sortedArray.sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());
    
    case "data_desc":
      return sortedArray.sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime());
    
    case "valor_desc":
      return sortedArray.sort((a, b) => b.valor - a.valor);
    
    case "valor_asc":
      return sortedArray.sort((a, b) => a.valor - b.valor);
    
    case "titulo_asc":
      return sortedArray.sort((a, b) => a.titulo_servico.localeCompare(b.titulo_servico));
    
    case "titulo_desc":
      return sortedArray.sort((a, b) => b.titulo_servico.localeCompare(a.titulo_servico));
    
    case "categoria_asc":
      return sortedArray.sort((a, b) => {
        const catA = categorias.find(c => c.id === a.maquina_id)?.nome_maquina || "";
        const catB = categorias.find(c => c.id === b.maquina_id)?.nome_maquina || "";
        return catA.localeCompare(catB);
      });
    
    case "categoria_desc":
      return sortedArray.sort((a, b) => {
        const catA = categorias.find(c => c.id === a.maquina_id)?.nome_maquina || "";
        const catB = categorias.find(c => c.id === b.maquina_id)?.nome_maquina || "";
        return catB.localeCompare(catA);
      });
    
    case "status_asc":
      return sortedArray.sort((a, b) => a.status.localeCompare(b.status));
    
    case "status_desc":
      return sortedArray.sort((a, b) => b.status.localeCompare(a.status));
    
    default:
      return servicosArray;
  }
};
```

---

### Arquivos a Alterar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Servicos.tsx` | Corrigir valores dos cases na função `aplicarOrdenacaoAutomatica` (linhas 235-279) |

---

### Validação

Após a correção:
1. Ir em Serviços
2. Selecionar qualquer opção de ordenação no dropdown "Ordenar por"
3. A lista de serviços deve ser reordenada imediatamente conforme a opção selecionada
4. A badge "Ordenação automática ativa" deve aparecer
5. O botão "Restaurar ordem" deve voltar à ordem padrão




## Plano: Campo Telefone Único com Máscara de Formatação

### Resumo da Solicitação
1. O campo "Telefone" deve ser **único** (não pode haver dois clientes com o mesmo número)
2. O campo continua sendo **não obrigatório** (pode ficar vazio)
3. Ao tentar salvar um telefone que já existe, mostrar um **alerta com o nome do cliente** que já possui esse número
4. O campo deve seguir o **formato visual (XX) XXXXX-XXXX** conforme a imagem

---

### Alterações Necessárias

#### 1. Criar função utilitária para máscara de telefone

**Arquivo:** `src/lib/utils.ts`

Adicionar funções para:
- `formatarTelefone(valor)`: Aplica a máscara `(XX) XXXXX-XXXX` enquanto o usuário digita
- `limparTelefone(valor)`: Remove a formatação para comparação (apenas dígitos)

```typescript
// Formata telefone para (XX) XXXXX-XXXX
export function formatarTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 2) return numeros.length ? `(${numeros}` : '';
  if (numeros.length <= 7) return `(${numeros.slice(0,2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0,2)}) ${numeros.slice(2,7)}-${numeros.slice(7)}`;
}

// Remove formatação do telefone (só dígitos)
export function limparTelefone(valor: string): string {
  return valor.replace(/\D/g, '');
}
```

---

#### 2. Atualizar página de Clientes

**Arquivo:** `src/pages/Clientes.tsx`

**Mudanças:**

1. **Importar** as novas funções `formatarTelefone` e `limparTelefone`

2. **Aplicar máscara no input** de telefone:
   - Quando o usuário digitar, formatar automaticamente
   - Placeholder atualizado para `(11) 99999-9999`

3. **Verificar duplicidade antes de salvar**:
   - Antes de `addCliente` ou `updateCliente`
   - Se o telefone não estiver vazio:
     - Comparar com outros clientes (usando apenas dígitos)
     - Se encontrar duplicata (e não for o próprio cliente em edição):
       - Mostrar `toast.error` com mensagem: "Já existe um cliente com este telefone: [Nome do Cliente]"
       - Não permitir salvar

**Lógica de verificação:**

```typescript
// Dentro do handleSubmit, antes de salvar:
const telefoneDigitos = limparTelefone(formData.telefone || "");

if (telefoneDigitos) {
  const clienteExistente = clientes.find(c => {
    const telExistente = limparTelefone(c.telefone || "");
    // Ignora o próprio cliente se estiver editando
    if (editingCliente && c.id === editingCliente.id) return false;
    return telExistente === telefoneDigitos && telExistente !== "";
  });
  
  if (clienteExistente) {
    toast.error(`Já existe um cliente com este telefone: ${clienteExistente.nome}`);
    return;
  }
}
```

---

#### 3. Atualizar validação Zod (opcional, manter compatibilidade)

**Arquivo:** `src/lib/validations.ts`

O schema atual já permite telefone opcional. Podemos adicionar validação de formato se desejado:

```typescript
telefone: z
  .string()
  .trim()
  .max(20, "Telefone deve ter no máximo 20 caracteres")
  .regex(/^$|^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use (XX) XXXXX-XXXX")
  .optional()
  .or(z.literal("")),
```

Porém, como os cadastros existentes não seguem o formato, **recomendo não aplicar regex na validação** para evitar bloquear edições de registros antigos. A máscara será aplicada apenas na digitação.

---

### Fluxo de Funcionamento

```text
Usuário digita telefone
        │
        ▼
┌─────────────────────────┐
│ Máscara aplica formato  │
│ (XX) XXXXX-XXXX         │
└────────────┬────────────┘
             │
             ▼
    Clica em "Salvar"
             │
             ▼
┌─────────────────────────┐
│ Telefone está vazio?    │
└────────────┬────────────┘
      │ Não        │ Sim
      ▼            ▼
┌─────────────────┐    Continua salvando
│ Busca duplicata │
└────────┬────────┘
         │
    ┌────┴────┐
    │ Existe? │
    └────┬────┘
    Sim  │  Não
    ▼    ▼
Toast    Salva
erro     cliente
```

---

### Arquivos que serão alterados

| Arquivo | Alteração |
|---------|-----------|
| `src/lib/utils.ts` | Adicionar funções `formatarTelefone` e `limparTelefone` |
| `src/pages/Clientes.tsx` | Aplicar máscara no input + verificar duplicidade antes de salvar |

---

### Observações Importantes

- **Cadastros existentes**: Não serão alterados automaticamente. O novo formato só será aplicado ao editar ou criar novos clientes
- **Comparação inteligente**: A verificação de duplicidade usa apenas os dígitos, então `(11) 99999-9999` será considerado igual a `11999999999` ou `11 99999-9999`
- **Telefone vazio**: Se o campo estiver vazio, não será feita verificação de duplicidade (pode ter vários clientes sem telefone)


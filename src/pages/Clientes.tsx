import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Grid, List, Eye, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Cliente } from "@/types";
import { ClienteCard } from "@/components/clientes/ClienteCard";
import { clienteSchema } from "@/lib/validations";
import { format } from "date-fns";
import { formatarTelefone, limparTelefone } from "@/lib/utils";

export default function Clientes() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useData();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Cliente>>({});

  const canEdit = isAdmin;

  // Ordenar clientes alfabeticamente
  const clientesOrdenados = [...clientes].sort((a, b) => 
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  );

  // Filtrar por busca
  const clientesFiltrados = clientesOrdenados.filter((cliente) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      cliente.email?.toLowerCase().includes(searchLower) ||
      cliente.telefone?.toLowerCase().includes(searchLower) ||
      cliente.cpf_cnpj?.toLowerCase().includes(searchLower) ||
      cliente.endereco?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreate = () => {
    if (!canEdit) return;
    setEditingCliente(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    if (!canEdit) return;
    setEditingCliente(cliente);
    setFormData(cliente);
    setIsDialogOpen(true);
  };

  const handleDelete = (cliente: Cliente) => {
    if (!canEdit) return;
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      deleteCliente(cliente.id);
      toast.success("Cliente excluído com sucesso!");
    }
  };

  const handleView = (cliente: Cliente) => {
    setViewingCliente(cliente);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data with zod
    const result = clienteSchema.safeParse(formData);
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    // Verificar duplicidade de telefone
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

    if (editingCliente) {
      await updateCliente(editingCliente.id, result.data);
    } else {
      await addCliente({
        nome: result.data.nome,
        telefone: result.data.telefone || "",
        email: result.data.email || "",
        cpf_cnpj: result.data.cpf_cnpj || "",
        endereco: result.data.endereco || "",
        observacoes: result.data.observacoes || ""
      });
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const columns = [
    { header: "Nome", accessor: "nome" as keyof Cliente, sortable: true },
    { header: "Telefone", accessor: "telefone" as keyof Cliente },
    { header: "Email", accessor: "email" as keyof Cliente },
    { header: "CPF/CNPJ", accessor: "cpf_cnpj" as keyof Cliente },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          {canEdit && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          )}
        </div>
      </div>

      {/* Campo de busca */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, telefone, CPF/CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientesFiltrados.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onView={() => handleView(cliente)}
              onEdit={canEdit ? () => handleEdit(cliente) : undefined}
              onDelete={canEdit ? () => handleDelete(cliente) : undefined}
              canEdit={canEdit}
              canDelete={canEdit}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={clientesFiltrados}
          columns={columns}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canEdit ? handleDelete : undefined}
          searchPlaceholder="Buscar clientes..."
          emptyMessage="Nenhum cliente cadastrado"
          canEdit={canEdit}
          canDelete={canEdit}
        />
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCliente ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente abaixo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Nome completo ou razão social"
                value={formData.nome || ""}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="email@exemplo.com"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone || ""}
                  onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={formData.cpf_cnpj || ""}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade - UF"
                value={formData.endereco || ""}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o cliente"
                value={formData.observacoes || ""}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCliente ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas do cliente</DialogDescription>
          </DialogHeader>
          {viewingCliente && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-semibold">{viewingCliente.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF/CNPJ</Label>
                  <p className="font-semibold">{viewingCliente.cpf_cnpj || "Não informado"}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-semibold">{viewingCliente.email || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-semibold">{viewingCliente.telefone || "Não informado"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-semibold">{viewingCliente.endereco || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Observações</Label>
                <p className="font-semibold whitespace-pre-wrap">{viewingCliente.observacoes || "Nenhuma observação"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Data de Cadastro</Label>
                <p className="font-semibold">{format(new Date(viewingCliente.created_at), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

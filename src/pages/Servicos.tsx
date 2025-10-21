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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Servico } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function Servicos() {
  const { servicos, clientes, categorias, addServico, updateServico, deleteServico } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<Partial<Servico>>({});

  const canEdit = user?.role === "admin";

  const handleCreate = () => {
    setEditingServico(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData(servico);
    setIsDialogOpen(true);
  };

  const handleDelete = (servico: Servico) => {
    if (confirm(`Deseja realmente excluir o serviço ${servico.titulo_servico}?`)) {
      deleteServico(servico.id);
      toast.success("Serviço excluído com sucesso!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo_servico || !formData.cliente_id || !formData.maquina_id || !formData.valor || !formData.data_inicio || !formData.data_fim) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingServico) {
      updateServico(editingServico.id, formData);
      toast.success("Serviço atualizado com sucesso!");
    } else {
      const newServico: Servico = {
        id: `svc-${Date.now()}`,
        user_id: user?.id || "user-123",
        cliente_id: formData.cliente_id!,
        maquina_id: formData.maquina_id!,
        titulo_servico: formData.titulo_servico!,
        descricao: formData.descricao || "",
        valor: formData.valor!,
        status: formData.status || "pendente",
        status_cobranca: formData.status_cobranca || "a_receber",
        forma_pagamento: formData.forma_pagamento || "a_receber",
        data_inicio: formData.data_inicio || new Date().toISOString().split('T')[0],
        data_fim: formData.data_fim || new Date().toISOString().split('T')[0],
        observacoes: formData.observacoes || "",
        created_at: new Date().toISOString()
      };
      addServico(newServico);
      toast.success("Serviço criado com sucesso!");
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      concluido: "default",
      pendente: "secondary",
      cancelado: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const getCobrancaBadge = (status: string) => {
    return status === "pago" ? (
      <Badge className="bg-success text-success-foreground">Pago</Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground">A Receber</Badge>
    );
  };

  const columns = [
    { header: "Título", accessor: "titulo_servico" as keyof Servico, sortable: true },
    { 
      header: "Cliente", 
      accessor: ((item: Servico) => clientes.find(c => c.id === item.cliente_id)?.nome || "N/A") as any
    },
    { 
      header: "Máquina", 
      accessor: ((item: Servico) => categorias.find(c => c.id === item.maquina_id)?.nome_maquina || "N/A") as any
    },
    { 
      header: "Valor", 
      accessor: ((item: Servico) => `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) as any
    },
    { 
      header: "Status", 
      accessor: ((item: Servico) => getStatusBadge(item.status)) as any
    },
    { 
      header: "Cobrança", 
      accessor: ((item: Servico) => getCobrancaBadge(item.status_cobranca)) as any
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">Gerencie seus serviços e aluguéis</p>
        </div>
        {canEdit && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Button>
        )}
      </div>

      <DataTable
        data={servicos}
        columns={columns}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canEdit ? handleDelete : undefined}
        searchPlaceholder="Buscar serviços..."
        emptyMessage="Nenhum serviço cadastrado"
        canEdit={canEdit}
        canDelete={canEdit}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingServico ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do serviço abaixo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cliente_id">Cliente *</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maquina_id">Máquina/Categoria *</Label>
              <Select
                value={formData.maquina_id}
                onValueChange={(value) => setFormData({ ...formData, maquina_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma máquina" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome_maquina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo_servico">Título do Serviço *</Label>
              <Input
                id="titulo_servico"
                placeholder="Ex: Aluguel betoneira - Obra Zona Sul"
                value={formData.titulo_servico || ""}
                onChange={(e) => setFormData({ ...formData, titulo_servico: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes do serviço"
                value={formData.descricao || ""}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={formData.valor || ""}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status_cobranca">Status Cobrança</Label>
                <Select
                  value={formData.status_cobranca}
                  onValueChange={(value: any) => setFormData({ ...formData, status_cobranca: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                <Select
                  value={formData.forma_pagamento}
                  onValueChange={(value: any) => setFormData({ ...formData, forma_pagamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data Início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio || ""}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data Fim *</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim || ""}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais"
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
                {editingServico ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

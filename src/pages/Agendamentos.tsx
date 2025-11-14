import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Grid, List, Eye } from "lucide-react";
import { toast } from "sonner";
import { Agendamento } from "@/types";
import { Badge } from "@/components/ui/badge";
import { AgendamentoCard } from "@/components/agendamentos/AgendamentoCard";
import { FiltrosAgendamentos } from "@/components/agendamentos/FiltrosAgendamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { agendamentoSchema } from "@/lib/validations";

export default function Agendamentos() {
  const { agendamentos, clientes, addAgendamento, updateAgendamento, deleteAgendamento } = useData();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null);
  const [viewingAgendamento, setViewingAgendamento] = useState<Agendamento | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [filtrosLocais, setFiltrosLocais] = useState({
    busca: "",
    status: "all",
    data_inicio: "",
    data_fim: ""
  });
  const [formData, setFormData] = useState<Partial<Agendamento>>({});

  const canEdit = isAdmin;

  const handleCreate = () => {
    if (!canEdit) return;
    setEditingAgendamento(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (agendamento: Agendamento) => {
    if (!canEdit) return;
    setEditingAgendamento(agendamento);
    setFormData(agendamento);
    setIsDialogOpen(true);
  };

  const handleDelete = (agendamento: Agendamento) => {
    if (!canEdit) return;
    if (confirm(`Deseja realmente excluir o agendamento "${agendamento.titulo}"?`)) {
      deleteAgendamento(agendamento.id);
      toast.success("Agendamento excluído com sucesso!");
    }
  };

  const handleView = (agendamento: Agendamento) => {
    setViewingAgendamento(agendamento);
    setIsViewDialogOpen(true);
  };

  // Filtrar agendamentos localmente
  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const matchBusca = !filtrosLocais.busca || 
      agendamento.titulo.toLowerCase().includes(filtrosLocais.busca.toLowerCase());
    const matchStatus = filtrosLocais.status === "all" || agendamento.status === filtrosLocais.status;
    
    let matchData = true;
    if (filtrosLocais.data_inicio) {
      matchData = matchData && new Date(agendamento.data_agendamento) >= new Date(filtrosLocais.data_inicio);
    }
    if (filtrosLocais.data_fim) {
      matchData = matchData && new Date(agendamento.data_agendamento) <= new Date(filtrosLocais.data_fim);
    }

    return matchBusca && matchStatus && matchData;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      status: formData.status || "reservado_maquina",
    };

    // Validate form data with zod
    const result = agendamentoSchema.safeParse(dataToValidate);

    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    if (editingAgendamento) {
      updateAgendamento(editingAgendamento.id, result.data);
    } else {
      await addAgendamento({
        cliente_id: result.data.cliente_id,
        titulo: result.data.titulo,
        descricao: result.data.descricao || "",
        status: result.data.status || "reservado_maquina",
        data_agendamento: result.data.data_agendamento,
        observacoes: result.data.observacoes || "",
      });
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const getStatusBadge = (status: string) => {
    const config = {
      reservado_maquina: { label: "Reservado Máquina", className: "bg-blue-500 text-white" },
      agendado_pagamento: { label: "Agendado Pagamento", className: "bg-yellow-500 text-white" },
      confirmado: { label: "Confirmado", className: "bg-success text-success-foreground" },
      em_andamento: { label: "Em Andamento", className: "bg-orange-500 text-white" },
      cancelado: { label: "Cancelado", className: "bg-destructive text-destructive-foreground" }
    };
    
    const statusInfo = config[status as keyof typeof config] || config.reservado_maquina;
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || "Cliente não encontrado";
  };

  const columns = [
    {
      header: "Título",
      accessor: "titulo" as keyof Agendamento,
      sortable: true,
    },
    {
      header: "Cliente",
      accessor: (agendamento: Agendamento) => getClienteNome(agendamento.cliente_id),
      sortable: true,
    },
    {
      header: "Data/Hora",
      accessor: (agendamento: Agendamento) => 
        format(new Date(agendamento.data_agendamento), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      sortable: true,
    },
    {
      header: "Status",
      accessor: (agendamento: Agendamento) => getStatusBadge(agendamento.status),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie os agendamentos dos seus clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <FiltrosAgendamentos 
        filtros={filtrosLocais}
        onFiltrosChange={setFiltrosLocais}
      />

      {/* Conteúdo */}
      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agendamentosFiltrados.map((agendamento) => (
            <AgendamentoCard
              key={agendamento.id}
              agendamento={agendamento}
              clienteNome={getClienteNome(agendamento.cliente_id)}
              onEdit={() => handleEdit(agendamento)}
              onDelete={() => handleDelete(agendamento)}
              onView={() => handleView(agendamento)}
              canEdit={canEdit}
              canDelete={canEdit}
            />
          ))}
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={agendamentosFiltrados}
          onView={handleView}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canEdit ? handleDelete : undefined}
          canEdit={canEdit}
          canDelete={canEdit}
        />
      )}

      {/* Dialog Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do agendamento
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cliente_id">Cliente *</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                >
                  <SelectTrigger id="cliente_id">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes
                      .sort((a, b) => a.nome.localeCompare(b.nome))
                      .map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Revisão da máquina"
                  value={formData.titulo || ""}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_agendamento">Data e Hora *</Label>
                <Input
                  id="data_agendamento"
                  type="datetime-local"
                  value={formData.data_agendamento || ""}
                  onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reservado_maquina">Reservado Máquina</SelectItem>
                    <SelectItem value="agendado_pagamento">Agendado Pagamento</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o agendamento..."
                rows={3}
                value={formData.descricao || ""}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais..."
                rows={2}
                value={formData.observacoes || ""}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingAgendamento ? "Salvar Alterações" : "Criar Agendamento"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {viewingAgendamento && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Título</Label>
                  <p className="font-medium">{viewingAgendamento.titulo}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{getClienteNome(viewingAgendamento.cliente_id)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Data/Hora</Label>
                  <p className="font-medium">
                    {format(new Date(viewingAgendamento.data_agendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingAgendamento.status)}</div>
                </div>
              </div>
              {viewingAgendamento.descricao && (
                <div>
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <p className="mt-1">{viewingAgendamento.descricao}</p>
                </div>
              )}
              {viewingAgendamento.observacoes && (
                <div>
                  <Label className="text-sm text-muted-foreground">Observações</Label>
                  <p className="mt-1">{viewingAgendamento.observacoes}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-muted-foreground">Criado em</Label>
                <p className="text-sm">{format(new Date(viewingAgendamento.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

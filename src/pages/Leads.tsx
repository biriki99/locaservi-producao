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
import { Lead } from "@/types";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "@/components/leads/LeadCard";
import { FiltrosLeads } from "@/components/leads/FiltrosLeads";
import { format } from "date-fns";
import { leadSchema } from "@/lib/validations";

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useData();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [filtrosLocais, setFiltrosLocais] = useState({
    busca: "",
    status: "all",
  });
  const [formData, setFormData] = useState<Partial<Lead>>({});

  const canEdit = isAdmin;

  const handleCreate = () => {
    if (!canEdit) return;
    setEditingLead(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    if (!canEdit) return;
    setEditingLead(lead);
    setFormData(lead);
    setIsDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    if (!canEdit) return;
    if (confirm(`Deseja realmente excluir o lead ${lead.nome}?`)) {
      deleteLead(lead.id);
      toast.success("Lead excluído com sucesso!");
    }
  };

  const handleView = (lead: Lead) => {
    setViewingLead(lead);
    setIsViewDialogOpen(true);
  };

  // Filtrar leads localmente
  const leadsFiltrados = leads.filter((lead) => {
    const matchBusca = !filtrosLocais.busca || lead.nome.toLowerCase().includes(filtrosLocais.busca.toLowerCase());
    const matchStatus = filtrosLocais.status === "all" || lead.status === filtrosLocais.status;

    return matchBusca && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      status: formData.status || "novo",
    };

    // Validate form data with zod
    const result = leadSchema.safeParse(dataToValidate);

    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    if (editingLead) {
      updateLead(editingLead.id, result.data);
    } else {
      await addLead({
        nome: result.data.nome,
        telefone: result.data.telefone,
        email: result.data.email || "",
        interesse: result.data.interesse,
        status: result.data.status || "novo",
        observacoes: result.data.observacoes || "",
      });
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const getStatusBadge = (status: string) => {
    const config = {
      novo: { label: "Novo", className: "bg-primary text-primary-foreground" },
      contato_feito: { label: "Contato Feito", className: "bg-secondary text-secondary-foreground" },
      negociacao: { label: "Negociação", className: "bg-warning text-warning-foreground" },
      convertido: { label: "Convertido", className: "bg-success text-success-foreground" },
      perdido: { label: "Perdido", className: "bg-destructive text-destructive-foreground" },
    };

    const { label, className } = config[status as keyof typeof config] || config.novo;
    return <Badge className={className}>{label}</Badge>;
  };

  const columns = [
    { header: "Nome", accessor: "nome" as keyof Lead, sortable: true },
    { header: "Telefone", accessor: "telefone" as keyof Lead },
    { header: "Email", accessor: "email" as keyof Lead },
    { header: "Interesse", accessor: "interesse" as keyof Lead },
    {
      header: "Status",
      accessor: ((item: Lead) => getStatusBadge(item.status)) as any,
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads teste 2025</h1>
          <p className="text-muted-foreground">Gerencie seus leads e oportunidades</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          {canEdit && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          )}
        </div>
      </div>

      <FiltrosLeads filtros={filtrosLocais} onFiltrosChange={setFiltrosLocais} />

      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leadsFiltrados.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onView={() => handleView(lead)}
              onEdit={canEdit ? () => handleEdit(lead) : undefined}
              onDelete={canEdit ? () => handleDelete(lead) : undefined}
              canEdit={canEdit}
              canDelete={canEdit}
            />
          ))}
        </div>
      ) : (
        <DataTable
          data={leadsFiltrados}
          columns={columns}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canEdit ? handleDelete : undefined}
          searchPlaceholder="Buscar leads..."
          emptyMessage="Nenhum lead cadastrado"
          canEdit={canEdit}
          canDelete={canEdit}
        />
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
            <DialogDescription>Preencha os dados do lead abaixo</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome || ""}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone || ""}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contato_feito">Contato Feito</SelectItem>
                    <SelectItem value="negociacao">Negociação</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interesse">Interesse *</Label>
              <Input
                id="interesse"
                value={formData.interesse || ""}
                onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                placeholder="Ex: Betoneira 200L - Uso mensal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ""}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingLead ? "Salvar" : "Criar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas do lead</DialogDescription>
          </DialogHeader>
          {viewingLead && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-semibold">{viewingLead.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingLead.status)}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-semibold">{viewingLead.email || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-semibold">{viewingLead.telefone || "Não informado"}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Interesse</Label>
                <p className="font-semibold">{viewingLead.interesse || "Não informado"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Observações</Label>
                <p className="font-semibold whitespace-pre-wrap">{viewingLead.observacoes || "Nenhuma observação"}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Data de Cadastro</Label>
                <p className="font-semibold">{format(new Date(viewingLead.created_at), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

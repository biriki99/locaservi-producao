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
import { Lead } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  const canEdit = user?.role === "admin";

  const handleCreate = () => {
    setEditingLead(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setIsDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    if (confirm(`Deseja realmente excluir o lead ${lead.nome}?`)) {
      deleteLead(lead.id);
      toast.success("Lead excluído com sucesso!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.telefone || !formData.interesse) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingLead) {
      updateLead(editingLead.id, formData);
      toast.success("Lead atualizado com sucesso!");
    } else {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        nome: formData.nome!,
        telefone: formData.telefone!,
        email: formData.email || "",
        interesse: formData.interesse!,
        status: formData.status || "novo",
        observacoes: formData.observacoes || "",
        created_at: new Date().toISOString(),
        user_id: user?.id || "user-123"
      };
      addLead(newLead);
      toast.success("Lead criado com sucesso!");
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
      perdido: { label: "Perdido", className: "bg-destructive text-destructive-foreground" }
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
      accessor: ((item: Lead) => getStatusBadge(item.status)) as any
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Gerencie seus leads e oportunidades</p>
        </div>
        {canEdit && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        )}
      </div>

      <DataTable
        data={leads}
        columns={columns}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canEdit ? handleDelete : undefined}
        searchPlaceholder="Buscar leads..."
        emptyMessage="Nenhum lead cadastrado"
        canEdit={canEdit}
        canDelete={canEdit}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLead ? "Editar Lead" : "Novo Lead"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do lead abaixo
            </DialogDescription>
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
              <Button type="submit">
                {editingLead ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

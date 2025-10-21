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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Categoria } from "@/types";

export default function Categorias() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useData();
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState<Partial<Categoria>>({});

  const canEdit = isAdmin;

  const handleCreate = () => {
    setEditingCategoria(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData(categoria);
    setIsDialogOpen(true);
  };

  const handleDelete = (categoria: Categoria) => {
    if (confirm(`Deseja realmente excluir a categoria ${categoria.nome_maquina}?`)) {
      deleteCategoria(categoria.id);
      toast.success("Categoria excluída com sucesso!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome_maquina) {
      toast.error("Preencha o nome da máquina");
      return;
    }

    if (editingCategoria) {
      updateCategoria(editingCategoria.id, formData);
    } else {
      await addCategoria({
        nome_maquina: formData.nome_maquina!,
        observacao: formData.observacao || ""
      });
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const columns = [
    { header: "Nome da Máquina", accessor: "nome_maquina" as keyof Categoria, sortable: true },
    { header: "Observação", accessor: "observacao" as keyof Categoria },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias de máquinas</p>
        </div>
        {canEdit && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        )}
      </div>

      <DataTable
        data={categorias}
        columns={columns}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canEdit ? handleDelete : undefined}
        searchPlaceholder="Buscar categorias..."
        emptyMessage="Nenhuma categoria cadastrada"
        canEdit={canEdit}
        canDelete={canEdit}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da categoria abaixo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_maquina">Nome da Máquina *</Label>
              <Input
                id="nome_maquina"
                placeholder="Ex: Betoneira 200L"
                value={formData.nome_maquina || ""}
                onChange={(e) => setFormData({ ...formData, nome_maquina: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Especificações técnicas ou detalhes da máquina"
                value={formData.observacao || ""}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCategoria ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

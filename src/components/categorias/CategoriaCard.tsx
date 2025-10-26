import { Categoria } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const CategoriaCard = ({ 
  categoria, 
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  canDelete 
}: CategoriaCardProps) => {
  const { user, isAdmin } = useAuth();
  const podeEditar = isAdmin || categoria.user_id === user?.id;
  
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Ícone e Nome */}
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">{categoria.nome_maquina}</h3>
            </div>
          </div>
          
          {/* Observações */}
          {categoria.observacao && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {categoria.observacao}
            </p>
          )}
        </div>
        
        {/* Ações */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-1">
            {onView && (
              <Button variant="ghost" size="icon" onClick={onView} title="Visualizar">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {canEdit && podeEditar && onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && podeEditar && onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete} title="Excluir">
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

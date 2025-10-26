import { Lead } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, Mail, Phone, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LeadCardProps {
  lead: Lead;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; className: string }> = {
    novo: { label: "Novo", className: "bg-blue-500 text-white" },
    contato_feito: { label: "Contato Feito", className: "bg-yellow-500 text-white" },
    negociacao: { label: "Negociação", className: "bg-orange-500 text-white" },
    convertido: { label: "Convertido", className: "bg-success text-success-foreground" },
    perdido: { label: "Perdido", className: "bg-destructive text-destructive-foreground" }
  };
  
  const statusInfo = variants[status] || variants.novo;
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

export const LeadCard = ({ 
  lead, 
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  canDelete 
}: LeadCardProps) => {
  const { user, isAdmin } = useAuth();
  const podeEditar = isAdmin || lead.user_id === user?.id;
  
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Nome */}
          <h3 className="text-lg font-bold mb-1 truncate">{lead.nome}</h3>
          
          {/* Status */}
          <div className="mb-3">
            {getStatusBadge(lead.status)}
          </div>
          
          {/* Interesse */}
          {lead.interesse && (
            <div className="flex items-start gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium line-clamp-2">{lead.interesse}</p>
            </div>
          )}
          
          {/* Contato */}
          <div className="space-y-2 mb-3">
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.telefone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span>{lead.telefone}</span>
              </div>
            )}
          </div>
          
          {/* Observações */}
          {lead.observacoes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lead.observacoes}
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

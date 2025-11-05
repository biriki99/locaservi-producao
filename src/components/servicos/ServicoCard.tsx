import { Servico, Cliente, Categoria } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface ServicoCardProps {
  servico: Servico;
  cliente: Cliente | undefined;
  categoria: Categoria | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const getStatusBadge = (status: string) => {
  const variants = {
    concluido: "default",
    pendente: "secondary",
    cancelado: "destructive"
  };
  const labels = {
    concluido: "Concluído",
    pendente: "Pendente",
    cancelado: "Cancelado"
  };
  return <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>;
};

const getCobrancaBadge = (status: string) => {
  return status === "pago" ? (
    <Badge className="bg-success text-success-foreground">Pago</Badge>
  ) : (
    <Badge className="bg-warning text-warning-foreground">A Receber</Badge>
  );
};

export const ServicoCard = ({ 
  servico, 
  cliente, 
  categoria, 
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  canDelete 
}: ServicoCardProps) => {
  const { user, isAdmin } = useAuth();
  const podeEditar = isAdmin || servico.user_id === user?.id;
  
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0 space-y-3">
          {/* Título */}
          <h3 className="text-lg font-bold truncate">{servico.titulo_servico}</h3>
          
          {/* Descrição */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {servico.descricao || "Sem descrição"}
          </p>
          
          {/* Cliente e Máquina */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-semibold truncate">{cliente?.nome || "N/A"}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Máquina:</span>
            <span className="font-semibold truncate">{categoria?.nome_maquina || "N/A"}</span>
          </div>
          
          {/* Período */}
          <p className="text-sm text-muted-foreground">
            {format(parseISO(servico.data_inicio), "dd/MM/yyyy")} até {format(parseISO(servico.data_fim), "dd/MM/yyyy")}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(servico.status)}
            {getCobrancaBadge(servico.status_cobranca)}
          </div>
        </div>
        
        {/* Valor e Ações */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3">
          <p className="text-xl sm:text-2xl font-bold whitespace-nowrap flex-1 sm:flex-initial">
            R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          
          {/* Ações */}
          <div className="flex gap-1">
            {onView && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onView} 
                title="Visualizar"
                className="h-11 w-11 sm:h-9 sm:w-9 touch-target"
              >
                <Eye className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {canEdit && podeEditar && onEdit && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEdit} 
                title="Editar"
                className="h-11 w-11 sm:h-9 sm:w-9 touch-target"
              >
                <Pencil className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            )}
            {canDelete && podeEditar && onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete} 
                title="Excluir"
                className="h-11 w-11 sm:h-9 sm:w-9 touch-target"
              >
                <Trash className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

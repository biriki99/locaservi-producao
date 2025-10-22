import { Servico, Cliente, Categoria } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";
import { format, parseISO } from "date-fns";

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
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Título */}
          <h3 className="text-lg font-bold mb-1 truncate">{servico.titulo_servico}</h3>
          
          {/* Descrição */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {servico.descricao || "Sem descrição"}
          </p>
          
          {/* Cliente e Máquina */}
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-semibold">{cliente?.nome || "N/A"}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Máquina:</span>
            <span className="font-semibold">{categoria?.nome_maquina || "N/A"}</span>
          </div>
          
          {/* Período */}
          <p className="text-sm text-muted-foreground mb-3">
            {format(parseISO(servico.data_inicio), "dd/MM/yyyy")} até {format(parseISO(servico.data_fim), "dd/MM/yyyy")}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(servico.status)}
            {getCobrancaBadge(servico.status_cobranca)}
          </div>
        </div>
        
        {/* Valor e Ações */}
        <div className="flex flex-col items-end gap-3">
          <p className="text-2xl font-bold whitespace-nowrap">
            R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          
          {/* Ações */}
          <div className="flex gap-1">
            {onView && (
              <Button variant="ghost" size="icon" onClick={onView} title="Visualizar">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {canEdit && onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && onDelete && (
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

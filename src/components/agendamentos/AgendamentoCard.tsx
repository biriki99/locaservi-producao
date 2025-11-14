import { Agendamento } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash, Calendar, User, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgendamentoCardProps {
  agendamento: Agendamento;
  clienteNome: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; className: string }> = {
    reservado_maquina: { label: "Reservado Máquina", className: "bg-blue-500 text-white" },
    agendado_pagamento: { label: "Agendado Pagamento", className: "bg-yellow-500 text-white" },
    confirmado: { label: "Confirmado", className: "bg-green-500 text-white" },
    em_andamento: { label: "Em Andamento", className: "bg-orange-500 text-white" },
    cancelado: { label: "Cancelado", className: "bg-destructive text-destructive-foreground" }
  };
  
  const statusInfo = variants[status] || variants.reservado_maquina;
  return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
};

export const AgendamentoCard = ({ 
  agendamento, 
  clienteNome,
  onEdit, 
  onDelete, 
  onView, 
  canEdit, 
  canDelete 
}: AgendamentoCardProps) => {
  const { user, isAdmin } = useAuth();
  const podeEditar = isAdmin || agendamento.user_id === user?.id;
  
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Título */}
          <h3 className="text-lg font-bold mb-1 truncate">{agendamento.titulo}</h3>
          
          {/* Status */}
          <div className="mb-3">
            {getStatusBadge(agendamento.status)}
          </div>
          
          {/* Cliente */}
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate">{clienteNome}</span>
          </div>
          
          {/* Data */}
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">
              {format(new Date(agendamento.data_agendamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </span>
          </div>
          
          {/* Descrição */}
          {agendamento.descricao && (
            <div className="flex items-start gap-2 mb-3">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground line-clamp-2">{agendamento.descricao}</p>
            </div>
          )}
          
          {/* Observações */}
          {agendamento.observacoes && (
            <p className="text-xs text-muted-foreground line-clamp-1 italic mt-2">
              Obs: {agendamento.observacoes}
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

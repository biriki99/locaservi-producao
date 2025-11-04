import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Servico, Cliente, Categoria } from "@/types";
import { format, parseISO } from "date-fns";
import { AlertCircle, Eye, Calendar, DollarSign } from "lucide-react";

interface AlertaServicoCardProps {
  servico: Servico;
  cliente: Cliente | undefined;
  categoria: Categoria | undefined;
  diasRestantes: number;
  onView: () => void;
}

export function AlertaServicoCard({ 
  servico, 
  cliente, 
  categoria, 
  diasRestantes, 
  onView 
}: AlertaServicoCardProps) {
  
  const getStatusPrazo = () => {
    if (diasRestantes < 0) {
      return { 
        tipo: 'atrasado', 
        label: `Atrasado há ${Math.abs(diasRestantes)} dia${Math.abs(diasRestantes) !== 1 ? 's' : ''}`,
        icon: '🔴',
        borderColor: 'border-destructive',
        bgColor: 'bg-destructive/5',
        badgeVariant: 'destructive' as const
      };
    } else if (diasRestantes === 0) {
      return { 
        tipo: 'venceHoje', 
        label: 'Vence hoje',
        icon: '🟡',
        borderColor: 'border-warning',
        bgColor: 'bg-warning/5',
        badgeVariant: 'default' as const,
        badgeClass: 'bg-warning text-warning-foreground'
      };
    } else if (diasRestantes <= 2) {
      return { 
        tipo: 'urgente', 
        label: `Faltam ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`,
        icon: '🟡',
        borderColor: 'border-warning',
        bgColor: 'bg-warning/5',
        badgeVariant: 'default' as const,
        badgeClass: 'bg-warning text-warning-foreground'
      };
    } else {
      return { 
        tipo: 'noPrazo', 
        label: `Faltam ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`,
        icon: '🟢',
        borderColor: 'border-success',
        bgColor: 'bg-success/5',
        badgeVariant: 'default' as const,
        badgeClass: 'bg-success text-success-foreground'
      };
    }
  };

  const statusPrazo = getStatusPrazo();

  return (
    <Card className={`hover-lift border-l-4 ${statusPrazo.borderColor} ${statusPrazo.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <Badge 
              variant={statusPrazo.badgeVariant}
              className={statusPrazo.badgeClass}
            >
              {statusPrazo.icon} {statusPrazo.label}
            </Badge>
          </div>
          <span className="text-xl font-bold">
            R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Título */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{servico.titulo_servico}</h3>
        </div>

        {/* Cliente */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-muted-foreground min-w-[60px]">Cliente:</span>
          <span className="text-sm font-medium line-clamp-1">{cliente?.nome || "N/A"}</span>
        </div>

        {/* Máquina */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-muted-foreground min-w-[60px]">Máquina:</span>
          <span className="text-sm font-medium line-clamp-1">{categoria?.nome_maquina || "N/A"}</span>
        </div>

        {/* Período */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {format(parseISO(servico.data_inicio), "dd/MM/yyyy")} até {format(parseISO(servico.data_fim), "dd/MM/yyyy")}
          </span>
        </div>

        {/* Descrição (se existir) */}
        {servico.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {servico.descricao}
          </p>
        )}

        {/* Botão de ação */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onView}
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

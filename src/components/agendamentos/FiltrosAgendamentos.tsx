import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltrosAgendamentosProps {
  filtros: {
    busca: string;
    status: string;
    data_inicio: string;
    data_fim: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

export const FiltrosAgendamentos = ({ filtros, onFiltrosChange }: FiltrosAgendamentosProps) => {
  const limparFiltros = () => {
    onFiltrosChange({
      busca: "",
      status: "all",
      data_inicio: "",
      data_fim: ""
    });
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={limparFiltros}>
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="busca">Buscar por Título</Label>
          <Input
            id="busca"
            placeholder="Digite o título..."
            value={filtros.busca}
            onChange={(e) => onFiltrosChange({ ...filtros, busca: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filtros.status}
            onValueChange={(value) => onFiltrosChange({ ...filtros, status: value })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="reservado_maquina">Reservado Máquina</SelectItem>
              <SelectItem value="agendado_pagamento">Agendado Pagamento</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="em_andamento">Em Andamento</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="data_inicio">Data Início</Label>
          <Input
            id="data_inicio"
            type="date"
            value={filtros.data_inicio}
            onChange={(e) => onFiltrosChange({ ...filtros, data_inicio: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="data_fim">Data Fim</Label>
          <Input
            id="data_fim"
            type="date"
            value={filtros.data_fim}
            onChange={(e) => onFiltrosChange({ ...filtros, data_fim: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

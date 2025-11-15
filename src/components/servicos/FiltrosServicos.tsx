import { Cliente, Categoria } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FiltrosServicosProps {
  filtros: {
    data_inicio?: string;
    data_fim?: string;
    cliente_id?: string;
    maquina_id?: string;
    status_cobranca?: string;
    status?: string;
  };
  onFiltrosChange: (filtros: any) => void;
  clientes: Cliente[];
  categorias: Categoria[];
}

export const FiltrosServicos = ({ filtros, onFiltrosChange, clientes, categorias }: FiltrosServicosProps) => {
  const limparFiltros = () => {
    onFiltrosChange({
      data_inicio: "",
      data_fim: "",
      cliente_id: "all",
      maquina_id: "all",
      status_cobranca: "all",
      status: "all"
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-card rounded-lg border">
      <div className="space-y-2">
        <Label className="text-sm">Cliente</Label>
        <Select
          value={filtros.cliente_id || "all"}
          onValueChange={(value) => onFiltrosChange({ ...filtros, cliente_id: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {[...clientes]
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Categoria/Máquina</Label>
        <Select
          value={filtros.maquina_id || "all"}
          onValueChange={(value) => onFiltrosChange({ ...filtros, maquina_id: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {[...categorias]
              .sort((a, b) => a.nome_maquina.localeCompare(b.nome_maquina))
              .map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome_maquina}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Status Cobrança</Label>
        <Select
          value={filtros.status_cobranca || "all"}
          onValueChange={(value) => onFiltrosChange({ ...filtros, status_cobranca: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="a_receber">A Receber</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Status do Serviço</Label>
        <Select
          value={filtros.status || "all"}
          onValueChange={(value) => onFiltrosChange({ ...filtros, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Data Início</Label>
        <Input
          type="date"
          value={filtros.data_inicio || ""}
          onChange={(e) => onFiltrosChange({ ...filtros, data_inicio: e.target.value })}
          className="w-[150px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Data Fim</Label>
        <Input
          type="date"
          value={filtros.data_fim || ""}
          onChange={(e) => onFiltrosChange({ ...filtros, data_fim: e.target.value })}
          className="w-[150px]"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={limparFiltros}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        Limpar
      </Button>
    </div>
  );
};

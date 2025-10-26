import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiltrosCategorias } from "@/types/relatorios";

interface Props {
  filtros: FiltrosCategorias;
  onChange: (filtros: FiltrosCategorias) => void;
}

export const FiltrosCategoriasComponent = ({ filtros, onChange }: Props) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg">Filtros de Categorias</h3>
      
      {/* Intervalo de Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data Início</Label>
          <Input
            type="date"
            value={filtros.data_inicio || ""}
            onChange={(e) => onChange({ ...filtros, data_inicio: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Data Fim</Label>
          <Input
            type="date"
            value={filtros.data_fim || ""}
            onChange={(e) => onChange({ ...filtros, data_fim: e.target.value })}
          />
        </div>
      </div>

      {/* Status Cobrança */}
      <div className="space-y-2">
        <Label>Status de Pagamento</Label>
        <Select
          value={filtros.status_cobranca || "all"}
          onValueChange={(value) => onChange({ ...filtros, status_cobranca: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="a_receber">A Receber</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

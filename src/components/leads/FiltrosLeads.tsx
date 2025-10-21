import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltrosLeadsProps {
  filtros: {
    busca: string;
    status: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

export const FiltrosLeads = ({ filtros, onFiltrosChange }: FiltrosLeadsProps) => {
  const limparFiltros = () => {
    onFiltrosChange({
      busca: "",
      status: "all"
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
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="busca">Buscar por Nome</Label>
          <Input
            id="busca"
            placeholder="Digite o nome..."
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
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contato_feito">Contato Feito</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="convertido">Convertido</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

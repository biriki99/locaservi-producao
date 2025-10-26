import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoRelatorio } from "@/types/relatorios";

interface Props {
  valor: TipoRelatorio;
  onChange: (tipo: TipoRelatorio) => void;
}

export const TipoRelatorioSelector = ({ valor, onChange }: Props) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tipo de Relatório</label>
      <Select value={valor} onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="servicos">Relatório de Serviços</SelectItem>
          <SelectItem value="clientes">Relatório de Clientes</SelectItem>
          <SelectItem value="categorias">Relatório de Categorias</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

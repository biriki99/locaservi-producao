import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FiltrosClientes, CampoServicoCliente } from "@/types/relatorios";

interface Props {
  filtros: FiltrosClientes;
  onChange: (filtros: FiltrosClientes) => void;
}

const CAMPOS_DISPONIVEIS: { value: CampoServicoCliente; label: string }[] = [
  { value: 'data_inicio', label: 'Data Início' },
  { value: 'data_fim', label: 'Data Fim' },
  { value: 'valor', label: 'Valor' },
  { value: 'categoria', label: 'Categoria' },
  { value: 'descricao', label: 'Descrição' },
  { value: 'status', label: 'Status' },
  { value: 'status_cobranca', label: 'Status Cobrança' }
];

export const FiltrosClientesComponent = ({ filtros, onChange }: Props) => {
  const handleCampoToggle = (campo: CampoServicoCliente, checked: boolean) => {
    const novosCampos = checked
      ? [...filtros.campos_servicos, campo]
      : filtros.campos_servicos.filter(c => c !== campo);
    
    onChange({ ...filtros, campos_servicos: novosCampos });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg">Filtros de Clientes</h3>
      
      {/* Nome Cliente */}
      <div className="space-y-2">
        <Label>Buscar Cliente</Label>
        <Input
          type="text"
          placeholder="Digite o nome do cliente..."
          value={filtros.nome_cliente || ""}
          onChange={(e) => onChange({ ...filtros, nome_cliente: e.target.value })}
        />
      </div>

      {/* Campos dos Serviços */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-base font-semibold">Campos dos Serviços a Exibir</Label>
        <div className="grid grid-cols-2 gap-2">
          {CAMPOS_DISPONIVEIS.map(campo => (
            <div key={campo.value} className="flex items-center space-x-2">
              <Checkbox
                id={campo.value}
                checked={filtros.campos_servicos.includes(campo.value)}
                onCheckedChange={(checked) => handleCampoToggle(campo.value, !!checked)}
              />
              <Label htmlFor={campo.value} className="cursor-pointer text-sm">{campo.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

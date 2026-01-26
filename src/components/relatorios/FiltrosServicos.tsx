import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FiltrosServicos, CampoServico } from "@/types/relatorios";
import { Cliente, Categoria } from "@/types";

interface Props {
  filtros: FiltrosServicos;
  onChange: (filtros: FiltrosServicos) => void;
  clientes: Cliente[];
  categorias: Categoria[];
}

const CAMPOS_DISPONIVEIS: { value: CampoServico; label: string }[] = [
  { value: 'titulo_servico', label: 'Título do Serviço' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'categoria', label: 'Categoria' },
  { value: 'data_inicio', label: 'Data Início' },
  { value: 'data_fim', label: 'Data Fim' },
  { value: 'valor', label: 'Valor' },
  { value: 'status', label: 'Status' },
  { value: 'status_cobranca', label: 'Status Cobrança' },
  { value: 'forma_pagamento', label: 'Forma Pagamento' },
  { value: 'descricao', label: 'Descrição' },
  { value: 'observacoes', label: 'Observações' },
  { value: 'nfe_emitido', label: 'NF-e Emitida' }
];

export const FiltrosServicosComponent = ({ filtros, onChange, clientes, categorias }: Props) => {
  const handleCampoToggle = (campo: CampoServico, checked: boolean) => {
    const novosCampos = checked
      ? [...filtros.campos_selecionados, campo]
      : filtros.campos_selecionados.filter(c => c !== campo);
    
    onChange({ ...filtros, campos_selecionados: novosCampos });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg">Filtros de Serviços</h3>
      
      {/* Cliente */}
      <div className="space-y-2">
        <Label>Cliente</Label>
        <Select
          value={filtros.cliente_id || "all"}
          onValueChange={(value) => onChange({ ...filtros, cliente_id: value === "all" ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os clientes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {[...clientes].sort((a, b) => a.nome.localeCompare(b.nome)).map(cliente => (
              <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          value={filtros.categoria_id || "all"}
          onValueChange={(value) => onChange({ ...filtros, categoria_id: value === "all" ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {[...categorias].sort((a, b) => a.nome_maquina.localeCompare(b.nome_maquina)).map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.nome_maquina}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Forma de Pagamento */}
      <div className="space-y-2">
        <Label>Forma de Pagamento</Label>
        <Select
          value={filtros.forma_pagamento || "all"}
          onValueChange={(value) => onChange({ ...filtros, forma_pagamento: value as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
            <SelectItem value="pix">Pix</SelectItem>
            <SelectItem value="cartao">Cartão</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
            <SelectItem value="a_receber">A Receber</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* Opções */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="somar"
            checked={filtros.somar_valores}
            onCheckedChange={(checked) => onChange({ ...filtros, somar_valores: !!checked })}
          />
          <Label htmlFor="somar" className="cursor-pointer">Somar valores no rodapé</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="descricao"
            checked={filtros.exibir_descricao}
            onCheckedChange={(checked) => onChange({ ...filtros, exibir_descricao: !!checked })}
          />
          <Label htmlFor="descricao" className="cursor-pointer">Exibir campo de Descrição</Label>
        </div>
      </div>

      {/* Filtro NF-e */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-base font-semibold">Filtrar por NF-e</Label>
        <RadioGroup 
          value={filtros.filtro_nfe || 'all'} 
          onValueChange={(value) => onChange({ ...filtros, filtro_nfe: value as 'all' | 'com_nfe' | 'sem_nfe' })}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="nfe_all" />
            <Label htmlFor="nfe_all" className="cursor-pointer">Todos (com e sem NF-e)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="com_nfe" id="nfe_com" />
            <Label htmlFor="nfe_com" className="cursor-pointer">Somente com NF-e emitida</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sem_nfe" id="nfe_sem" />
            <Label htmlFor="nfe_sem" className="cursor-pointer">Somente sem NF-e</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Campos a Exibir */}
      <div className="space-y-3 pt-2 border-t">
        <Label className="text-base font-semibold">Campos a Exibir</Label>
        <div className="grid grid-cols-2 gap-2">
          {CAMPOS_DISPONIVEIS.map(campo => (
            <div key={campo.value} className="flex items-center space-x-2">
              <Checkbox
                id={campo.value}
                checked={filtros.campos_selecionados.includes(campo.value)}
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

import { useData } from "@/contexts/DataContext";
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

const meses = [
  { value: "all", label: "Todos os meses" },
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const anoAtual = new Date().getFullYear();
const anos = ["all", ...Array.from({ length: 5 }, (_, i) => (anoAtual - i).toString())];

export const FiltrosGlobais = () => {
  const { filtros, setFiltros, categorias, clientes } = useData();

  const limparFiltros = () => {
    setFiltros({
      mes: "all",
      ano: new Date().getFullYear().toString(),
      categoria_id: "all",
      cliente_id: "all",
      data_inicio: "",
      data_fim: ""
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filtros.mes}
        onValueChange={(value) => setFiltros({ ...filtros, mes: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o mês" />
        </SelectTrigger>
        <SelectContent>
          {meses.map((mes) => (
            <SelectItem key={mes.value} value={mes.value}>
              {mes.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.ano}
        onValueChange={(value) => setFiltros({ ...filtros, ano: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os anos</SelectItem>
          {anos.slice(1).map((ano) => (
            <SelectItem key={ano} value={ano}>
              {ano}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.categoria_id}
        onValueChange={(value) => setFiltros({ ...filtros, categoria_id: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {[...categorias]
            .sort((a, b) => a.nome_maquina.localeCompare(b.nome_maquina))
            .map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nome_maquina}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.cliente_id || "all"}
        onValueChange={(value) => setFiltros({ ...filtros, cliente_id: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Cliente" />
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

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={filtros.data_inicio || ""}
          onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
          className="w-[150px]"
          placeholder="Data início"
        />
        <span className="text-sm text-muted-foreground">até</span>
        <Input
          type="date"
          value={filtros.data_fim || ""}
          onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
          className="w-[150px]"
          placeholder="Data fim"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={limparFiltros}
        className="gap-2"
      >
        <X className="h-4 w-4" />
        Limpar filtros
      </Button>
    </div>
  );
};

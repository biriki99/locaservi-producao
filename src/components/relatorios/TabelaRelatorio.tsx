import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";

import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface Props {
  dados: any[];
  tipo: 'servicos' | 'clientes' | 'categorias';
  colunas: string[];
  labelsColunas: Record<string, string>;
  mostrarTotal?: boolean;
  totalValor?: number;
  onSort?: (coluna: string, direcao: 'asc' | 'desc') => void;
}

export const TabelaRelatorio = ({ dados, tipo, colunas, labelsColunas, mostrarTotal, totalValor, onSort }: Props) => {
  const [colunaOrdenada, setColunaOrdenada] = useState<string | null>(null);
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'asc' | 'desc'>('asc');

  const handleSort = (coluna: string) => {
    let novaDirecao: 'asc' | 'desc' = 'asc';
    
    if (colunaOrdenada === coluna) {
      // Alterna entre asc, desc e null (volta ao padrão)
      if (direcaoOrdenacao === 'asc') {
        novaDirecao = 'desc';
      } else {
        // Resetar ordenação
        setColunaOrdenada(null);
        setDirecaoOrdenacao('asc');
        if (onSort) onSort('', 'asc'); // Sinaliza reset
        return;
      }
    }
    
    setColunaOrdenada(coluna);
    setDirecaoOrdenacao(novaDirecao);
    
    if (onSort) {
      onSort(coluna, novaDirecao);
    }
  };

  if (dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground text-lg">
          Nenhum resultado encontrado. Ajuste os filtros e tente novamente.
        </p>
      </div>
    );
  }

  const formatarValor = (valor: any, coluna: string) => {
    if (coluna.includes('valor') && typeof valor === 'number') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }
    if (coluna.includes('data') && valor) {
      const dateStr = valor.toString().split('T')[0]; // Remove hora se existir
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      
      if (match) {
        const [, ano, mes, dia] = match;
        return `${dia}/${mes}/${ano}`;
      }
      
      // Fallback
      return new Date(valor).toLocaleDateString('pt-BR');
    }
    return valor || '-';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {colunas.map(coluna => (
                <TableHead key={coluna} className="font-semibold">
                  <button
                    onClick={() => handleSort(coluna)}
                    className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer w-full text-left"
                  >
                    {labelsColunas[coluna] || coluna}
                    <ArrowUpDown className="h-4 w-4" />
                    {colunaOrdenada === coluna && (
                      <span className="text-xs">
                        {direcaoOrdenacao === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map((row, index) => (
              <TableRow key={row.id || index}>
                {colunas.map((coluna) => (
                  <TableCell key={coluna}>
                    {formatarValor(row[coluna], coluna)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {mostrarTotal && totalValor !== undefined && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={colunas.length - 1} className="text-right font-semibold">
                  TOTAL:
                </TableCell>
                <TableCell className="font-bold text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValor)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
};

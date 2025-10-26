import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";

interface Props {
  dados: any[];
  tipo: 'servicos' | 'clientes' | 'categorias';
  colunas: string[];
  labelsColunas: Record<string, string>;
  mostrarTotal?: boolean;
  totalValor?: number;
}

export const TabelaRelatorio = ({ dados, tipo, colunas, labelsColunas, mostrarTotal, totalValor }: Props) => {
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
                  {labelsColunas[coluna] || coluna}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.map((row, idx) => (
              <TableRow key={idx}>
                {colunas.map(coluna => (
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

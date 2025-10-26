import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/exportUtils";

interface Props {
  dados: any[];
  colunas: string[];
  labelsColunas: Record<string, string>;
  nomeArquivo: string;
  titulo: string;
  mostrarTotal?: boolean;
  totalValor?: number;
}

export const ExportButtons = ({ 
  dados, 
  colunas, 
  labelsColunas, 
  nomeArquivo, 
  titulo,
  mostrarTotal,
  totalValor
}: Props) => {
  const handleExportCSV = () => {
    exportToCSV(dados, colunas, labelsColunas, nomeArquivo, mostrarTotal, totalValor);
  };

  const handleExportExcel = () => {
    exportToExcel(dados, colunas, labelsColunas, nomeArquivo, mostrarTotal, totalValor);
  };

  const handleExportPDF = () => {
    exportToPDF(dados, colunas, labelsColunas, nomeArquivo, titulo, mostrarTotal, totalValor);
  };

  if (dados.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handleExportCSV} variant="outline" size="sm">
        <FileText className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>
      <Button onClick={handleExportExcel} variant="outline" size="sm">
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>
      <Button onClick={handleExportPDF} variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
};

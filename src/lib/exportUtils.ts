export const exportToCSV = (
  dados: any[],
  colunas: string[],
  labelsColunas: Record<string, string>,
  nomeArquivo: string
) => {
  // Cabeçalho
  const headers = colunas.map(col => labelsColunas[col] || col);
  
  // Dados
  const rows = dados.map(row => 
    colunas.map(col => {
      const valor = row[col];
      if (typeof valor === 'number') {
        return valor.toString().replace('.', ',');
      }
      return valor || '';
    })
  );

  // Construir CSV
  const csv = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');

  // Download
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nomeArquivo}.csv`;
  link.click();
};

export const exportToExcel = async (
  dados: any[],
  colunas: string[],
  labelsColunas: Record<string, string>,
  nomeArquivo: string
) => {
  try {
    const XLSX = await import('xlsx');
    
    // Preparar dados
    const dadosFormatados = dados.map(row => {
      const obj: any = {};
      colunas.forEach(col => {
        obj[labelsColunas[col] || col] = row[col];
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    alert('Erro ao exportar para Excel. Verifique se o pacote xlsx está instalado.');
  }
};

export const exportToPDF = async (
  dados: any[],
  colunas: string[],
  labelsColunas: Record<string, string>,
  nomeArquivo: string,
  titulo: string
) => {
  try {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(16);
    doc.text(titulo, 14, 15);
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);

    // Tabela
    const headers = colunas.map(col => labelsColunas[col] || col);
    const rows = dados.map(row => colunas.map(col => {
      const valor = row[col];
      if (typeof valor === 'number' && col.includes('valor')) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
      }
      return valor || '-';
    }));

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save(`${nomeArquivo}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('Erro ao exportar para PDF. Verifique se os pacotes jspdf e jspdf-autotable estão instalados.');
  }
};

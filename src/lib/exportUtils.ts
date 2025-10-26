const formatarData = (valor: any): string => {
  if (!valor) return '';
  const data = new Date(valor);
  return data.toLocaleDateString('pt-BR');
};

const formatarValorExportacao = (valor: any, coluna: string): string => {
  // Formatar datas
  if (coluna.includes('data') && valor) {
    return formatarData(valor);
  }
  // Formatar valores monetários para texto
  if (coluna.includes('valor') && typeof valor === 'number') {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  }
  // Números não monetários
  if (typeof valor === 'number') {
    return valor.toString().replace('.', ',');
  }
  return valor || '';
};

export const exportToCSV = (
  dados: any[],
  colunas: string[],
  labelsColunas: Record<string, string>,
  nomeArquivo: string,
  mostrarTotal?: boolean,
  totalValor?: number
) => {
  // Cabeçalho
  const headers = colunas.map(col => labelsColunas[col] || col);
  
  // Dados
  const rows = dados.map(row => 
    colunas.map(col => formatarValorExportacao(row[col], col))
  );

  // Adicionar linha de total se necessário
  if (mostrarTotal && totalValor !== undefined) {
    const linhaTotal = colunas.map((col, idx) => {
      if (idx === colunas.length - 1) {
        return formatarValorExportacao(totalValor, col);
      }
      if (idx === colunas.length - 2) {
        return 'TOTAL:';
      }
      return '';
    });
    rows.push(linhaTotal);
  }

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
  nomeArquivo: string,
  mostrarTotal?: boolean,
  totalValor?: number
) => {
  try {
    const XLSX = await import('xlsx');
    
    // Preparar dados
    const dadosFormatados = dados.map(row => {
      const obj: any = {};
      colunas.forEach(col => {
        const label = labelsColunas[col] || col;
        obj[label] = formatarValorExportacao(row[col], col);
      });
      return obj;
    });

    // Adicionar linha de total se necessário
    if (mostrarTotal && totalValor !== undefined) {
      const linhaTotal: any = {};
      colunas.forEach((col, idx) => {
        const label = labelsColunas[col] || col;
        if (idx === colunas.length - 1) {
          linhaTotal[label] = formatarValorExportacao(totalValor, col);
        } else if (idx === colunas.length - 2) {
          linhaTotal[label] = 'TOTAL:';
        } else {
          linhaTotal[label] = '';
        }
      });
      dadosFormatados.push(linhaTotal);
    }

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
  titulo: string,
  mostrarTotal?: boolean,
  totalValor?: number
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
    const rows = dados.map(row => 
      colunas.map(col => formatarValorExportacao(row[col], col) || '-')
    );

    // Adicionar linha de total se necessário
    if (mostrarTotal && totalValor !== undefined) {
      const linhaTotal = colunas.map((col, idx) => {
        if (idx === colunas.length - 1) {
          return formatarValorExportacao(totalValor, col);
        }
        if (idx === colunas.length - 2) {
          return 'TOTAL:';
        }
        return '';
      });
      rows.push(linhaTotal);
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      // Estilizar linha de total se existir
      didParseCell: function (data: any) {
        if (mostrarTotal && data.row.index === rows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    doc.save(`${nomeArquivo}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('Erro ao exportar para PDF. Verifique se os pacotes jspdf e jspdf-autotable estão instalados.');
  }
};

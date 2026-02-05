import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Eraser } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { TipoRelatorio, FiltrosServicos, FiltrosClientes, FiltrosCategorias } from "@/types/relatorios";
import { TipoRelatorioSelector } from "@/components/relatorios/TipoRelatorioSelector";
import { FiltrosServicosComponent } from "@/components/relatorios/FiltrosServicos";
import { FiltrosClientesComponent } from "@/components/relatorios/FiltrosClientes";
import { FiltrosCategoriasComponent } from "@/components/relatorios/FiltrosCategorias";
import { TabelaRelatorio } from "@/components/relatorios/TabelaRelatorio";
import { ExportButtons } from "@/components/relatorios/ExportButtons";

const Relatorios = () => {
  const { servicos, clientes, categorias } = useData();
  
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('servicos');
  const [relatorioGerado, setRelatorioGerado] = useState(false);
  const [dadosOrdenados, setDadosOrdenados] = useState<any[]>([]);
  const [ordenacaoAtiva, setOrdenacaoAtiva] = useState<{
    coluna: string;
    direcao: 'asc' | 'desc';
  } | null>(null);
  const [inverterOrdem, setInverterOrdem] = useState(false);

  // Estados de filtros
  const [filtrosServicos, setFiltrosServicos] = useState<FiltrosServicos>({
    somar_valores: true,
    exibir_descricao: false,
    campos_selecionados: ['titulo_servico', 'cliente', 'categoria', 'data_inicio', 'data_fim', 'valor', 'status_cobranca'],
    filtro_nfe: 'all'
  });

  const [filtrosClientes, setFiltrosClientes] = useState<FiltrosClientes>({
    campos_servicos: ['data_inicio', 'data_fim', 'valor', 'categoria', 'status']
  });

  const [filtrosCategorias, setFiltrosCategorias] = useState<FiltrosCategorias>({});

  // Lógica de geração de relatórios
  const dadosRelatorio = useMemo(() => {
    if (!relatorioGerado) return [];

    if (tipoRelatorio === 'servicos') {
      let servicosFiltrados = [...servicos];

      // Aplicar filtros
      if (filtrosServicos.cliente_id) {
        servicosFiltrados = servicosFiltrados.filter(s => s.cliente_id === filtrosServicos.cliente_id);
      }
      if (filtrosServicos.categoria_id) {
        servicosFiltrados = servicosFiltrados.filter(s => s.maquina_id === filtrosServicos.categoria_id);
      }
      if (filtrosServicos.status_cobranca && filtrosServicos.status_cobranca !== 'all') {
        servicosFiltrados = servicosFiltrados.filter(s => s.status_cobranca === filtrosServicos.status_cobranca);
      }
      if (filtrosServicos.forma_pagamento && filtrosServicos.forma_pagamento !== 'all') {
        servicosFiltrados = servicosFiltrados.filter(s => s.forma_pagamento === filtrosServicos.forma_pagamento);
      }
      if (filtrosServicos.data_inicio) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) >= new Date(filtrosServicos.data_inicio!));
      }
      if (filtrosServicos.data_fim) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosServicos.data_fim!));
      }

      // Filtro NF-e
      if (filtrosServicos.filtro_nfe === 'com_nfe') {
        servicosFiltrados = servicosFiltrados.filter(s => s.nfe_emitido === true);
      } else if (filtrosServicos.filtro_nfe === 'sem_nfe') {
        servicosFiltrados = servicosFiltrados.filter(s => s.nfe_emitido === false);
      }

      // Mapear para o formato de exibição
      return servicosFiltrados.map(s => {
        const cliente = clientes.find(c => c.id === s.cliente_id);
        const categoria = categorias.find(c => c.id === s.maquina_id);
        
        const resultado: any = { id: s.id };
        
        if (filtrosServicos.campos_selecionados.includes('titulo_servico')) resultado.titulo_servico = s.titulo_servico;
        if (filtrosServicos.campos_selecionados.includes('cliente')) resultado.cliente = cliente?.nome;
        if (filtrosServicos.campos_selecionados.includes('categoria')) resultado.categoria = categoria?.nome_maquina;
        if (filtrosServicos.campos_selecionados.includes('data_inicio')) resultado.data_inicio = s.data_inicio;
        if (filtrosServicos.campos_selecionados.includes('data_fim')) resultado.data_fim = s.data_fim;
        if (filtrosServicos.campos_selecionados.includes('valor')) resultado.valor = s.valor;
        if (filtrosServicos.campos_selecionados.includes('status')) resultado.status = s.status;
        if (filtrosServicos.campos_selecionados.includes('status_cobranca')) resultado.status_cobranca = s.status_cobranca;
        if (filtrosServicos.campos_selecionados.includes('forma_pagamento')) resultado.forma_pagamento = s.forma_pagamento;
        if (filtrosServicos.campos_selecionados.includes('descricao') && filtrosServicos.exibir_descricao) resultado.descricao = s.descricao;
        if (filtrosServicos.campos_selecionados.includes('observacoes')) resultado.observacoes = s.observacoes;
        if (filtrosServicos.campos_selecionados.includes('nfe_emitido')) resultado.nfe_emitido = s.nfe_emitido ? 'Sim' : 'Não';

        return resultado;
      });
    }

    if (tipoRelatorio === 'clientes') {
      let clientesFiltrados = [...clientes];

      if (filtrosClientes.nome_cliente) {
        const busca = filtrosClientes.nome_cliente.toLowerCase();
        clientesFiltrados = clientesFiltrados.filter(c => c.nome.toLowerCase().includes(busca));
      }

      return clientesFiltrados.map(cliente => {
        const servicosCliente = servicos.filter(s => s.cliente_id === cliente.id);
        const resultado: any = {
          cliente: cliente.nome,
          total_servicos: servicosCliente.length
        };

        // Adicionar informações dos serviços baseado nos campos selecionados
        if (filtrosClientes.campos_servicos.length > 0 && servicosCliente.length > 0) {
          const ultimoServico = servicosCliente[0];
          const categoria = categorias.find(c => c.id === ultimoServico.maquina_id);

          if (filtrosClientes.campos_servicos.includes('data_inicio')) resultado.ultima_data_inicio = ultimoServico.data_inicio;
          if (filtrosClientes.campos_servicos.includes('data_fim')) resultado.ultima_data_fim = ultimoServico.data_fim;
          if (filtrosClientes.campos_servicos.includes('valor')) {
            resultado.total_valor = servicosCliente.reduce((sum, s) => sum + s.valor, 0);
          }
          if (filtrosClientes.campos_servicos.includes('categoria')) resultado.ultima_categoria = categoria?.nome_maquina;
          if (filtrosClientes.campos_servicos.includes('status')) resultado.ultimo_status = ultimoServico.status;
          if (filtrosClientes.campos_servicos.includes('status_cobranca')) resultado.ultimo_status_cobranca = ultimoServico.status_cobranca;
        }

        return resultado;
      });
    }

    if (tipoRelatorio === 'categorias') {
      let servicosFiltrados = [...servicos];

      // Aplicar filtros
      if (filtrosCategorias.data_inicio) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) >= new Date(filtrosCategorias.data_inicio!));
      }
      if (filtrosCategorias.data_fim) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosCategorias.data_fim!));
      }
      if (filtrosCategorias.status_cobranca && filtrosCategorias.status_cobranca !== 'all') {
        servicosFiltrados = servicosFiltrados.filter(s => s.status_cobranca === filtrosCategorias.status_cobranca);
      }

      // Agrupar por categoria
      const agrupado = categorias.map(cat => {
        const servicosCategoria = servicosFiltrados.filter(s => s.maquina_id === cat.id);
        return {
          categoria: cat.nome_maquina,
          quantidade_servicos: servicosCategoria.length,
          total_valor: servicosCategoria.reduce((sum, s) => sum + s.valor, 0)
        };
      }).filter(item => item.quantidade_servicos > 0);

      return agrupado;
    }

    return [];
  }, [relatorioGerado, tipoRelatorio, filtrosServicos, filtrosClientes, filtrosCategorias, servicos, clientes, categorias]);

  // Definir colunas e labels baseado no tipo
  const { colunas, labelsColunas } = useMemo(() => {
    if (tipoRelatorio === 'servicos') {
      const cols = filtrosServicos.campos_selecionados;
      const labels: Record<string, string> = {
        titulo_servico: 'Título',
        cliente: 'Cliente',
        categoria: 'Categoria',
        data_inicio: 'Data Início',
        data_fim: 'Data Fim',
        valor: 'Valor',
        status: 'Status',
        status_cobranca: 'Status Cobrança',
        forma_pagamento: 'Forma Pagamento',
        descricao: 'Descrição',
        observacoes: 'Observações',
        nfe_emitido: 'NF-e Emitida'
      };
      return { colunas: cols, labelsColunas: labels };
    }

    if (tipoRelatorio === 'clientes') {
      const cols = ['cliente', 'total_servicos'];
      const labels: Record<string, string> = {
        cliente: 'Cliente',
        total_servicos: 'Total de Serviços',
        ultima_data_inicio: 'Última Data Início',
        ultima_data_fim: 'Última Data Fim',
        total_valor: 'Total Valor',
        ultima_categoria: 'Última Categoria',
        ultimo_status: 'Último Status',
        ultimo_status_cobranca: 'Último Status Cobrança'
      };

      // Adicionar colunas baseadas nos campos selecionados
      if (filtrosClientes.campos_servicos.includes('data_inicio')) cols.push('ultima_data_inicio');
      if (filtrosClientes.campos_servicos.includes('data_fim')) cols.push('ultima_data_fim');
      if (filtrosClientes.campos_servicos.includes('valor')) cols.push('total_valor');
      if (filtrosClientes.campos_servicos.includes('categoria')) cols.push('ultima_categoria');
      if (filtrosClientes.campos_servicos.includes('status')) cols.push('ultimo_status');
      if (filtrosClientes.campos_servicos.includes('status_cobranca')) cols.push('ultimo_status_cobranca');

      return { colunas: cols, labelsColunas: labels };
    }

    if (tipoRelatorio === 'categorias') {
      return {
        colunas: ['categoria', 'quantidade_servicos', 'total_valor'],
        labelsColunas: {
          categoria: 'Categoria',
          quantidade_servicos: 'Quantidade de Serviços',
          total_valor: 'Total de Valores'
        }
      };
    }

    return { colunas: [], labelsColunas: {} };
  }, [tipoRelatorio, filtrosServicos, filtrosClientes]);

  // Calcular total
  const totalValor = useMemo(() => {
    if (tipoRelatorio === 'servicos' && filtrosServicos.somar_valores) {
      return dadosRelatorio.reduce((sum, item) => sum + (item.valor || 0), 0);
    }
    if (tipoRelatorio === 'categorias') {
      return dadosRelatorio.reduce((sum, item) => sum + (item.total_valor || 0), 0);
    }
    return undefined;
  }, [dadosRelatorio, tipoRelatorio, filtrosServicos]);

  const handleSort = (coluna: string, direcao: 'asc' | 'desc') => {
    if (!coluna) {
      setOrdenacaoAtiva(null);
      setDadosOrdenados([...dadosRelatorio]);
      return;
    }
    
    setOrdenacaoAtiva({ coluna, direcao });
    
    const dadosOrdenadosNovos = [...dadosRelatorio].sort((a, b) => {
      let valorA = a[coluna];
      let valorB = b[coluna];
      
      if (coluna.includes('data')) {
        valorA = new Date(valorA).getTime();
        valorB = new Date(valorB).getTime();
      }
      
      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return direcao === 'asc' ? valorA - valorB : valorB - valorA;
      }
      
      const comparison = String(valorA).localeCompare(String(valorB), 'pt-BR');
      return direcao === 'asc' ? comparison : -comparison;
    });
    
    setDadosOrdenados(dadosOrdenadosNovos);
  };

  const handleGerarRelatorio = () => {
    setRelatorioGerado(true);
    setInverterOrdem(false);
  };

  const handleLimparFiltros = () => {
    setRelatorioGerado(false);
    setInverterOrdem(false);
    if (tipoRelatorio === 'servicos') {
      setFiltrosServicos({
        somar_valores: true,
        exibir_descricao: false,
        campos_selecionados: ['titulo_servico', 'cliente', 'categoria', 'data_inicio', 'data_fim', 'valor', 'status_cobranca'],
        filtro_nfe: 'all'
      });
    }
    if (tipoRelatorio === 'clientes') {
      setFiltrosClientes({
        campos_servicos: ['data_inicio', 'data_fim', 'valor', 'categoria', 'status']
      });
    }
    if (tipoRelatorio === 'categorias') {
      setFiltrosCategorias({});
    }
  };

  const handleTipoChange = (tipo: TipoRelatorio) => {
    setTipoRelatorio(tipo);
    setRelatorioGerado(false);
    setInverterOrdem(false);
  };

  const dadosParaExibir = useMemo(() => {
    const dados = dadosOrdenados.length > 0 ? dadosOrdenados : dadosRelatorio;
    return inverterOrdem ? [...dados].reverse() : dados;
  }, [dadosOrdenados, dadosRelatorio, inverterOrdem]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Gere relatórios personalizados e exporte em diversos formatos</p>
        </div>
      </div>

      <Card className="p-6">
        <TipoRelatorioSelector valor={tipoRelatorio} onChange={handleTipoChange} />
      </Card>

      <Card className="p-6">
        {tipoRelatorio === 'servicos' && (
          <>
            <FiltrosServicosComponent
              filtros={filtrosServicos}
              onChange={setFiltrosServicos}
              clientes={clientes}
              categorias={categorias}
            />
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="inverter_ordem"
                checked={inverterOrdem}
                onCheckedChange={(checked) => setInverterOrdem(checked as boolean)}
              />
              <label
                htmlFor="inverter_ordem"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Inverter a ordem listada
              </label>
            </div>
          </>
        )}
        {tipoRelatorio === 'clientes' && (
          <>
            <FiltrosClientesComponent
              filtros={filtrosClientes}
              onChange={setFiltrosClientes}
            />
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="inverter_ordem"
                checked={inverterOrdem}
                onCheckedChange={(checked) => setInverterOrdem(checked as boolean)}
              />
              <label
                htmlFor="inverter_ordem"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Inverter a ordem listada
              </label>
            </div>
          </>
        )}
        {tipoRelatorio === 'categorias' && (
          <>
            <FiltrosCategoriasComponent
              filtros={filtrosCategorias}
              onChange={setFiltrosCategorias}
            />
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="inverter_ordem"
                checked={inverterOrdem}
                onCheckedChange={(checked) => setInverterOrdem(checked as boolean)}
              />
              <label
                htmlFor="inverter_ordem"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Inverter a ordem listada
              </label>
            </div>
          </>
        )}

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button onClick={handleGerarRelatorio} size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Gerar Relatório
          </Button>
          <Button onClick={handleLimparFiltros} variant="outline" size="lg">
            <Eraser className="mr-2 h-5 w-5" />
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {relatorioGerado && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Resultados do Relatório</h2>
            </div>
            <div className="flex items-center gap-2">
              <ExportButtons
                dados={dadosParaExibir}
                colunas={colunas}
                labelsColunas={labelsColunas}
                nomeArquivo={`relatorio-${tipoRelatorio}`}
                titulo={`Relatório de ${tipoRelatorio}`}
                mostrarTotal={
                  (tipoRelatorio === 'servicos' && filtrosServicos.somar_valores) ||
                  tipoRelatorio === 'categorias'
                }
                totalValor={totalValor}
              />
            </div>
          </div>
          
          <TabelaRelatorio
            dados={dadosParaExibir}
            tipo={tipoRelatorio}
            colunas={colunas}
            labelsColunas={labelsColunas}
            mostrarTotal={
              (tipoRelatorio === 'servicos' && filtrosServicos.somar_valores) ||
              tipoRelatorio === 'categorias'
            }
            totalValor={totalValor}
            onSort={handleSort}
          />
        </Card>
      )}
    </div>
  );
};

export default Relatorios;

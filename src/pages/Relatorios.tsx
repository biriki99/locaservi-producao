import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // Estados de filtros
  const [filtrosServicos, setFiltrosServicos] = useState<FiltrosServicos>({
    somar_valores: true,
    exibir_descricao: false,
    campos_selecionados: ['titulo_servico', 'cliente', 'categoria', 'data_inicio', 'data_fim', 'valor', 'status_cobranca']
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
      if (filtrosServicos.data_inicio) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_inicio) >= new Date(filtrosServicos.data_inicio!));
      }
      if (filtrosServicos.data_fim) {
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_fim) <= new Date(filtrosServicos.data_fim!));
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
        servicosFiltrados = servicosFiltrados.filter(s => new Date(s.data_inicio) >= new Date(filtrosCategorias.data_inicio!));
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
        observacoes: 'Observações'
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

  const handleGerarRelatorio = () => {
    setRelatorioGerado(true);
  };

  const handleLimparFiltros = () => {
    setRelatorioGerado(false);
    if (tipoRelatorio === 'servicos') {
      setFiltrosServicos({
        somar_valores: true,
        exibir_descricao: false,
        campos_selecionados: ['titulo_servico', 'cliente', 'categoria', 'data_inicio', 'data_fim', 'valor', 'status_cobranca']
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
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Gere relatórios personalizados e exporte em diversos formatos</p>
        </div>
      </div>

      {/* Seletor de Tipo */}
      <Card className="p-6">
        <TipoRelatorioSelector valor={tipoRelatorio} onChange={handleTipoChange} />
      </Card>

      {/* Painel de Filtros */}
      <Card className="p-6">
        {tipoRelatorio === 'servicos' && (
          <FiltrosServicosComponent
            filtros={filtrosServicos}
            onChange={setFiltrosServicos}
            clientes={clientes}
            categorias={categorias}
          />
        )}
        {tipoRelatorio === 'clientes' && (
          <FiltrosClientesComponent
            filtros={filtrosClientes}
            onChange={setFiltrosClientes}
          />
        )}
        {tipoRelatorio === 'categorias' && (
          <FiltrosCategoriasComponent
            filtros={filtrosCategorias}
            onChange={setFiltrosCategorias}
          />
        )}

        {/* Botões de Ação */}
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

      {/* Área de Resultados */}
      {relatorioGerado && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Resultados {dadosRelatorio.length > 0 && `(${dadosRelatorio.length} registros)`}
            </h2>
            <ExportButtons
              dados={dadosRelatorio}
              colunas={colunas}
              labelsColunas={labelsColunas}
              nomeArquivo={`relatorio-${tipoRelatorio}-${new Date().toISOString().split('T')[0]}`}
              titulo={`Relatório de ${tipoRelatorio.charAt(0).toUpperCase() + tipoRelatorio.slice(1)}`}
              mostrarTotal={totalValor !== undefined}
              totalValor={totalValor}
            />
          </div>

          <TabelaRelatorio
            dados={dadosRelatorio}
            tipo={tipoRelatorio}
            colunas={colunas}
            labelsColunas={labelsColunas}
            mostrarTotal={totalValor !== undefined}
            totalValor={totalValor}
          />
        </Card>
      )}
    </div>
  );
};

export default Relatorios;

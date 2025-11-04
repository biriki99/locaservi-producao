import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { AlertaServicoCard } from "@/components/alertas/AlertaServicoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Servico } from "@/types";

export default function AlertasServicos() {
  const { servicos, clientes, categorias } = useData();
  const [busca, setBusca] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("all");
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");
  const [tipoAlerta, setTipoAlerta] = useState("all");
  const [ordenacao, setOrdenacao] = useState("prazo");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingServico, setViewingServico] = useState<Servico | null>(null);

  // Função para calcular dias restantes
  const calcularDiasRestantes = (dataFim: string): number => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const fim = new Date(dataFim);
    fim.setHours(0, 0, 0, 0);
    
    const diffTime = fim.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Função para obter status do prazo
  const getStatusPrazo = (diasRestantes: number) => {
    if (diasRestantes < 0) {
      return { tipo: 'atrasado', label: `Atrasado há ${Math.abs(diasRestantes)} dia${Math.abs(diasRestantes) !== 1 ? 's' : ''}`, cor: 'destructive' };
    } else if (diasRestantes === 0) {
      return { tipo: 'venceHoje', label: 'Vence hoje', cor: 'warning' };
    } else if (diasRestantes <= 2) {
      return { tipo: 'urgente', label: `Faltam ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`, cor: 'warning' };
    } else {
      return { tipo: 'noPrazo', label: `Faltam ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`, cor: 'default' };
    }
  };

  // Filtrar apenas serviços pendentes
  const servicosPendentes = servicos.filter(s => s.status === "pendente");

  // Aplicar filtros
  const servicosFiltrados = servicosPendentes.filter(s => {
    const diasRestantes = calcularDiasRestantes(s.data_fim);
    const statusPrazo = getStatusPrazo(diasRestantes);
    
    // Filtro de busca
    const cliente = clientes.find(c => c.id === s.cliente_id);
    const categoria = categorias.find(c => c.id === s.maquina_id);
    const buscaMatch = busca === "" || 
      s.titulo_servico.toLowerCase().includes(busca.toLowerCase()) ||
      cliente?.nome.toLowerCase().includes(busca.toLowerCase()) ||
      categoria?.nome_maquina.toLowerCase().includes(busca.toLowerCase());
    
    // Filtro de cliente
    const clienteMatch = clienteFiltro === "all" || s.cliente_id === clienteFiltro;
    
    // Filtro de categoria
    const categoriaMatch = categoriaFiltro === "all" || s.maquina_id === categoriaFiltro;
    
    // Filtro de tipo de alerta
    const tipoAlertaMatch = tipoAlerta === "all" || 
      (tipoAlerta === "atrasado" && statusPrazo.tipo === "atrasado") ||
      (tipoAlerta === "urgente" && (statusPrazo.tipo === "urgente" || statusPrazo.tipo === "venceHoje")) ||
      (tipoAlerta === "noPrazo" && statusPrazo.tipo === "noPrazo");
    
    return buscaMatch && clienteMatch && categoriaMatch && tipoAlertaMatch;
  });

  // Ordenar serviços
  const servicosOrdenados = [...servicosFiltrados].sort((a, b) => {
    if (ordenacao === "prazo") {
      const diasA = calcularDiasRestantes(a.data_fim);
      const diasB = calcularDiasRestantes(b.data_fim);
      return diasA - diasB;
    } else if (ordenacao === "valor") {
      return b.valor - a.valor;
    } else if (ordenacao === "data_fim") {
      return new Date(a.data_fim).getTime() - new Date(b.data_fim).getTime();
    } else if (ordenacao === "cliente") {
      const clienteA = clientes.find(c => c.id === a.cliente_id)?.nome || "";
      const clienteB = clientes.find(c => c.id === b.cliente_id)?.nome || "";
      return clienteA.localeCompare(clienteB);
    }
    return 0;
  });

  // Calcular estatísticas
  const servicosAtrasados = servicosPendentes.filter(s => calcularDiasRestantes(s.data_fim) < 0).length;
  const servicosUrgentes = servicosPendentes.filter(s => {
    const dias = calcularDiasRestantes(s.data_fim);
    return dias >= 0 && dias <= 2;
  }).length;

  const handleView = (servico: Servico) => {
    setViewingServico(servico);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      concluido: "default",
      pendente: "secondary",
      cancelado: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const getCobrancaBadge = (status: string) => {
    return status === "pago" ? (
      <Badge className="bg-success text-success-foreground">Pago</Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground">A Receber</Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Alertas de Serviços Pendentes</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Acompanhe os prazos dos seus serviços em andamento
        </p>
        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="text-base">
            {servicosPendentes.length} serviço{servicosPendentes.length !== 1 ? 's' : ''} pendente{servicosPendentes.length !== 1 ? 's' : ''}
          </Badge>
          {servicosAtrasados > 0 && (
            <Badge variant="destructive" className="text-base">
              {servicosAtrasados} atrasado{servicosAtrasados !== 1 ? 's' : ''}
            </Badge>
          )}
          {servicosUrgentes > 0 && (
            <Badge className="bg-warning text-warning-foreground text-base">
              {servicosUrgentes} urgente{servicosUrgentes !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Busca */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="busca">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Título, cliente ou máquina..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={clienteFiltro} onValueChange={setClienteFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Máquina */}
          <div className="space-y-2">
            <Label>Máquina</Label>
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as máquinas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome_maquina}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Alerta */}
          <div className="space-y-2">
            <Label>Tipo de Alerta</Label>
            <Select value={tipoAlerta} onValueChange={setTipoAlerta}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="atrasado">Atrasados</SelectItem>
                <SelectItem value="urgente">Urgentes (≤ 2 dias)</SelectItem>
                <SelectItem value="noPrazo">No prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-4">
          <Label>Ordenar por:</Label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={ordenacao === "prazo" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrdenacao("prazo")}
            >
              Prazo
            </Button>
            <Button
              variant={ordenacao === "valor" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrdenacao("valor")}
            >
              Valor
            </Button>
            <Button
              variant={ordenacao === "data_fim" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrdenacao("data_fim")}
            >
              Data de Término
            </Button>
            <Button
              variant={ordenacao === "cliente" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrdenacao("cliente")}
            >
              Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Alertas */}
      {servicosOrdenados.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicosOrdenados.map((servico) => {
            const diasRestantes = calcularDiasRestantes(servico.data_fim);
            return (
              <AlertaServicoCard
                key={servico.id}
                servico={servico}
                cliente={clientes.find(c => c.id === servico.cliente_id)}
                categoria={categorias.find(c => c.id === servico.maquina_id)}
                diasRestantes={diasRestantes}
                onView={() => handleView(servico)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhum serviço encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste os filtros para ver mais resultados
          </p>
        </div>
      )}

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
            <DialogDescription>
              Informações completas do serviço
            </DialogDescription>
          </DialogHeader>

          {viewingServico && (
            <div className="space-y-4">
              {/* Badge de Prazo Destacado */}
              <div className="p-4 rounded-lg border-l-4" style={{
                borderColor: getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).cor === 'destructive' 
                  ? 'hsl(var(--destructive))' 
                  : getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).cor === 'warning'
                  ? 'hsl(var(--warning))'
                  : 'hsl(var(--success))',
                backgroundColor: getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).cor === 'destructive'
                  ? 'hsl(var(--destructive) / 0.05)'
                  : getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).cor === 'warning'
                  ? 'hsl(var(--warning) / 0.05)'
                  : 'hsl(var(--success) / 0.05)'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      {getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).label}
                    </span>
                  </div>
                  <Badge variant={getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).cor as any}>
                    {getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).tipo === 'atrasado' ? '🔴 Atrasado' : 
                     getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).tipo === 'venceHoje' ? '🟡 Vence Hoje' :
                     getStatusPrazo(calcularDiasRestantes(viewingServico.data_fim)).tipo === 'urgente' ? '🟡 Urgente' : 
                     '🟢 No Prazo'}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Cliente</Label>
                  <p className="text-base">{clientes.find(c => c.id === viewingServico.cliente_id)?.nome || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Máquina</Label>
                  <p className="text-base">{categorias.find(c => c.id === viewingServico.maquina_id)?.nome_maquina || "N/A"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Título</Label>
                <p className="text-base">{viewingServico.titulo_servico}</p>
              </div>

              {viewingServico.descricao && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Descrição</Label>
                  <p className="text-base whitespace-pre-wrap">{viewingServico.descricao}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Valor</Label>
                  <p className="text-2xl font-bold">R$ {viewingServico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Forma de Pagamento</Label>
                  <p className="text-base capitalize">{viewingServico.forma_pagamento.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingServico.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Status Cobrança</Label>
                  <div className="mt-1">{getCobrancaBadge(viewingServico.status_cobranca)}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Data Início</Label>
                  <p className="text-base">{format(parseISO(viewingServico.data_inicio), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Data Fim</Label>
                  <p className="text-base">{format(parseISO(viewingServico.data_fim), "dd/MM/yyyy")}</p>
                </div>
              </div>

              {viewingServico.observacoes && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Observações</Label>
                  <p className="text-base whitespace-pre-wrap">{viewingServico.observacoes}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

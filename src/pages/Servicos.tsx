import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Grid, List, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Servico, Cliente } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FiltrosServicos } from "@/components/servicos/FiltrosServicos";
import { ServicoCard } from "@/components/servicos/ServicoCard";
import { format, parseISO } from "date-fns";
import { servicoSchema } from "@/lib/validations";

export default function Servicos() {
  const { servicos, clientes, categorias, addServico, updateServico, deleteServico } = useData();
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isClienteDialogOpen, setIsClienteDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [viewingServico, setViewingServico] = useState<Servico | null>(null);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Partial<Servico>>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [filtrosLocais, setFiltrosLocais] = useState({
    data_inicio: "",
    data_fim: "",
    cliente_id: "all",
    maquina_id: "all",
    status_cobranca: "all",
    status: "all",
    forma_pagamento: "all"
  });
  const [ordenacaoAutomatica, setOrdenacaoAutomatica] = useState<string>("padrao");

  const canEdit = isAdmin;

  // Gerar título automaticamente baseado na categoria selecionada
  useEffect(() => {
    if (!editingServico && formData.maquina_id) {
      const categoriaSelecionada = categorias.find(c => c.id === formData.maquina_id);
      if (categoriaSelecionada) {
        const tituloGerado = `Aluguel ${categoriaSelecionada.nome_maquina}`;
        setFormData(prev => ({ ...prev, titulo_servico: tituloGerado }));
      }
    }
  }, [formData.maquina_id, categorias, editingServico]);

  // Abrir serviço automaticamente se vier da URL
  useEffect(() => {
    const viewId = searchParams.get('view');
    const editId = searchParams.get('edit');
    
    if (viewId) {
      const servico = servicos.find(s => s.id === viewId);
      if (servico) {
        handleView(servico);
        setSearchParams({});
      }
    } else if (editId) {
      const servico = servicos.find(s => s.id === editId);
      if (servico) {
        handleEdit(servico);
        setSearchParams({});
      }
    }
  }, [searchParams, servicos]);

  const handleCreate = () => {
    if (!canEdit) return;
    setEditingServico(null);
    
    // Pré-preencher campos com valores padrão
    const dataAtual = new Date().toISOString().split('T')[0];
    setFormData({
      valor: 0,
      status: "pendente",
      status_cobranca: "a_receber",
      forma_pagamento: "a_receber",
      data_inicio: dataAtual,
      data_fim: dataAtual,
      nfe_emitido: false,
    });
    
    setIsDialogOpen(true);
  };

  const handleEdit = (servico: Servico) => {
    if (!canEdit) return;
    setEditingServico(servico);
    setFormData(servico);
    setIsDialogOpen(true);
  };

  const handleView = (servico: Servico) => {
    setViewingServico(servico);
    setIsViewDialogOpen(true);
  };

  const handleViewCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    if (cliente) {
      setViewingCliente(cliente);
      setIsClienteDialogOpen(true);
    }
  };

  const handleDelete = (servico: Servico) => {
    if (!canEdit) return;
    if (confirm(`Deseja realmente excluir o serviço ${servico.titulo_servico}?`)) {
      deleteServico(servico.id);
      toast.success("Serviço excluído com sucesso!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToValidate = {
      ...formData,
      valor: typeof formData.valor === 'string' ? parseFloat(formData.valor) : (formData.valor ?? 0),
      status: formData.status || "pendente",
      status_cobranca: formData.status_cobranca || "a_receber",
      forma_pagamento: formData.forma_pagamento || "a_receber",
    };

    // Validate form data with zod
    const result = servicoSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    // Gerar título se não foi preenchido
    let titulo = result.data.titulo_servico;
    if (!titulo && result.data.maquina_id) {
      const categoriaSelecionada = categorias.find(c => c.id === result.data.maquina_id);
      titulo = categoriaSelecionada ? `Aluguel ${categoriaSelecionada.nome_maquina}` : "Serviço";
    }

    if (editingServico) {
      updateServico(editingServico.id, {
        ...result.data,
        titulo_servico: titulo || result.data.titulo_servico
      });
    } else {
      await addServico({
        cliente_id: result.data.cliente_id,
        maquina_id: result.data.maquina_id,
        titulo_servico: titulo || "Serviço",
        descricao: result.data.descricao || "",
        valor: result.data.valor,
        status: result.data.status,
        status_cobranca: result.data.status_cobranca,
        forma_pagamento: result.data.forma_pagamento,
        data_inicio: result.data.data_inicio,
        data_fim: result.data.data_fim,
        observacoes: result.data.observacoes || "",
        nfe_emitido: formData.nfe_emitido || false
      });
    }

    setIsDialogOpen(false);
    setFormData({});
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

  // Aplicar filtros locais
  const servicosFiltrados = servicos.filter(s => {
    const clienteMatch = filtrosLocais.cliente_id === "all" || s.cliente_id === filtrosLocais.cliente_id;
    const maquinaMatch = filtrosLocais.maquina_id === "all" || s.maquina_id === filtrosLocais.maquina_id;
    const statusCobrancaMatch = filtrosLocais.status_cobranca === "all" || s.status_cobranca === filtrosLocais.status_cobranca;
    const statusMatch = filtrosLocais.status === "all" || s.status === filtrosLocais.status;
    const formaPagamentoMatch = filtrosLocais.forma_pagamento === "all" || s.forma_pagamento === filtrosLocais.forma_pagamento;
    
    let dataMatch = true;
    if (filtrosLocais.data_inicio) {
      dataMatch = dataMatch && new Date(s.data_inicio) >= new Date(filtrosLocais.data_inicio);
    }
    if (filtrosLocais.data_fim) {
      dataMatch = dataMatch && new Date(s.data_fim) <= new Date(filtrosLocais.data_fim);
    }
    
    return clienteMatch && maquinaMatch && statusCobrancaMatch && statusMatch && formaPagamentoMatch && dataMatch;
  });

  // Função para aplicar ordenação automática
  const aplicarOrdenacaoAutomatica = (servicosArray: Servico[], tipoOrdenacao: string) => {
    if (tipoOrdenacao === "padrao") return servicosArray;
    
    const sortedArray = [...servicosArray];
    
    switch (tipoOrdenacao) {
      case "data_mais_antigo":
        return sortedArray.sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());
      
      case "data_mais_recente":
        return sortedArray.sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime());
      
      case "valor_maior":
        return sortedArray.sort((a, b) => b.valor - a.valor);
      
      case "valor_menor":
        return sortedArray.sort((a, b) => a.valor - b.valor);
      
      case "titulo_az":
        return sortedArray.sort((a, b) => a.titulo_servico.localeCompare(b.titulo_servico));
      
      case "titulo_za":
        return sortedArray.sort((a, b) => b.titulo_servico.localeCompare(a.titulo_servico));
      
      case "categoria_az":
        return sortedArray.sort((a, b) => {
          const catA = categorias.find(c => c.id === a.maquina_id)?.nome_maquina || "";
          const catB = categorias.find(c => c.id === b.maquina_id)?.nome_maquina || "";
          return catA.localeCompare(catB);
        });
      
      case "categoria_za":
        return sortedArray.sort((a, b) => {
          const catA = categorias.find(c => c.id === a.maquina_id)?.nome_maquina || "";
          const catB = categorias.find(c => c.id === b.maquina_id)?.nome_maquina || "";
          return catB.localeCompare(catA);
        });
      
      case "status_crescente":
        return sortedArray.sort((a, b) => a.status.localeCompare(b.status));
      
      case "status_decrescente":
        return sortedArray.sort((a, b) => b.status.localeCompare(a.status));
      
      case "cobranca_pago":
        return sortedArray.sort((a, b) => (a.status_cobranca === "pago" ? -1 : 1));
      
      case "cobranca_receber":
        return sortedArray.sort((a, b) => (a.status_cobranca === "a_receber" ? -1 : 1));
      
      default:
        return servicosArray;
    }
  };

  const servicosExibidos = aplicarOrdenacaoAutomatica(servicosFiltrados, ordenacaoAutomatica);

  const restaurarOrdemOriginal = () => {
    setOrdenacaoAutomatica("padrao");
    toast.info("Ordem original restaurada");
  };

  const handleOrdenacaoChange = (novaOrdenacao: string) => {
    setOrdenacaoAutomatica(novaOrdenacao);
    
    if (novaOrdenacao !== "padrao") {
      toast.success("Ordenação automática aplicada");
    }
  };

  const columns = [
    { header: "Título", accessor: "titulo_servico" as keyof Servico, sortable: true },
    { 
      header: "Cliente", 
      accessor: ((item: Servico) => clientes.find(c => c.id === item.cliente_id)?.nome || "N/A") as any
    },
    { 
      header: "Máquina", 
      accessor: ((item: Servico) => categorias.find(c => c.id === item.maquina_id)?.nome_maquina || "N/A") as any
    },
    { 
      header: "Valor", 
      accessor: ((item: Servico) => `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) as any
    },
    { 
      header: "Status", 
      accessor: ((item: Servico) => getStatusBadge(item.status)) as any
    },
    { 
      header: "Cobrança", 
      accessor: ((item: Servico) => getCobrancaBadge(item.status_cobranca)) as any
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">Gerencie seus serviços e aluguéis</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ordenacaoAutomatica !== "padrao" && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={restaurarOrdemOriginal}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar ordem
              </Button>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                Ordenação automática ativa
              </Badge>
            </>
          )}
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('cards')}
            title="Visualizar em cards"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
            title="Visualizar em tabela"
          >
            <List className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Button>
          )}
        </div>
      </div>

      <FiltrosServicos 
        filtros={filtrosLocais} 
        onFiltrosChange={setFiltrosLocais}
        clientes={clientes}
        categorias={categorias}
        ordenacao={ordenacaoAutomatica}
        onOrdenacaoChange={handleOrdenacaoChange}
      />

      {viewMode === 'cards' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicosExibidos.length > 0 ? (
            servicosExibidos.map((servico) => (
              <ServicoCard
                key={servico.id}
                servico={servico}
                cliente={clientes.find(c => c.id === servico.cliente_id)}
                categoria={categorias.find(c => c.id === servico.maquina_id)}
                onView={() => handleView(servico)}
                onEdit={canEdit ? () => handleEdit(servico) : undefined}
                onDelete={canEdit ? () => handleDelete(servico) : undefined}
                canEdit={canEdit}
                canDelete={canEdit}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">
              Nenhum serviço encontrado
            </p>
          )}
        </div>
      ) : (
        <DataTable
          data={servicosExibidos}
          columns={columns}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canEdit ? handleDelete : undefined}
          searchPlaceholder="Buscar serviços..."
          emptyMessage="Nenhum serviço cadastrado"
          canEdit={canEdit}
          canDelete={canEdit}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingServico ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do serviço abaixo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cliente_id">Cliente *</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {[...clientes]
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maquina_id">Máquina/Categoria *</Label>
              <Select
                value={formData.maquina_id}
                onValueChange={(value) => setFormData({ ...formData, maquina_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma máquina" />
                </SelectTrigger>
                <SelectContent>
                  {[...categorias]
                    .sort((a, b) => a.nome_maquina.localeCompare(b.nome_maquina))
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome_maquina}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo_servico">Título do Serviço</Label>
              <Input
                id="titulo_servico"
                placeholder="Gerado automaticamente baseado na máquina"
                value={formData.titulo_servico || ""}
                onChange={(e) => setFormData({ ...formData, titulo_servico: e.target.value })}
                disabled={!formData.maquina_id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes do serviço"
                value={formData.descricao || ""}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.valor ?? ""}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status (Padrão: Pendente)</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status_cobranca">Status Cobrança (Padrão: A Receber)</Label>
                <Select
                  value={formData.status_cobranca}
                  onValueChange={(value: any) => setFormData({ ...formData, status_cobranca: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forma_pagamento">Forma de Pagamento (Padrão: A Receber)</Label>
                <Select
                  value={formData.forma_pagamento}
                  onValueChange={(value: any) => setFormData({ ...formData, forma_pagamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_receber">A Receber</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="nfe_emitido"
                checked={formData.nfe_emitido || false}
                onCheckedChange={(checked) => setFormData({ ...formData, nfe_emitido: !!checked })}
              />
              <Label htmlFor="nfe_emitido" className="cursor-pointer">Emitido NF-e</Label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data Início (Padrão: Hoje) *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio || ""}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data Fim (Padrão: Hoje) *</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim || ""}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais"
                value={formData.observacoes || ""}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingServico ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Cliente</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-base">{clientes.find(c => c.id === viewingServico.cliente_id)?.nome || "N/A"}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewCliente(viewingServico.cliente_id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
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

              <div>
                <Label className="text-sm font-semibold text-muted-foreground">NF-e Emitida</Label>
                <div className="mt-1">
                  {viewingServico.nfe_emitido ? (
                    <Badge className="bg-success text-success-foreground">Sim</Badge>
                  ) : (
                    <Badge variant="secondary">Não</Badge>
                  )}
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

      {/* Dialog de Visualização de Cliente */}
      <Dialog open={isClienteDialogOpen} onOpenChange={setIsClienteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas do cliente</DialogDescription>
          </DialogHeader>

          {viewingCliente && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Nome</Label>
                <p className="text-base">{viewingCliente.nome}</p>
              </div>

              {viewingCliente.cpf_cnpj && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">CPF/CNPJ</Label>
                  <p className="text-base">{viewingCliente.cpf_cnpj}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {viewingCliente.telefone && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Telefone</Label>
                    <p className="text-base">{viewingCliente.telefone}</p>
                  </div>
                )}

                {viewingCliente.email && (
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
                    <p className="text-base">{viewingCliente.email}</p>
                  </div>
                )}
              </div>

              {viewingCliente.endereco && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Endereço</Label>
                  <p className="text-base whitespace-pre-wrap">{viewingCliente.endereco}</p>
                </div>
              )}

              {viewingCliente.observacoes && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Observações</Label>
                  <p className="text-base whitespace-pre-wrap">{viewingCliente.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

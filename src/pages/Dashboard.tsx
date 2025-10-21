import { useData } from "@/contexts/DataContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { FiltrosGlobais } from "@/components/dashboard/FiltrosGlobais";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  CheckCircle 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const COR_PAGO = "#22c55e"; // verde
const COR_A_RECEBER = "#ef4444"; // vermelho
const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function Dashboard() {
  const { servicos, categorias, filtros } = useData();

  // Filtrar serviços
  const servicosFiltrados = servicos.filter(s => {
    const dataInicio = new Date(s.data_inicio);
    const mesServico = String(dataInicio.getMonth() + 1).padStart(2, '0');
    const anoServico = String(dataInicio.getFullYear());
    
    const mesMatch = filtros.mes === "all" || mesServico === filtros.mes;
    const anoMatch = filtros.ano === "all" || anoServico === filtros.ano;
    const catMatch = filtros.categoria_id === "all" || s.maquina_id === filtros.categoria_id;
    
    return mesMatch && anoMatch && catMatch;
  });

  // Calcular KPIs
  const totalAluguel = servicosFiltrados.reduce((sum, s) => sum + s.valor, 0);
  const totalPago = servicosFiltrados
    .filter(s => s.status_cobranca === "pago")
    .reduce((sum, s) => sum + s.valor, 0);
  const totalAReceber = servicosFiltrados
    .filter(s => s.status_cobranca === "a_receber")
    .reduce((sum, s) => sum + s.valor, 0);

  // Produto mais solicitado
  const contagemProdutos = servicosFiltrados.reduce((acc, s) => {
    acc[s.maquina_id] = (acc[s.maquina_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const produtosOrdenados = Object.entries(contagemProdutos)
    .sort(([, a], [, b]) => b - a);

  const produtoMaisSolicitado = produtosOrdenados[0]
    ? categorias.find(c => c.id === produtosOrdenados[0][0])?.nome_maquina || "N/A"
    : "N/A";

  const segundoProduto = produtosOrdenados[1]
    ? categorias.find(c => c.id === produtosOrdenados[1][0])?.nome_maquina || "N/A"
    : "N/A";

  // Dados para gráfico de linha (faturamento por mês)
  const faturamentoPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = String(i + 1).padStart(2, '0');
    const valor = servicos
      .filter(s => {
        const dataInicio = new Date(s.data_inicio);
        return String(dataInicio.getMonth() + 1).padStart(2, '0') === mes &&
               String(dataInicio.getFullYear()) === filtros.ano;
      })
      .reduce((sum, s) => sum + s.valor, 0);
    
    return {
      mes: mesesNomes[i],
      valor
    };
  });

  // Dados para gráfico de barras (pago x a receber por mês)
  const pagoAReceberPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = String(i + 1).padStart(2, '0');
    const servicosMes = servicos.filter(s => {
      const dataInicio = new Date(s.data_inicio);
      return String(dataInicio.getMonth() + 1).padStart(2, '0') === mes &&
             String(dataInicio.getFullYear()) === filtros.ano;
    });
    
    const pago = servicosMes.filter(s => s.status_cobranca === "pago").reduce((sum, s) => sum + s.valor, 0);
    const aReceber = servicosMes.filter(s => s.status_cobranca === "a_receber").reduce((sum, s) => sum + s.valor, 0);
    
    return { mes: mesesNomes[i], pago, a_receber: aReceber };
  });

  // Dados para gráfico de pizza (pago x a receber total)
  const pagoAReceberTotal = [
    { nome: "Pago", valor: totalPago },
    { nome: "A Receber", valor: totalAReceber }
  ].filter(d => d.valor > 0);

  // Dados para gráfico de linhas (faturamento de cada categoria por mês)
  const faturamentoCategoriasPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = String(i + 1).padStart(2, '0');
    const dadosMes: any = { mes: mesesNomes[i] };
    
    categorias.forEach(cat => {
      const valor = servicos.filter(s => {
        const dataInicio = new Date(s.data_inicio);
        return s.maquina_id === cat.id &&
               String(dataInicio.getMonth() + 1).padStart(2, '0') === mes &&
               String(dataInicio.getFullYear()) === filtros.ano;
      }).reduce((sum, s) => sum + s.valor, 0);
      
      dadosMes[cat.nome_maquina] = valor;
    });
    
    return dadosMes;
  });

  // Dados para gráfico de pizza (faturamento anual por categoria)
  const faturamentoAnualPorCategoria = categorias.map(cat => {
    const valor = servicosFiltrados
      .filter(s => s.maquina_id === cat.id)
      .reduce((sum, s) => sum + s.valor, 0);
    
    return {
      nome: cat.nome_maquina,
      valor
    };
  }).filter(d => d.valor > 0);

  const coresPagoAReceber = [COR_PAGO, COR_A_RECEBER];

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <FiltrosGlobais />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total em Aluguéis"
          value={`R$ ${totalAluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle={`${servicosFiltrados.length} serviços`}
          icon={DollarSign}
          variant="default"
        />
        <KPICard
          title="Total Pago"
          value={`R$ ${totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Recebido"
          icon={CheckCircle}
          variant="success"
        />
        <KPICard
          title="Total a Receber"
          value={`R$ ${totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Pendente"
          icon={TrendingUp}
          variant="warning"
        />
        <KPICard
          title="Produto Mais Solicitado"
          value={produtoMaisSolicitado}
          subtitle={`2º lugar: ${segundoProduto}`}
          icon={Package}
        />
      </div>

      {/* Gráficos - Linha 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento por Mês</CardTitle>
            <CardDescription>Receita mensal de {filtros.ano}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={faturamentoPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  name="Faturamento (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pago x A Receber por Mês</CardTitle>
            <CardDescription>Comparativo mensal de {filtros.ano}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pagoAReceberPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
                <Bar dataKey="pago" fill={COR_PAGO} name="Pago (R$)" />
                <Bar dataKey="a_receber" fill={COR_A_RECEBER} name="A Receber (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Linha 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pago x A Receber - Total</CardTitle>
            <CardDescription>Distribuição geral</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pagoAReceberTotal}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {pagoAReceberTotal.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={coresPagoAReceber[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturamento por Categoria</CardTitle>
            <CardDescription>Distribuição do faturamento total</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={faturamentoAnualPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {faturamentoAnualPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico - Linha 3 (Full Width) */}
      <Card>
        <CardHeader>
          <CardTitle>Faturamento por Categoria e Mês</CardTitle>
          <CardDescription>Evolução mensal do faturamento de cada categoria em {filtros.ano}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={faturamentoCategoriasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }}
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <Legend />
              {categorias.map((cat, index) => (
                <Line
                  key={cat.id}
                  type="monotone"
                  dataKey={cat.nome_maquina}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  name={cat.nome_maquina}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

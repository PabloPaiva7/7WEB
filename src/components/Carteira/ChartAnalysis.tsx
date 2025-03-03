
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/Painel/ChartCard";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface ChartAnalysisProps {
  estatisticas: {
    totalClientes: number;
    porSituacao: Record<string, number>;
    porBanco: Record<string, number>;
    valorTotal: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ChartAnalysis = ({ estatisticas }: ChartAnalysisProps) => {
  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const dadosPizza = Object.entries(estatisticas.porBanco).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  const dadosTendencia = [
    { mes: 'Jan', valor: 42000 },
    { mes: 'Fev', valor: 53000 },
    { mes: 'Mar', valor: 48000 },
    { mes: 'Abr', valor: 62000 },
    { mes: 'Mai', valor: 78000 },
    { mes: 'Jun', valor: 83000 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Análise da Carteira</CardTitle>
            <CardDescription>Distribuição de contratos por situação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-xl font-bold">{estatisticas.totalClientes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(estatisticas.valorTotal)}
                  </p>
                </div>
              </div>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dadosGrafico} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição por Banco</CardTitle>
            <CardDescription>Análise do volume por instituição financeira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChartCard 
        title="Evolução da Carteira" 
        description="Valores totais nos últimos 6 meses"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dadosTendencia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value)
              } 
            />
            <Tooltip 
              formatter={(value: number) => 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value)
              }
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="#8884d8" 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
};

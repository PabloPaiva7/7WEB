
import { ChartCard } from "./ChartCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Dados de exemplo aprimorados
const lineChartData = [
  { name: 'Jan', valor: 4000, aprovados: 3200 },
  { name: 'Fev', valor: 3000, aprovados: 2100 },
  { name: 'Mar', valor: 2000, aprovados: 1400 },
  { name: 'Abr', valor: 2780, aprovados: 1908 },
  { name: 'Mai', valor: 1890, aprovados: 1600 },
  { name: 'Jun', valor: 2390, aprovados: 2000 },
];

const pieData = [
  { name: 'Contrato', value: 400, color: '#0088FE' },
  { name: 'Processo', value: 300, color: '#00C49F' },
  { name: 'Audiência', value: 300, color: '#FFBB28' },
  { name: 'Documento', value: 200, color: '#FF8042' },
];

const barData = [
  { nome: 'Banco A', processos: 35, aprovados: 28 },
  { nome: 'Banco B', processos: 25, aprovados: 18 },
  { nome: 'Banco C', processos: 40, aprovados: 30 },
  { nome: 'Banco D', processos: 20, aprovados: 15 },
  { nome: 'Outros', processos: 15, aprovados: 10 },
];

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <ChartCard
        title="Evolução de Demandas"
        description="Valor total e aprovações nos últimos 6 meses"
        className="lg:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)", 
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              }} 
              formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="valor" 
              name="Valor Total" 
              stroke="#8884d8" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="aprovados" 
              name="Aprovados" 
              stroke="#82ca9d" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Tipos de Demandas"
        description="Distribuição por categoria"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} itens`, 'Quantidade']}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Desempenho por Banco"
        description="Processos totais e aprovados por instituição"
        className="lg:col-span-3"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} processos`, '']}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              }}
            />
            <Legend />
            <Bar dataKey="processos" fill="#8884d8" name="Total de Processos" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aprovados" fill="#82ca9d" name="Aprovados" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

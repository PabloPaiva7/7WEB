
import { ChartCard } from "./ChartCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Dados de exemplo
const lineChartData = [
  { name: 'Jan', valor: 4000 },
  { name: 'Fev', valor: 3000 },
  { name: 'Mar', valor: 2000 },
  { name: 'Abr', valor: 2780 },
  { name: 'Mai', valor: 1890 },
  { name: 'Jun', valor: 2390 },
];

const pieData = [
  { name: 'Contrato', value: 400 },
  { name: 'Processo', value: 300 },
  { name: 'Audiência', value: 300 },
  { name: 'Documento', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard
        title="Evolução de Demandas"
        description="Número de demandas nos últimos 6 meses"
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
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
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EvolucaoLineChartProps {
  dados: { mes: string; valor: number }[];
}

export const EvolucaoLineChart = ({ dados }: EvolucaoLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
        <XAxis dataKey="mes" className="dark:text-[#D9B300]/70" />
        <YAxis 
          tickFormatter={(value) => 
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value)
          } 
          className="dark:text-[#D9B300]/70"
        />
        <Tooltip 
          formatter={(value: number) => 
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)
          }
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            border: 'none',
            borderRadius: '4px',
            color: '#D9B300'
          }}
        />
        <Legend className="dark:text-[#D9B300]" />
        <Line 
          type="monotone" 
          dataKey="valor" 
          stroke="#8884d8" 
          strokeWidth={2}
          activeDot={{ r: 8 }} 
          className="dark:stroke-[#D9B300]"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const DARK_COLORS = ['#D9B300', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface BancoBarChartProps {
  dados: { name: string; value: number }[];
}

export const BancoBarChart = ({ dados }: BancoBarChartProps) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis dataKey="name" className="dark:text-[#D9B300]/70" />
          <YAxis className="dark:text-[#D9B300]/70" />
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
            labelStyle={{
              color: isDark ? '#D9B300' : 'inherit'
            }}
          />
          <Bar dataKey="value">
            {dados.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

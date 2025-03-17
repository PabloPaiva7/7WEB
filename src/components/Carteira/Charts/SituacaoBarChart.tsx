
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SituacaoBarChartProps {
  dados: { nome: string; valor: number }[];
}

export const SituacaoBarChart = ({ dados }: SituacaoBarChartProps) => {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={dados} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
          <XAxis dataKey="nome" className="dark:text-[#D9B300]/70" />
          <YAxis className="dark:text-[#D9B300]/70" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '4px',
              color: '#D9B300'
            }} 
          />
          <Bar dataKey="valor" fill="#8884d8" className="dark:fill-[#D9B300]" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

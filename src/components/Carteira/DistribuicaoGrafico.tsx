
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface DistribuicaoGraficoProps {
  dadosGrafico: { banco: string; valor: number }[];
}

export const DistribuicaoGrafico = ({ dadosGrafico }: DistribuicaoGraficoProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Banco</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosGrafico}
              dataKey="valor"
              nameKey="banco"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ banco, percent }) => 
                `${banco} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {dadosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => 
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value)
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

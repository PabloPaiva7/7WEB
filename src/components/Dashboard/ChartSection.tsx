
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dados de exemplo para os gráficos
const performanceData = [
  { nome: "Jan", processos: 400, aprovados: 240 },
  { nome: "Fev", processos: 300, aprovados: 198 },
  { nome: "Mar", processos: 200, aprovados: 150 },
  { nome: "Abr", processos: 278, aprovados: 190 },
  { nome: "Mai", processos: 189, aprovados: 134 },
  { nome: "Jun", processos: 239, aprovados: 187 },
  { nome: "Jul", processos: 349, aprovados: 256 },
];

const situacaoData = [
  { name: "Pendente", value: 30 },
  { name: "Em análise", value: 25 },
  { name: "Aprovado", value: 45 },
  { name: "Recusado", value: 15 },
  { name: "Finalizado", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const bancoData = [
  { nome: "Banco A", count: 52 },
  { nome: "Banco B", count: 38 },
  { nome: "Banco C", count: 43 },
  { nome: "Banco D", count: 29 },
  { nome: "Banco E", count: 34 },
  { nome: "Outros", count: 18 },
];

export const ChartSection = () => {
  return (
    <div className="grid gap-6 my-6 grid-cols-1 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="dark:text-[#D9B300]">Performance Mensal</CardTitle>
          <CardDescription className="dark:text-[#D9B300]/80">
            Quantidade de processos e aprovações por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={performanceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "0.5rem",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="processos" fill="#8884d8" name="Processos" />
              <Bar dataKey="aprovados" fill="#82ca9d" name="Aprovados" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-[#D9B300]">Situação dos Processos</CardTitle>
          <CardDescription className="dark:text-[#D9B300]/80">
            Distribuição por status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={situacaoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {situacaoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-[#D9B300]">Processos por Banco</CardTitle>
          <CardDescription className="dark:text-[#D9B300]/80">
            Quantidade por instituição financeira
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={bancoData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Quantidade"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

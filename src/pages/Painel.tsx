
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CircleDollarSign,
  ClipboardList,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  BarChart3,
  PieChart,
  TrendingUp
} from "lucide-react";
import { StatisticsSection } from "@/components/Painel/StatisticsSection";
import { ChartSection } from "@/components/Painel/ChartSection";
import { GoalsSection } from "@/components/Painel/GoalsSection";

const Painel = () => {
  return (
    <div className="p-4 space-y-6 animate-in">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground">Visualize seu desempenho e acompanhe seus indicadores.</p>
      </div>
      
      <Separator className="my-4" />
      
      {/* Cards estatísticos principais */}
      <StatisticsSection />

      {/* Seção de gráficos */}
      <ChartSection />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              Contratos Recentes
              <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${item % 2 === 0 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Contrato #{1000 + item}</p>
                    <p className="text-xs text-muted-foreground">Cliente {item} • Adicionado há {item} dias</p>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${item % 2 === 0 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {item % 2 === 0 ? "Em dia" : "Pendente"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              Status de Aprovações
              <BarChart3 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Aprovados</span>
                  <span className="ml-auto text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" indicatorClassName="bg-green-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Em análise</span>
                  <span className="ml-auto text-sm font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" indicatorClassName="bg-amber-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm">Recusados</span>
                  <span className="ml-auto text-sm font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2" indicatorClassName="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500 dark:border-l-emerald-400">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              Resumo Financeiro
              <CircleDollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CircleDollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">Total a receber</span>
                <span className="ml-auto font-bold">R$ 876.435,00</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CircleDollarSign className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Recebido este mês</span>
                <span className="ml-auto font-bold text-green-500">R$ 123.456,00</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CircleDollarSign className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-sm">Pendente</span>
                <span className="ml-auto font-bold text-amber-500">R$ 45.678,00</span>
              </div>
              <div className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CircleDollarSign className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm">Em atraso</span>
                <span className="ml-auto font-bold text-red-500">R$ 12.345,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Seção de metas */}
      <GoalsSection />
    </div>
  );
};

export default Painel;

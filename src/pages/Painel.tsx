
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  ClipboardList,
  Users,
  Calendar,
  PieChart,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Painel = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Painel de Controle</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.456.578,00</div>
            <p className="text-xs text-muted-foreground">+20% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">325</div>
            <p className="text-xs text-muted-foreground">+5 novos esta semana</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processos</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
            <p className="text-xs text-muted-foreground">98 com pagamento em dia</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Para essa semana</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Desempenho por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <PieChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-sm text-muted-foreground">
                Gráfico de desempenho mensal (visualização real será implementada)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tendências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-sm text-muted-foreground">
                Gráfico de tendências (visualização real será implementada)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Contratos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Contrato #{1000 + item}</p>
                    <p className="text-xs text-muted-foreground">Cliente {item} • Adicionado há {item} dias</p>
                  </div>
                  <div className={`text-xs ${item % 2 === 0 ? "text-green-500" : "text-amber-500"}`}>
                    {item % 2 === 0 ? "Em dia" : "Pendente"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status de Aprovações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Aprovados</span>
                  <span className="ml-auto text-sm">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-sm">Em análise</span>
                  <span className="ml-auto text-sm">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                  <span className="text-sm">Recusados</span>
                  <span className="ml-auto text-sm">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm">Total a receber</span>
                <span className="ml-auto font-bold">R$ 876.435,00</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Recebido este mês</span>
                <span className="ml-auto font-bold text-green-500">R$ 123.456,00</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-sm">Pendente</span>
                <span className="ml-auto font-bold text-amber-500">R$ 45.678,00</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-destructive mr-2" />
                <span className="text-sm">Em atraso</span>
                <span className="ml-auto font-bold text-destructive">R$ 12.345,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Painel;

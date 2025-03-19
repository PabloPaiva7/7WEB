
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, Users, FileCheck, BarChart } from "lucide-react";
import { ReportCard } from "@/components/Relatorios/ReportCard";
import { DesempenhoReportCard } from "@/components/Relatorios/DesempenhoReportCard";

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-[#D9B300]">Relatórios</h1>
        <p className="text-muted-foreground dark:text-[#D9B300]/80">
          Gere e baixe relatórios automatizados do sistema.
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="artes">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="artes">Preenchimento Artes</TabsTrigger>
          <TabsTrigger value="consultores">Consultores</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
        </TabsList>
        
        <TabsContent value="artes" className="mt-6">
          <ReportCard
            reportType="artes"
            title="Relatório de Preenchimento Artes"
            description="Informações sobre preenchimento de formulários de artes"
            icon={FileSpreadsheet}
            alertText="Este relatório contém dados sobre o preenchimento de artes, incluindo datas, responsáveis e status."
          />
        </TabsContent>
        
        <TabsContent value="consultores" className="mt-6">
          <ReportCard
            reportType="consultores"
            title="Relatório de Consultores"
            description="Análise de performance dos consultores"
            icon={Users}
            alertText="Este relatório contém dados sobre desempenho dos consultores, incluindo número de clientes, valores negociados e taxa de conversão."
          />
        </TabsContent>
        
        <TabsContent value="aprovados" className="mt-6">
          <ReportCard
            reportType="aprovados"
            title="Relatório de Aprovados"
            description="Lista de contratos aprovados e seus detalhes"
            icon={FileCheck}
            alertText="Este relatório contém dados sobre contratos aprovados, incluindo informações do cliente, valores e datas de aprovação."
          />
        </TabsContent>
        
        <TabsContent value="desempenho" className="mt-6">
          <DesempenhoReportCard
            title="Relatório de Desempenho"
            description="Desempenho do usuário por status de processo"
            icon={BarChart}
            alertText="Este relatório contém estatísticas de desempenho do usuário, categorizado por status de processos em períodos diários e mensais."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;


import React from "react";
import {
  Users,
  ArrowUpRight,
  Building2,
  BadgePercent,
  FileCheck,
  HardDrive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground dark:text-[#D9B300]/80">
          {title}
        </span>
        <div className="p-2 bg-muted rounded-full dark:bg-gray-800">
          <Icon className="h-5 w-5 text-foreground dark:text-[#D9B300]" />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1 dark:text-[#D9B300]">{value}</div>
      <div
        className={`flex items-center text-sm ${
          positive ? "text-green-500" : "text-red-500"
        }`}
      >
        <ArrowUpRight className="h-4 w-4 mr-1" />
        <span>{change} comparado ao mês anterior</span>
      </div>
    </CardContent>
  </Card>
);

export const MetricsCards = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <MetricCard
        title="Consultores Ativos"
        value="64"
        change="+12%"
        icon={Users}
      />
      <MetricCard
        title="Processos"
        value="1,284"
        change="+8.2%"
        icon={FileCheck}
      />
      <MetricCard
        title="Escritórios"
        value="32"
        change="+3.1%"
        icon={Building2}
      />
      <MetricCard
        title="Média de Desconto"
        value="15.4%"
        change="-2.5%"
        icon={BadgePercent}
        positive={false}
      />
      <MetricCard
        title="Bancos Parceiros"
        value="8"
        change="+1"
        icon={HardDrive}
      />
      <MetricCard
        title="Taxa de Aprovação"
        value="72.8%"
        change="+4.3%"
        icon={FileCheck}
      />
    </div>
  );
};

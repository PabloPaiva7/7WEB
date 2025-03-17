
import React from "react";
import { CalendarDateRangePicker } from "./DateRangePicker";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-[#D9B300]">Dashboard</h1>
        <p className="text-muted-foreground dark:text-[#D9B300]/80">
          Visualize métricas e análises de performance
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <CalendarDateRangePicker />
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Atualizar</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Download className="h-3.5 w-3.5" />
          <span>Exportar</span>
        </Button>
      </div>
    </div>
  );
};

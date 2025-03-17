
import React from "react";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { MetricsCards } from "@/components/Dashboard/MetricsCards";
import { ChartSection } from "@/components/Dashboard/ChartSection";
import { MapSection } from "@/components/Dashboard/MapSection";
import { DataTable } from "@/components/Dashboard/DataTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <Separator className="my-6" />
      <MetricsCards />
      <ChartSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <MapSection />
        <DataTable />
      </div>
    </div>
  );
};

export default Dashboard;

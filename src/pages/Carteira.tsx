
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarteiraHeader } from "@/components/Carteira/CarteiraHeader";
import { KpiCards } from "@/components/Carteira/KpiCards";
import { DashboardCards } from "@/components/Carteira/DashboardCards";
import { ChartAnalysis } from "@/components/Carteira/ChartAnalysis";
import { ClientesTable } from "@/components/Carteira/ClientesTable";
import { HistoricoCard } from "@/components/Carteira/HistoricoCard";
import { ClienteDialog } from "@/components/Carteira/ClienteDialog";
import { useClientesCarteira } from "@/hooks/useClientesCarteira";
import { columnConfig } from "@/config/columnConfig";
import { Calculadora } from "@/components/Calculadora";
import { TabelaFipe } from "@/components/TabelaFipe";
import { Calculator, BarChart2, Car } from "lucide-react";

const Carteira = () => {
  const [activeTab, setActiveTab] = useState<string>("carteira");
  const {
    filteredClientes,
    historico,
    editingCliente,
    isDialogOpen,
    searchTerm,
    estatisticas,
    setIsDialogOpen,
    setSearchTerm,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleFileUpload,
    handleFilterChange
  } = useClientesCarteira();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">Carteira</h1>
      
      <Tabs 
        defaultValue="carteira" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-[600px] grid-cols-3" aria-label="Opções da carteira">
          <TabsTrigger value="carteira" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" aria-hidden="true" />
            <span>Carteira</span>
          </TabsTrigger>
          <TabsTrigger value="calculadora" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span>Calculadora</span>
          </TabsTrigger>
          <TabsTrigger value="tabela-fipe" className="flex items-center gap-2">
            <Car className="h-4 w-4" aria-hidden="true" />
            <span>Tabela FIPE</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="carteira" className="mt-6">
          {/* Dialog para adicionar/editar cliente */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <CarteiraHeader 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onFilterChange={handleFilterChange}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onFileUpload={handleFileUpload}
            />
            <ClienteDialog 
              editingCliente={editingCliente}
              columnConfig={columnConfig}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          </Dialog>

          {/* KPI Cards */}
          <KpiCards 
            totalClientes={estatisticas.totalClientes}
            valorTotal={estatisticas.valorTotal}
            mediaPrazo={estatisticas.mediaPrazo}
          />

          {/* Dashboard Cards */}
          <DashboardCards />

          {/* Charts */}
          <ChartAnalysis estatisticas={estatisticas} />

          {/* Tabela de Clientes */}
          <ClientesTable 
            clientes={filteredClientes}
            columnConfig={columnConfig}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Histórico */}
          <HistoricoCard historico={historico} />
        </TabsContent>
        
        <TabsContent value="calculadora" className="mt-6">
          <Calculadora />
        </TabsContent>

        <TabsContent value="tabela-fipe" className="mt-6">
          <TabelaFipe />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Carteira;

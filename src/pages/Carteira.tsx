
import { Dialog } from "@/components/ui/dialog";
import { CarteiraHeader } from "@/components/Carteira/CarteiraHeader";
import { KpiCards } from "@/components/Carteira/KpiCards";
import { DashboardCards } from "@/components/Carteira/DashboardCards";
import { ChartAnalysis } from "@/components/Carteira/ChartAnalysis";
import { ClientesTable } from "@/components/Carteira/ClientesTable";
import { HistoricoCard } from "@/components/Carteira/HistoricoCard";
import { ClienteDialog } from "@/components/Carteira/ClienteDialog";
import { useClientesCarteira, columnConfig } from "@/hooks/useClientesCarteira";

const Carteira = () => {
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
    </div>
  );
};

export default Carteira;

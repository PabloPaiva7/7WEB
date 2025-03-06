
import { useClientesCrud } from "./useClientesCrud";
import { useClientesFiltro } from "./useClientesFiltro";
import { calcularEstatisticas } from "@/utils/carteiraUtils";
import { columnConfig } from "@/config/columnConfig";

export const useClientesCarteira = () => {
  const {
    clientes,
    historico,
    editingCliente,
    isDialogOpen,
    setIsDialogOpen,
    setHistorico,
    handleSubmit,
    handleDelete,
    handleEdit,
    handleFileUpload
  } = useClientesCrud();

  const {
    filteredClientes,
    searchTerm,
    handleFilterChange,
    setSearchTerm
  } = useClientesFiltro(clientes, setHistorico);

  // Calcular estatísticas
  const estatisticas = calcularEstatisticas(filteredClientes);

  return {
    clientes,
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
  };
};

// Export column config to maintain backward compatibility
export { columnConfig };

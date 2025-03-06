
import { useState, useEffect } from "react";
import { Cliente } from "@/components/Carteira/ClientesTable";
import { FilterState, HistoricoItem } from "@/types/carteira.types";

export const useClientesFiltro = (
  clientes: Cliente[],
  setHistorico: (fn: (prev: HistoricoItem[]) => HistoricoItem[]) => void
) => {
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    banco: "",
    escritorio: "",
    prazo: ""
  });

  // Atualiza os clientes filtrados quando os clientes originais mudarem
  useEffect(() => {
    applyFilters(clientes, filters, searchTerm);
  }, [clientes]);

  const applyFilters = (
    clientesList: Cliente[],
    filterValues: FilterState,
    search: string
  ) => {
    let filtered = clientesList;
    
    if (filterValues.banco && filterValues.banco !== 'todos') {
      filtered = filtered.filter(c => c.banco === filterValues.banco);
    }
    if (filterValues.escritorio && filterValues.escritorio !== 'todos') {
      filtered = filtered.filter(c => c.escritorio === filterValues.escritorio);
    }
    if (filterValues.prazo && filterValues.prazo !== 'todos') {
      filtered = filtered.filter(c => c.prazo === filterValues.prazo);
    }
    if (search) {
      filtered = filtered.filter(c => 
        Object.values(c).some(value => 
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    setFilteredClientes(filtered);
  };

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    applyFilters(clientes, newFilters, searchTerm);
    
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: `Filtro aplicado: ${type} = ${value}`
    }]);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(clientes, filters, value);
  };

  return {
    filteredClientes,
    searchTerm,
    filters,
    handleFilterChange,
    setSearchTerm: handleSearchChange
  };
};

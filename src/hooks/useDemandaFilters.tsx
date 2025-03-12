
import { useState } from "react";
import { Demanda } from "@/types/demanda";
import { filterAndSortDemandas, filterDemandasByStatus } from "@/components/Painel/DemandaFiltering";

type SortField = 'prioridade' | 'criacao' | 'tempoProcessamento';
type SortOrder = 'asc' | 'desc';

export const useDemandaFilters = (demandas: Demanda[]) => {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [sortField, setSortField] = useState<SortField>('criacao');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterPrioridade, setFilterPrioridade] = useState<Demanda['prioridade'] | 'todas'>('todas');

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Apply filters and sorting
  const filteredDemandas = filterAndSortDemandas(
    demandas,
    filterPrioridade,
    sortField,
    sortOrder
  );

  // Filter demandas by status
  const {
    novos,
    emAndamento,
    encaminhados,
    confirmados,
    finalizados
  } = filterDemandasByStatus(filteredDemandas);

  return {
    activeTab,
    setActiveTab,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filterPrioridade,
    setFilterPrioridade,
    toggleSortOrder,
    filteredDemandas,
    novos,
    emAndamento,
    encaminhados,
    confirmados,
    finalizados
  };
};

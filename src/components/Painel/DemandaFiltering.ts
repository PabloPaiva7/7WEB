
import { Demanda } from "@/types/demanda";

type SortField = 'prioridade' | 'criacao' | 'tempoProcessamento';
type SortOrder = 'asc' | 'desc';

export const filterAndSortDemandas = (
  demandas: Demanda[],
  filterPrioridade: Demanda['prioridade'] | 'todas',
  sortField: SortField,
  sortOrder: SortOrder
): Demanda[] => {
  // Apply filters
  let filteredDemandas = [...demandas];
  
  if (filterPrioridade !== 'todas') {
    filteredDemandas = filteredDemandas.filter(d => d.prioridade === filterPrioridade);
  }
  
  // Apply sorting
  filteredDemandas.sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'prioridade') {
      const priorityMap = { 'alta': 3, 'media': 2, 'baixa': 1 };
      comparison = (priorityMap[a.prioridade] || 0) - (priorityMap[b.prioridade] || 0);
    } else if (sortField === 'criacao') {
      comparison = new Date(a.criacao).getTime() - new Date(b.criacao).getTime();
    } else if (sortField === 'tempoProcessamento') {
      const aTime = a.tempoProcessamento || 0;
      const bTime = b.tempoProcessamento || 0;
      comparison = aTime - bTime;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return filteredDemandas;
};

export const filterDemandasByStatus = (
  demandas: Demanda[]
): {
  novos: Demanda[];
  emAndamento: Demanda[];
  encaminhados: Demanda[];
  confirmados: Demanda[];
  finalizados: Demanda[];
} => {
  return {
    novos: demandas.filter((demanda) => demanda.status === "pendente"),
    emAndamento: demandas.filter((demanda) => demanda.status === "em_andamento"),
    encaminhados: demandas.filter((demanda) => demanda.status === "encaminhado"),
    confirmados: demandas.filter((demanda) => demanda.status === "confirmado"),
    finalizados: demandas.filter((demanda) => demanda.status === "finalizado" || demanda.status === "concluida")
  };
};

export const formatTempoProcessamento = (tempo: number | null | undefined): string => {
  if (!tempo) return "Não iniciado";
  
  const segundos = Math.floor(tempo / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    return `${dias}d ${horas % 24}h`;
  } else if (horas > 0) {
    return `${horas}h ${minutos % 60}m`;
  } else if (minutos > 0) {
    return `${minutos}m ${segundos % 60}s`;
  } else {
    return `${segundos}s`;
  }
};

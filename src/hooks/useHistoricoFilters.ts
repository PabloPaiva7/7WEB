
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { MovimentacaoHistorico } from '@/types/historico.types';

interface UseHistoricoFiltersProps {
  historicoMovimentacoes: MovimentacaoHistorico[];
  itemsPerPage: number;
}

export const useHistoricoFilters = ({ historicoMovimentacoes, itemsPerPage }: UseHistoricoFiltersProps) => {
  const location = useLocation();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [moduloFilter, setModuloFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [contratoClienteFilter, setContratoClienteFilter] = useState('todos');
  const [dataRange, setDataRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'data',
    direction: 'descending'
  });
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Handle URL params for filtering
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const contrato = query.get('contrato');
    if (contrato) {
      setSearchTerm(contrato);
    }
  }, [location]);

  // Filter data based on all filter criteria
  const filteredData = useMemo(() => {
    return historicoMovimentacoes
      .filter(item => {
        const matchesSearch = 
          item.contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.protocolo.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTipo = tipoFilter === 'todos' || item.tipo === tipoFilter;
        const matchesModulo = moduloFilter === 'todos' || item.modulo === moduloFilter;
        const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
        const matchesContratoCliente = contratoClienteFilter === 'todos' || 
          `${item.contrato} - ${item.cliente}` === contratoClienteFilter;
        
        const matchesDateRange = dataRange?.from && dataRange?.to 
          ? new Date(item.data) >= dataRange.from && new Date(item.data) <= dataRange.to
          : true;
        
        return matchesSearch && matchesTipo && matchesModulo && matchesStatus && 
               matchesContratoCliente && matchesDateRange;
      })
      .sort((a, b) => {
        const aValue = sortConfig.key === 'data' ? 
          new Date(a.data).getTime() : 
          String(a[sortConfig.key as keyof typeof a]);
        
        const bValue = sortConfig.key === 'data' ? 
          new Date(b.data).getTime() : 
          String(b[sortConfig.key as keyof typeof b]);
        
        if (sortConfig.direction === 'ascending') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [
    historicoMovimentacoes, 
    searchTerm, 
    tipoFilter, 
    moduloFilter, 
    statusFilter, 
    contratoClienteFilter, 
    dataRange, 
    sortConfig
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle selection of items
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  // Get unique values for filter dropdowns
  const tiposUnicos = useMemo(() => (
    Array.from(new Set(historicoMovimentacoes.map(item => item.tipo)))
  ), [historicoMovimentacoes]);
  
  const modulosUnicos = useMemo(() => (
    Array.from(new Set(historicoMovimentacoes.map(item => item.modulo)))
  ), [historicoMovimentacoes]);
  
  const statusUnicos = useMemo(() => (
    Array.from(new Set(historicoMovimentacoes.map(item => item.status)))
  ), [historicoMovimentacoes]);
  
  const contratosClientesUnicos = useMemo(() => (
    Array.from(
      new Set(historicoMovimentacoes.map(item => `${item.contrato} - ${item.cliente}`))
    ).sort()
  ), [historicoMovimentacoes]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tipoFilter, moduloFilter, statusFilter, contratoClienteFilter, dataRange]);

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    moduloFilter,
    setModuloFilter,
    statusFilter,
    setStatusFilter,
    contratoClienteFilter,
    setContratoClienteFilter,
    dataRange,
    setDataRange,
    
    // Sort state
    sortConfig,
    requestSort,
    
    // Selection state
    selectedItems,
    setSelectedItems,
    handleSelectItem,
    handleSelectAll,
    
    // Pagination state
    currentPage,
    setCurrentPage,
    totalPages,
    
    // Data
    filteredData,
    currentItems,
    
    // Filter options
    tiposUnicos,
    modulosUnicos,
    statusUnicos,
    contratosClientesUnicos
  };
};

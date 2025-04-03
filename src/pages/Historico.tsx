
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { historicoMovimentacoes } from '@/data/historicoData';
import { exportarParaCSV, exportarParaPDF } from '@/utils/exportarDados';
import { DocumentosTab } from '@/components/Historico/DocumentosTab';

// Import our new components
import { HistoricoHeader } from '@/components/Historico/HistoricoHeader';
import { HistoricoFilters } from '@/components/Historico/HistoricoFilters';
import { TableView } from '@/components/Historico/TableView';
import { DetailsView } from '@/components/Historico/DetailsView';
import { HistoricoPagination } from '@/components/Historico/HistoricoPagination';
import { useHistoricoFilters } from '@/hooks/useHistoricoFilters';

const Historico = () => {
  const { toast } = useToast();
  const itemsPerPage = 10;
  
  // Use our custom hook for filtering and sorting
  const {
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
    sortConfig,
    requestSort,
    selectedItems,
    setSelectedItems,
    handleSelectItem,
    handleSelectAll,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    currentItems,
    tiposUnicos,
    modulosUnicos,
    statusUnicos,
    contratosClientesUnicos
  } = useHistoricoFilters({
    historicoMovimentacoes,
    itemsPerPage
  });

  const handleExportCSV = () => {
    const itemsToExport = selectedItems.length > 0 
      ? historicoMovimentacoes.filter(item => selectedItems.includes(item.id))
      : filteredData;
    
    if (itemsToExport.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um item para exportar ou remova os filtros.",
        variant: "destructive"
      });
      return;
    }
    
    exportarParaCSV(itemsToExport, 'historico-movimentacoes');
    
    toast({
      title: "Exportação concluída",
      description: `${itemsToExport.length} registros exportados para CSV com sucesso.`
    });
  };

  const handleExportPDF = () => {
    const itemsToExport = selectedItems.length > 0 
      ? historicoMovimentacoes.filter(item => selectedItems.includes(item.id))
      : filteredData;
    
    if (itemsToExport.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um item para exportar ou remova os filtros.",
        variant: "destructive"
      });
      return;
    }
    
    exportarParaPDF(itemsToExport, 'historico-movimentacoes');
    
    toast({
      title: "Exportação concluída",
      description: `${itemsToExport.length} registros exportados para PDF com sucesso.`
    });
  };

  const verificarAutenticidade = (protocolo: string) => {
    toast({
      title: "Autenticidade verificada",
      description: `O protocolo ${protocolo} é autêntico e possui validade jurídica.`
    });
  };

  const exportarMovimentacoesContrato = (contratoCliente: string) => {
    const [contrato, cliente] = contratoCliente.split(' - ');
    const movimentacoes = historicoMovimentacoes.filter(item => 
      item.contrato === contrato && item.cliente === cliente
    );
    
    if (movimentacoes.length === 0) {
      toast({
        title: "Nenhuma movimentação encontrada",
        description: "Não foram encontradas movimentações para este contrato/cliente.",
        variant: "destructive"
      });
      return;
    }
    
    exportarParaPDF(movimentacoes, `movimentacoes-${contrato}`);
    
    toast({
      title: "Exportação concluída",
      description: `${movimentacoes.length} movimentações do contrato ${contrato} exportadas para PDF com sucesso.`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <HistoricoHeader 
        handleExportCSV={handleExportCSV} 
        handleExportPDF={handleExportPDF} 
      />
      
      <HistoricoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        contratoClienteFilter={contratoClienteFilter}
        setContratoClienteFilter={setContratoClienteFilter}
        tipoFilter={tipoFilter}
        setTipoFilter={setTipoFilter}
        moduloFilter={moduloFilter}
        setModuloFilter={setModuloFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dataRange={dataRange}
        setDataRange={setDataRange}
        contratosClientesUnicos={contratosClientesUnicos}
        tiposUnicos={tiposUnicos}
        modulosUnicos={modulosUnicos}
        statusUnicos={statusUnicos}
        exportarMovimentacoesContrato={exportarMovimentacoesContrato}
      />

      <Tabs defaultValue="tabela">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="tabela">Tabela</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {filteredData.length} registros encontrados
          </div>
        </div>
        
        <TabsContent value="tabela" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <TableView
                currentItems={currentItems}
                selectedItems={selectedItems}
                handleSelectItem={handleSelectItem}
                handleSelectAll={handleSelectAll}
                sortConfig={sortConfig}
                requestSort={requestSort}
                verificarAutenticidade={verificarAutenticidade}
                exportarParaPDF={exportarParaPDF}
                toast={toast}
              />
            </CardContent>
          </Card>
          
          <HistoricoPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
        
        <TabsContent value="detalhes" className="space-y-4">
          <DetailsView
            currentItems={currentItems}
            verificarAutenticidade={verificarAutenticidade}
            exportarParaPDF={exportarParaPDF}
            toast={toast}
          />
          
          <HistoricoPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            setCurrentPage={setCurrentPage} 
          />
        </TabsContent>
        
        <TabsContent value="documentos" fullWidth>
          <DocumentosTab clienteFilter={contratoClienteFilter !== 'todos' ? contratoClienteFilter.split(' - ')[0] : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Historico;

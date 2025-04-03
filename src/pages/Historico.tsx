
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Filter, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  History,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { historicoMovimentacoes } from '@/data/historicoData';
import { exportarParaCSV, exportarParaPDF } from '@/utils/exportarDados';
import { DateRange } from 'react-day-picker';
import { DocumentosTab } from '@/components/Historico/DocumentosTab';

// Add statusCampanha field to MovimentacaoHistorico interface in data/historicoData.ts
interface MovimentacaoHistorico {
  id: string;
  data: string;
  contrato: string;
  cliente: string;
  tipo: string;
  modulo: string;
  descricao: string;
  usuario: string;
  status: string;
  protocolo: string;
  statusCampanha?: boolean;
}

const Historico = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [moduloFilter, setModuloFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [contratoClienteFilter, setContratoClienteFilter] = useState('todos');
  const [dataRange, setDataRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'data',
    direction: 'descending'
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const contrato = query.get('contrato');
    if (contrato) {
      setSearchTerm(contrato);
    }
  }, [location]);

  const dadosFiltrados = () => {
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
        
        return matchesSearch && matchesTipo && matchesModulo && matchesStatus && matchesContratoCliente && matchesDateRange;
      })
      .sort((a, b) => {
        const aValue = sortConfig.key === 'data' ? new Date(a.data).getTime() : String(a[sortConfig.key as keyof typeof a]);
        const bValue = sortConfig.key === 'data' ? new Date(b.data).getTime() : String(b[sortConfig.key as keyof typeof b]);
        
        if (sortConfig.direction === 'ascending') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dadosFiltrados().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dadosFiltrados().length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
  
  const handleExportCSV = () => {
    const itemsToExport = selectedItems.length > 0 
      ? historicoMovimentacoes.filter(item => selectedItems.includes(item.id))
      : dadosFiltrados();
    
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
      : dadosFiltrados();
    
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

  const tiposUnicos = Array.from(new Set(historicoMovimentacoes.map(item => item.tipo)));
  const modulosUnicos = Array.from(new Set(historicoMovimentacoes.map(item => item.modulo)));
  const statusUnicos = Array.from(new Set(historicoMovimentacoes.map(item => item.status)));
  const contratosClientesUnicos = Array.from(
    new Set(historicoMovimentacoes.map(item => `${item.contrato} - ${item.cliente}`))
  ).sort();

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Movimentações</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as alterações e atividades nos contratos com autenticidade jurídica
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine a busca por movimentações de contratos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por contrato, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={contratoClienteFilter} onValueChange={setContratoClienteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Contrato/Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os contratos</SelectItem>
                {contratosClientesUnicos.map(contratoCliente => (
                  <SelectItem key={contratoCliente} value={contratoCliente}>
                    {contratoCliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              {contratoClienteFilter !== 'todos' && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => exportarMovimentacoesContrato(contratoClienteFilter)}
                  title="Exportar todas as movimentações deste contrato"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposUnicos.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={moduloFilter} onValueChange={setModuloFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os módulos</SelectItem>
                {modulosUnicos.map(modulo => (
                  <SelectItem key={modulo} value={modulo}>{modulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {statusUnicos.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DatePickerWithRange 
              value={dataRange}
              onChange={(value) => setDataRange(value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tabela">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="tabela">Tabela</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {dadosFiltrados().length} registros encontrados
          </div>
        </div>
        
        <TabsContent value="tabela" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Selecionar todos"
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('data')}>
                        <div className="flex items-center">
                          Data/Hora
                          {sortConfig.key === 'data' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('contrato')}>
                        <div className="flex items-center">
                          Contrato/Cliente
                          {sortConfig.key === 'contrato' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('tipo')}>
                        <div className="flex items-center">
                          Tipo
                          {sortConfig.key === 'tipo' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('modulo')}>
                        <div className="flex items-center">
                          Módulo
                          {sortConfig.key === 'modulo' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('usuario')}>
                        <div className="flex items-center">
                          Usuário
                          {sortConfig.key === 'usuario' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                        <div className="flex items-center">
                          Status
                          {sortConfig.key === 'status' && (
                            sortConfig.direction === 'ascending' 
                              ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                              : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Status Campanha</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-24 text-center">
                          Nenhum registro encontrado com os filtros aplicados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleSelectItem(item.id)}
                              aria-label={`Selecionar ${item.contrato}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                            <div className="text-sm text-muted-foreground">{new Date(item.data).toLocaleTimeString('pt-BR')}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.contrato}</div>
                            <div className="text-sm text-muted-foreground">{item.cliente}</div>
                          </TableCell>
                          <TableCell>{item.tipo}</TableCell>
                          <TableCell>{item.modulo}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={item.descricao}>
                              {item.descricao}
                            </div>
                          </TableCell>
                          <TableCell>{item.usuario}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-xs">{item.protocolo}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.statusCampanha ? "default" : "outline"}>
                              {item.statusCampanha ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost" 
                                size="icon" 
                                onClick={() => verificarAutenticidade(item.protocolo)}
                                title="Verificar autenticidade"
                              >
                                <History className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Baixar PDF"
                                onClick={() => {
                                  exportarParaPDF([item], `movimentacao-${item.protocolo}`);
                                  toast({
                                    title: "Exportação concluída",
                                    description: "Registro exportado para PDF com sucesso."
                                  });
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber: number;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
        
        <TabsContent value="detalhes" className="space-y-4">
          {currentItems.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Nenhum registro encontrado com os filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            currentItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="font-mono">{item.protocolo}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5"
                          onClick={() => verificarAutenticidade(item.protocolo)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {new Date(item.data).toLocaleDateString('pt-BR')} às {new Date(item.data).toLocaleTimeString('pt-BR')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <Badge variant={item.statusCampanha ? "default" : "outline"} className="ml-2">
                        Campanha: {item.statusCampanha ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Contrato/Cliente</h4>
                        <p>{item.contrato} - {item.cliente}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Usuário</h4>
                        <p>{item.usuario}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Tipo</h4>
                        <p>{item.tipo}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Módulo</h4>
                        <p>{item.modulo}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Descrição</h4>
                      <p>{item.descricao}</p>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          exportarParaPDF([item], `movimentacao-${item.protocolo}`);
                          toast({
                            title: "Exportação concluída",
                            description: "Registro exportado para PDF com sucesso."
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber: number;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
        
        {/* New Documents Tab */}
        <TabsContent value="documentos" fullWidth>
          <DocumentosTab clienteFilter={contratoClienteFilter !== 'todos' ? contratoClienteFilter.split(' - ')[0] : undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  
  switch (status) {
    case "Concluído":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Pendente":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-500">{status}</Badge>;
    case "Cancelado":
      return <Badge variant="destructive">{status}</Badge>;
    case "Processando":
      return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default Historico;

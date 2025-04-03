
import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Check,
  X,
  Clock,
  SortAsc,
  SortDesc,
  Upload,
  Trash2,
  Eye
} from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Documento, 
  Pasta, 
  pastasDisplay, 
  pastasPredefinidas 
} from "@/utils/document/types";
import { 
  searchDocumentos, 
  filterDocumentosByTipo, 
  filterDocumentosByData, 
  sortDocumentos,
  gerarProtocoloDocumento,
  verificarAutenticidadeDocumento
} from "@/utils/document/searchUtils";

// Sample document data representing what would come from our database or storage
const sampleDocumentos: Documento[] = [
  // Minutas
  { id: 1, nome: "Minuta de Contrato de Prestação de Serviços", data: "2024-03-15", tipo: "minutas", url: "#" },
  { id: 2, nome: "Minuta de Acordo Extrajudicial", data: "2024-03-22", tipo: "minutas", url: "#" },
  { id: 3, nome: "Minuta de Contrato de Compra e Venda", data: "2024-02-10", tipo: "minutas", url: "#" },
  { id: 4, nome: "Minuta de Distrato Contratual", data: "2024-01-05", tipo: "minutas", url: "#" },
  { id: 5, nome: "Minuta de Acordo para Pagamento Parcelado", data: "2024-03-28", tipo: "minutas", url: "#" },
  
  // Procurações
  { id: 6, nome: "Procuração Ad Judicia", data: "2024-03-10", tipo: "procuracoes", url: "#" },
  { id: 7, nome: "Procuração Ad Negotia", data: "2024-02-20", tipo: "procuracoes", url: "#" },
  { id: 8, nome: "Procuração Pública", data: "2024-03-05", tipo: "procuracoes", url: "#" },
  { id: 9, nome: "Procuração para Movimentação Bancária", data: "2024-01-15", tipo: "procuracoes", url: "#" },
  { id: 10, nome: "Substabelecimento de Procuração", data: "2024-03-25", tipo: "procuracoes", url: "#" },
  
  // Prints
  { id: 11, nome: "Print de Confirmação de Transferência", data: "2024-03-18", tipo: "prints", url: "#" },
  { id: 12, nome: "Print de Andamento Processual", data: "2024-02-28", tipo: "prints", url: "#" },
  { id: 13, nome: "Print de Conversa de WhatsApp", data: "2024-03-02", tipo: "prints", url: "#" },
  { id: 14, nome: "Print de E-mail de Notificação", data: "2024-01-10", tipo: "prints", url: "#" },
  { id: 15, nome: "Print de Extrato Bancário", data: "2024-03-20", tipo: "prints", url: "#" },
  
  // Boletos
  { id: 16, nome: "Boleto Ref. Contrato #1234", data: "2024-03-12", tipo: "boletos", url: "#" },
  { id: 17, nome: "Boleto Parcela 2/10", data: "2024-02-15", tipo: "boletos", url: "#" },
  { id: 18, nome: "Boleto Taxa de Serviço", data: "2024-03-01", tipo: "boletos", url: "#" },
  { id: 19, nome: "Boleto Multa Contratual", data: "2024-01-20", tipo: "boletos", url: "#" },
  { id: 20, nome: "Boleto Entrada Contrato #5678", data: "2024-03-15", tipo: "boletos", url: "#" },
  
  // Comprovantes
  { id: 21, nome: "Comprovante de Pagamento", data: "2024-03-08", tipo: "comprovantes", url: "#" },
  { id: 22, nome: "Comprovante de Residência", data: "2024-02-12", tipo: "comprovantes", url: "#" },
  { id: 23, nome: "Comprovante de Entrega de Documentos", data: "2024-03-04", tipo: "comprovantes", url: "#" },
  { id: 24, nome: "Comprovante de Depósito Judicial", data: "2024-01-25", tipo: "comprovantes", url: "#" },
  { id: 25, nome: "Comprovante de Transferência Bancária", data: "2024-03-10", tipo: "comprovantes", url: "#" },
  
  // Notificações Extrajudiciais
  { id: 26, nome: "Notificação Extrajudicial - Inadimplência", data: "2024-03-14", tipo: "notificacoes_extrajudiciais", url: "#" },
  { id: 27, nome: "Notificação Extrajudicial - Rescisão", data: "2024-02-18", tipo: "notificacoes_extrajudiciais", url: "#" },
  { id: 28, nome: "Notificação Extrajudicial - Cumprimento de Obrigação", data: "2024-03-06", tipo: "notificacoes_extrajudiciais", url: "#" },
  { id: 29, nome: "Notificação Extrajudicial - Interpelação", data: "2024-01-30", tipo: "notificacoes_extrajudiciais", url: "#" },
  { id: 30, nome: "Notificação Extrajudicial - Protesto", data: "2024-03-22", tipo: "notificacoes_extrajudiciais", url: "#" }
];

// Generate protocol numbers for each document
const documentosComProtocolo = sampleDocumentos.map(doc => ({
  ...doc,
  protocolo: gerarProtocoloDocumento(),
  autenticado: true,
  dataAutenticacao: new Date().toISOString(),
  hash: `0x${Math.random().toString(16).slice(2, 50)}`
}));

interface DocumentosTabProps {
  clienteFilter?: string;
}

export const DocumentosTab = ({ clienteFilter }: DocumentosTabProps) => {
  const { toast } = useToast();
  const [documentos, setDocumentos] = useState(documentosComProtocolo);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [dataRange, setDataRange] = useState<DateRange | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState({
    key: "data" as "nome" | "data" | "tipo",
    order: "desc" as "asc" | "desc"
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDocumento, setViewDocumento] = useState<(typeof documentosComProtocolo)[0] | null>(null);
  const [newDocumento, setNewDocumento] = useState({
    nome: "",
    tipo: "minutas",
    conteudo: ""
  });
  const [editingDocumento, setEditingDocumento] = useState<(typeof documentosComProtocolo)[0] | null>(null);
  
  const itemsPerPage = 10;
  
  // Filter and sort documents
  const filteredDocumentos = React.useMemo(() => {
    let results = documentos;
    
    // Filter by search term
    if (searchTerm) {
      results = searchDocumentos(results, searchTerm);
    }
    
    // Filter by document type
    if (tipoFilter !== "todos") {
      results = filterDocumentosByTipo(results, tipoFilter);
    }
    
    // Filter by date range
    if (dataRange?.from || dataRange?.to) {
      results = filterDocumentosByData(
        results,
        dataRange?.from,
        dataRange?.to ? new Date(dataRange.to.setHours(23, 59, 59, 999)) : undefined
      );
    }
    
    // Sort results
    return sortDocumentos(results, sortConfig.key, sortConfig.order);
  }, [documentos, searchTerm, tipoFilter, dataRange, sortConfig]);
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);
  
  // Handle sort
  const handleSort = (key: "nome" | "data" | "tipo") => {
    setSortConfig(prevConfig => ({
      key,
      order: prevConfig.key === key && prevConfig.order === "asc" ? "desc" : "asc"
    }));
  };
  
  // Handle select items
  const handleSelectItem = (id: number) => {
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
  
  // Download document
  const handleDownload = (doc: typeof documentosComProtocolo[0]) => {
    toast({
      title: "Download iniciado",
      description: `Documento ${doc.nome} está sendo baixado.`
    });
    
    // In a real implementation, this would initiate an actual download
    setTimeout(() => {
      toast({
        title: "Download concluído",
        description: `${doc.nome} foi baixado com sucesso.`
      });
    }, 1500);
  };
  
  // Verify document authenticity
  const handleVerifyAuthenticity = (doc: typeof documentosComProtocolo[0]) => {
    const isAuthentic = verificarAutenticidadeDocumento(doc.protocolo);
    
    toast({
      title: isAuthentic ? "Documento autêntico" : "Documento não autêntico",
      description: isAuthentic 
        ? `O documento ${doc.nome} possui autenticação jurídica válida.` 
        : `O documento ${doc.nome} não possui autenticação válida.`,
      variant: isAuthentic ? "default" : "destructive"
    });
  };
  
  // Add new document
  const handleAddDocument = () => {
    if (!newDocumento.nome || !newDocumento.tipo) {
      toast({
        title: "Erro ao adicionar documento",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const novoDoc = {
      id: Math.max(...documentos.map(d => d.id)) + 1,
      nome: newDocumento.nome,
      tipo: newDocumento.tipo,
      data: new Date().toISOString(),
      url: "#",
      protocolo: gerarProtocoloDocumento(),
      autenticado: true,
      dataAutenticacao: new Date().toISOString(),
      hash: `0x${Math.random().toString(16).slice(2, 50)}`,
      conteudo: newDocumento.conteudo
    };
    
    setDocumentos(prev => [novoDoc, ...prev]);
    setNewDocumento({
      nome: "",
      tipo: "minutas",
      conteudo: ""
    });
    
    toast({
      title: "Documento adicionado",
      description: `${novoDoc.nome} foi adicionado com autenticação jurídica.`
    });
  };
  
  // Update document
  const handleUpdateDocument = () => {
    if (!editingDocumento) return;
    
    setDocumentos(prev => prev.map(doc => 
      doc.id === editingDocumento.id ? {
        ...editingDocumento,
        dataAutenticacao: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).slice(2, 50)}`
      } : doc
    ));
    
    setEditingDocumento(null);
    
    toast({
      title: "Documento atualizado",
      description: `${editingDocumento.nome} foi atualizado com nova autenticação jurídica.`
    });
  };
  
  // Delete document
  const handleDeleteDocument = (id: number) => {
    setDocumentos(prev => prev.filter(doc => doc.id !== id));
    
    toast({
      title: "Documento excluído",
      description: "O documento foi removido com sucesso."
    });
  };
  
  // Delete multiple documents
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    setDocumentos(prev => prev.filter(doc => !selectedItems.includes(doc.id)));
    setSelectedItems([]);
    
    toast({
      title: "Documentos excluídos",
      description: `${selectedItems.length} documento(s) removido(s) com sucesso.`
    });
  };
  
  // Download multiple documents
  const handleDownloadSelected = () => {
    if (selectedItems.length === 0) return;
    
    toast({
      title: "Download em lote iniciado",
      description: `${selectedItems.length} documento(s) estão sendo baixados.`
    });
    
    // In a real implementation, this would initiate actual downloads
    setTimeout(() => {
      toast({
        title: "Download em lote concluído",
        description: `${selectedItems.length} documento(s) foram baixados com sucesso.`
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Filter Area */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {pastasPredefinidas.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {pastasDisplay[tipo] || tipo.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DatePickerWithRange 
              value={dataRange} 
              onChange={(value) => setDataRange(value)} 
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {filteredDocumentos.length} documentos encontrados
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Novo Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Documento</DialogTitle>
                    <DialogDescription>
                      Preencha os campos abaixo para adicionar um novo documento com autenticação jurídica.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome do documento</Label>
                      <Input
                        id="nome"
                        value={newDocumento.nome}
                        onChange={(e) => setNewDocumento({...newDocumento, nome: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tipo">Tipo de documento</Label>
                      <Select 
                        value={newDocumento.tipo} 
                        onValueChange={(value) => setNewDocumento({...newDocumento, tipo: value})}
                      >
                        <SelectTrigger id="tipo">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {pastasPredefinidas.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>
                              {pastasDisplay[tipo] || tipo.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="conteudo">Conteúdo do documento</Label>
                      <Textarea
                        id="conteudo"
                        rows={5}
                        value={newDocumento.conteudo}
                        onChange={(e) => setNewDocumento({...newDocumento, conteudo: e.target.value})}
                        placeholder="Digite ou cole o conteúdo do documento aqui..."
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddDocument}>Adicionar com Autenticação</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {selectedItems.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadSelected}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar ({selectedItems.length})
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={currentItems.length > 0 && selectedItems.length === currentItems.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                    <div className="flex items-center">
                      Nome do Documento
                      {sortConfig.key === "nome" && (
                        sortConfig.order === "asc" 
                          ? <SortAsc className="ml-2 h-4 w-4" /> 
                          : <SortDesc className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("tipo")}>
                    <div className="flex items-center">
                      Tipo
                      {sortConfig.key === "tipo" && (
                        sortConfig.order === "asc" 
                          ? <SortAsc className="ml-2 h-4 w-4" /> 
                          : <SortDesc className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("data")}>
                    <div className="flex items-center">
                      Data
                      {sortConfig.key === "data" && (
                        sortConfig.order === "asc" 
                          ? <SortAsc className="ml-2 h-4 w-4" /> 
                          : <SortDesc className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Autenticação</TableHead>
                  <TableHead>Protocolo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(doc.id)}
                          onCheckedChange={() => handleSelectItem(doc.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{doc.nome}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pastasDisplay[doc.tipo] || doc.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(doc.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {doc.autenticado ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <Check className="mr-1 h-3 w-3" />
                            Autenticado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-500">
                            <Clock className="mr-1 h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{doc.protocolo}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewDocumento(doc)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVerifyAuthenticity(doc)}
                            title="Verificar autenticidade"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc)}
                            title="Baixar"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDocumento(doc)}
                            title="Editar"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* View Document Dialog */}
      {viewDocumento && (
        <Dialog open={!!viewDocumento} onOpenChange={() => setViewDocumento(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewDocumento.nome}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">
                    {pastasDisplay[viewDocumento.tipo] || viewDocumento.tipo}
                  </Badge>
                  <Badge variant="outline">
                    {new Date(viewDocumento.data).toLocaleDateString('pt-BR')}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {viewDocumento.protocolo}
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 border rounded-lg p-4 min-h-[300px] bg-gray-50 dark:bg-gray-900 text-sm font-mono overflow-auto">
              {viewDocumento.conteudo || `
                DOCUMENTO JURÍDICO
                =================
                
                [CONTEÚDO OMITIDO PARA VISUALIZAÇÃO]
                
                Este é um documento jurídico autêntico com hash de validação:
                ${viewDocumento.hash}
                
                Autenticado em: ${new Date(viewDocumento.dataAutenticacao).toLocaleString('pt-BR')}
                Protocolo: ${viewDocumento.protocolo}
                
                O presente documento possui validade jurídica conforme 
                Lei 14.063/2020 e Medida Provisória nº 2.200-2/2001.
              `}
            </div>
            
            <DialogFooter>
              <div className="w-full flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => handleVerifyAuthenticity(viewDocumento)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Verificar Autenticidade
                </Button>
                
                <Button onClick={() => handleDownload(viewDocumento)}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Document Dialog */}
      {editingDocumento && (
        <Dialog open={!!editingDocumento} onOpenChange={() => setEditingDocumento(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Documento</DialogTitle>
              <DialogDescription>
                Modifique os campos desejados e salve para atualizar o documento com nova autenticação.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nome">Nome do documento</Label>
                <Input
                  id="edit-nome"
                  value={editingDocumento.nome}
                  onChange={(e) => setEditingDocumento({...editingDocumento, nome: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-tipo">Tipo de documento</Label>
                <Select 
                  value={editingDocumento.tipo} 
                  onValueChange={(value) => setEditingDocumento({...editingDocumento, tipo: value})}
                >
                  <SelectTrigger id="edit-tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {pastasPredefinidas.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>
                        {pastasDisplay[tipo] || tipo.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-conteudo">Conteúdo do documento</Label>
                <Textarea
                  id="edit-conteudo"
                  rows={5}
                  value={editingDocumento.conteudo || ""}
                  onChange={(e) => setEditingDocumento({...editingDocumento, conteudo: e.target.value})}
                  placeholder="Digite ou cole o conteúdo do documento aqui..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleUpdateDocument}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

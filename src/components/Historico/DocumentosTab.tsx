
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Shield, 
  Eye, 
  ArrowUpDown,
  Check,
  AlertTriangle,
  Folder
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { Documento, pastasDisplay } from "@/utils/document/types";
import { sampleDocuments } from "@/utils/document/sampleDocuments";
import { 
  searchDocumentos, 
  filterDocumentosByTipo, 
  filterDocumentosByData, 
  sortDocumentos,
  verificarAutenticidadeDocumento
} from "@/utils/document/searchUtils";

interface DocumentosTabProps {
  clienteFilter?: string;
}

export const DocumentosTab = ({ clienteFilter }: DocumentosTabProps) => {
  const { toast } = useToast();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [dataRange, setDataRange] = useState<DateRange | undefined>();
  const [sortConfig, setSortConfig] = useState<{
    key: "nome" | "data" | "tipo";
    direction: "asc" | "desc";
  }>({
    key: "data",
    direction: "desc"
  });
  const [documentoSelecionado, setDocumentoSelecionado] = useState<Documento | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);

  useEffect(() => {
    // Simulating loading documents from an API or storage
    let docsToShow = [...sampleDocuments];
    
    // Filter by cliente if a clienteFilter is provided
    if (clienteFilter) {
      docsToShow = docsToShow.filter(doc => doc.nome.includes(clienteFilter));
    }
    
    setDocumentos(docsToShow);
  }, [clienteFilter]);

  const handleSort = (key: "nome" | "data" | "tipo") => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleViewDocument = (documento: Documento) => {
    setDocumentoSelecionado(documento);
    setIsDialogOpen(true);
  };

  const handleVerifyAuthenticity = (documento: Documento) => {
    setDocumentoSelecionado(documento);
    setIsVerificationDialogOpen(true);
    
    // Simulate verification process
    setTimeout(() => {
      const isAuthentic = verificarAutenticidadeDocumento(documento.protocolo || "");
      
      toast({
        title: isAuthentic ? "Documento Autêntico" : "Documento Não Verificado",
        description: isAuthentic 
          ? `O documento ${documento.nome} foi verificado e é autêntico.` 
          : `Não foi possível verificar a autenticidade do documento ${documento.nome}.`,
        variant: isAuthentic ? "default" : "destructive"
      });
    }, 1500);
  };

  const handleDownloadDocument = (documento: Documento) => {
    // In a real application, this would download the actual file
    // For this example, we'll create a text file with the document content
    
    const content = documento.conteudo || `Conteúdo do documento: ${documento.nome}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documento.nome}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Iniciado",
      description: `O documento "${documento.nome}" está sendo baixado.`
    });
  };

  // Apply filters and sorting
  const filteredDocumentos = () => {
    let result = searchDocumentos(documentos, searchTerm);
    result = filterDocumentosByTipo(result, tipoFiltro);
    
    if (dataRange?.from && dataRange?.to) {
      result = filterDocumentosByData(result, dataRange.from, dataRange.to);
    }
    
    return sortDocumentos(result, sortConfig.key, sortConfig.direction);
  };
  
  const tiposDocumentos = ["todos", ...Object.keys(pastasDisplay)];
  const displayedDocumentos = filteredDocumentos();

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Documentos Jurídicos</CardTitle>
          <CardDescription>
            Consulte documentos com autenticidade jurídica para análise e download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {tiposDocumentos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo === "todos" ? "Todos os tipos" : pastasDisplay[tipo]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DatePickerWithRange
              value={dataRange}
              onChange={setDataRange}
            />
          </div>
          
          <Tabs defaultValue="lista">
            <TabsList>
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="pastas">Pastas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lista" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("nome")}
                        >
                          Nome
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("tipo")}
                        >
                          Categoria
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("data")}
                        >
                          Data
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedDocumentos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum documento encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedDocumentos.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.nome}</TableCell>
                          <TableCell>
                            {pastasDisplay[doc.tipo] || doc.tipo}
                          </TableCell>
                          <TableCell>
                            {new Date(doc.data).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">{doc.protocolo}</span>
                          </TableCell>
                          <TableCell>
                            {doc.autenticado ? (
                              <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                                <Check className="h-3 w-3" /> Autenticado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDocument(doc)}
                                title="Visualizar documento"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleVerifyAuthenticity(doc)}
                                title="Verificar autenticidade"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadDocument(doc)}
                                title="Baixar documento"
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
            </TabsContent>
            
            <TabsContent value="cards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDocumentos.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="flex items-center justify-center h-40">
                      <p className="text-muted-foreground">Nenhum documento encontrado.</p>
                    </CardContent>
                  </Card>
                ) : (
                  displayedDocumentos.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg truncate" title={doc.nome}>
                            {doc.nome}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {pastasDisplay[doc.tipo] || doc.tipo}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(doc.data).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {doc.autenticado ? (
                            <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Autenticado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Pendente
                            </Badge>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">
                            Protocolo: {doc.protocolo}
                          </p>
                        </div>
                        <div className="flex justify-end pt-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <Eye className="h-3 w-3" /> Visualizar
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleDownloadDocument(doc)}
                          >
                            <Download className="h-3 w-3" /> Baixar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pastas" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(pastasDisplay).map(([key, display]) => {
                  const count = documentos.filter(doc => doc.tipo === key).length;
                  return (
                    <Card 
                      key={key} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        tipoFiltro === key ? 'border-primary' : ''
                      }`}
                      onClick={() => setTipoFiltro(tipoFiltro === key ? 'todos' : key)}
                    >
                      <CardContent className="flex items-center p-6 gap-3">
                        <Folder className="h-10 w-10 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{display}</h3>
                          <p className="text-sm text-muted-foreground">
                            {count} {count === 1 ? 'documento' : 'documentos'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dialog for viewing document */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{documentoSelecionado?.nome}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between items-center">
                <span>
                  {documentoSelecionado?.protocolo} • {new Date(documentoSelecionado?.data || "").toLocaleDateString('pt-BR')}
                </span>
                
                {documentoSelecionado?.autenticado && (
                  <Badge className="bg-green-500 hover:bg-green-600">Autenticado</Badge>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-line">
            {documentoSelecionado?.conteudo || "Conteúdo não disponível"}
          </div>
          
          {documentoSelecionado?.autenticado && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Dados de Autenticação:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Data: </span>
                  <span>{new Date(documentoSelecionado?.dataAutenticacao || "").toLocaleString('pt-BR')}</span>
                </div>
                <div>
                  <span className="font-medium">Hash: </span>
                  <span className="font-mono text-xs">{documentoSelecionado?.hash}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => handleVerifyAuthenticity(documentoSelecionado!)}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> Verificar Autenticidade
            </Button>
            <Button 
              onClick={() => handleDownloadDocument(documentoSelecionado!)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Baixar Documento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for verification process */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificando Autenticidade</DialogTitle>
            <DialogDescription>
              Validando o documento no blockchain e registros oficiais...
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Verificando protocolo {documentoSelecionado?.protocolo}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

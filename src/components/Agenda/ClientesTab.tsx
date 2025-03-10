
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cliente } from "@/types/agenda.types";
import { clientesExemplo } from "@/data/agendaData";

interface ClientesTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClientesTab = ({ searchTerm, setSearchTerm }: ClientesTabProps) => {
  const navigate = useNavigate();
  const [regiaoFilter, setRegiaoFilter] = useState("todas");
  const [escritorioFilter, setEscritorioFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoContratoFilter, setTipoContratoFilter] = useState("todos");
  const [visualizacao, setVisualizacao] = useState("lista");

  // Obter valores únicos para os filtros
  const regioes = Array.from(new Set(clientesExemplo.map(cliente => cliente.regiao)));
  const escritorios = Array.from(new Set(clientesExemplo.map(cliente => cliente.escritorio)));
  const tiposContrato = Array.from(new Set(clientesExemplo.map(cliente => cliente.tipoContrato)));

  // Filtrar clientes com base nos critérios
  const clientesFiltrados = clientesExemplo.filter(cliente => {
    const matchesSearch = 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.contrato.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegiao = regiaoFilter === "todas" || cliente.regiao === regiaoFilter;
    const matchesEscritorio = escritorioFilter === "todos" || cliente.escritorio === escritorioFilter;
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter;
    const matchesTipoContrato = tipoContratoFilter === "todos" || cliente.tipoContrato === tipoContratoFilter;
    
    return matchesSearch && matchesRegiao && matchesEscritorio && matchesStatus && matchesTipoContrato;
  });

  const handleClienteClick = (id: string) => {
    navigate(`/cliente/${id}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={regiaoFilter} onValueChange={setRegiaoFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Região" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as regiões</SelectItem>
                {regioes.map((regiao) => (
                  <SelectItem key={regiao} value={regiao}>{regiao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={escritorioFilter} onValueChange={setEscritorioFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Escritório" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os escritórios</SelectItem>
                {escritorios.map((escritorio) => (
                  <SelectItem key={escritorio} value={escritorio}>{escritorio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Prioridade Total">Prioridade Total</SelectItem>
                <SelectItem value="Prioridade">Prioridade</SelectItem>
                <SelectItem value="Verificado">Verificado</SelectItem>
                <SelectItem value="Análise">Análise</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Quitado">Quitado</SelectItem>
                <SelectItem value="Apreendido">Apreendido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Outros Acordos">Outros Acordos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tipoContratoFilter} onValueChange={setTipoContratoFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Tipo de Contrato" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposContrato.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {clientesFiltrados.length} {clientesFiltrados.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
          </h2>
          
          <div className="flex gap-2">
            <Tabs value={visualizacao} onValueChange={setVisualizacao} className="w-auto">
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="lista">Lista</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={() => setSearchTerm("")} variant="outline" size="sm">
              Limpar filtros
            </Button>
          </div>
        </div>

        <TabsContent value="lista" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Região/Escritório</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Próximo Contato</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                          Nenhum cliente encontrado com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      clientesFiltrados.map((cliente) => (
                        <TableRow key={cliente.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleClienteClick(cliente.id)}>
                          <TableCell className="font-medium">{cliente.nome}</TableCell>
                          <TableCell>{cliente.contrato}</TableCell>
                          <TableCell>{cliente.tipoContrato}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {cliente.telefone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                              {cliente.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>{cliente.regiao}</div>
                              <div className="text-muted-foreground">{cliente.escritorio}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={cliente.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(cliente.proximoContato).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientesFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                Nenhum cliente encontrado com os filtros selecionados.
              </div>
            ) : (
              clientesFiltrados.map((cliente) => (
                <Card 
                  key={cliente.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleClienteClick(cliente.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                      <StatusBadge status={cliente.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{cliente.contrato}</span>
                          <span className="text-muted-foreground ml-2">({cliente.tipoContrato})</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{cliente.telefone}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{cliente.email}</span>
                      </div>

                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{cliente.regiao}</span>
                        <span className="text-muted-foreground mx-1">-</span>
                        <span>{cliente.escritorio}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <div>
                          <span className="text-muted-foreground">Próximo contato:</span>
                          <span className="ml-1 font-medium">
                            {new Date(cliente.proximoContato).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">Detalhes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

// Componente de badge de status
const StatusBadge = ({ status }: { status: string }) => {
  let bgColorClass = "bg-gray-100 text-gray-800";
  
  switch (status) {
    case "Pendente":
      bgColorClass = "bg-yellow-100 text-yellow-800";
      break;
    case "Prioridade Total":
      bgColorClass = "bg-red-100 text-red-800";
      break;
    case "Prioridade":
      bgColorClass = "bg-orange-100 text-orange-800";
      break;
    case "Verificado":
      bgColorClass = "bg-green-100 text-green-800";
      break;
    case "Análise":
      bgColorClass = "bg-blue-100 text-blue-800";
      break;
    case "Aprovado":
      bgColorClass = "bg-emerald-100 text-emerald-800";
      break;
    case "Quitado":
      bgColorClass = "bg-teal-100 text-teal-800";
      break;
    case "Apreendido":
      bgColorClass = "bg-purple-100 text-purple-800";
      break;
    case "Cancelado":
      bgColorClass = "bg-slate-100 text-slate-800";
      break;
    default:
      bgColorClass = "bg-gray-100 text-gray-800";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColorClass}`}>
      {status}
    </span>
  );
};

export default ClientesTab;

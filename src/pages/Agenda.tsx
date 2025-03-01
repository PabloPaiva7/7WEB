
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Building, 
  Phone, 
  Mail, 
  FileText,
  Link as LinkIcon,
  Landmark,
  GanttChart,
  Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

// Interface para cliente
interface Cliente {
  id: string;
  nome: string;
  contrato: string;
  tipoContrato: string;
  telefone: string;
  email: string;
  regiao: string;
  escritorio: string;
  status: string;
  ultimoContato: string;
  proximoContato: string;
}

// Interface para ramais
interface Ramal {
  id: string;
  departamento: string;
  responsavel: string;
  numero: string;
  email: string;
}

// Interface para assessorias
interface Assessoria {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
}

// Interface para bancos
interface Banco {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  website: string;
}

// Interface para links úteis
interface LinkUtil {
  id: string;
  nome: string;
  url: string;
  categoria: string;
  descricao: string;
}

// Interface para páginas jurídicas
interface PaginaJuridica {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
  categoria: string;
}

// Dados de exemplo para a agenda
const clientesExemplo: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    contrato: "CT-2023-001",
    tipoContrato: "Financiamento",
    telefone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    regiao: "São Paulo",
    escritorio: "Central",
    status: "Pendente",
    ultimoContato: "2023-05-10",
    proximoContato: "2023-06-15"
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    contrato: "CT-2023-042",
    tipoContrato: "Consultoria",
    telefone: "(21) 98765-1234",
    email: "maria.oliveira@email.com",
    regiao: "Rio de Janeiro",
    escritorio: "Sul",
    status: "Quitado",
    ultimoContato: "2023-05-22",
    proximoContato: "2023-06-22"
  },
  {
    id: "3",
    nome: "Carlos Pereira",
    contrato: "CT-2023-108",
    tipoContrato: "Aquisição",
    telefone: "(31) 99876-5432",
    email: "carlos.pereira@email.com",
    regiao: "Minas Gerais",
    escritorio: "Leste",
    status: "Prioridade",
    ultimoContato: "2023-05-18",
    proximoContato: "2023-06-01"
  },
  {
    id: "4",
    nome: "Ana Santos",
    contrato: "CT-2023-067",
    tipoContrato: "Financiamento",
    telefone: "(41) 99123-4567",
    email: "ana.santos@email.com",
    regiao: "Paraná",
    escritorio: "Sul",
    status: "Análise",
    ultimoContato: "2023-05-25",
    proximoContato: "2023-06-05"
  },
  {
    id: "5",
    nome: "Rodrigo Lima",
    contrato: "CT-2023-089",
    tipoContrato: "Aquisição",
    telefone: "(51) 98877-6655",
    email: "rodrigo.lima@email.com",
    regiao: "Rio Grande do Sul",
    escritorio: "Sul",
    status: "Verificado",
    ultimoContato: "2023-05-20",
    proximoContato: "2023-06-10"
  },
  {
    id: "6",
    nome: "Fernanda Costa",
    contrato: "CT-2023-023",
    tipoContrato: "Consultoria",
    telefone: "(81) 99887-7665",
    email: "fernanda.costa@email.com",
    regiao: "Pernambuco",
    escritorio: "Nordeste",
    status: "Aprovado",
    ultimoContato: "2023-05-15",
    proximoContato: "2023-06-18"
  },
  {
    id: "7",
    nome: "Bruno Almeida",
    contrato: "CT-2023-056",
    tipoContrato: "Financiamento",
    telefone: "(27) 98765-1122",
    email: "bruno.almeida@email.com",
    regiao: "Espírito Santo",
    escritorio: "Leste",
    status: "Prioridade Total",
    ultimoContato: "2023-05-12",
    proximoContato: "2023-05-29"
  },
  {
    id: "8",
    nome: "Camila Martins",
    contrato: "CT-2023-078",
    tipoContrato: "Consultoria",
    telefone: "(62) 99112-3344",
    email: "camila.martins@email.com",
    regiao: "Goiás",
    escritorio: "Centro-Oeste",
    status: "Cancelado",
    ultimoContato: "2023-05-05",
    proximoContato: "2023-06-25"
  },
  {
    id: "9",
    nome: "Diego Souza",
    contrato: "CT-2023-091",
    tipoContrato: "Aquisição",
    telefone: "(71) 98765-9900",
    email: "diego.souza@email.com",
    regiao: "Bahia",
    escritorio: "Nordeste",
    status: "Apreendido",
    ultimoContato: "2023-05-08",
    proximoContato: "2023-06-12"
  },
  {
    id: "10",
    nome: "Juliana Vieira",
    contrato: "CT-2023-113",
    tipoContrato: "Financiamento",
    telefone: "(85) 99876-5544",
    email: "juliana.vieira@email.com",
    regiao: "Ceará",
    escritorio: "Nordeste",
    status: "Outros Acordos",
    ultimoContato: "2023-05-17",
    proximoContato: "2023-06-07"
  }
];

// Dados de exemplo para ramais
const ramaisExemplo: Ramal[] = [
  {
    id: "1",
    departamento: "Financeiro",
    responsavel: "Carlos Silva",
    numero: "1001",
    email: "financeiro@empresa.com"
  },
  {
    id: "2",
    departamento: "Recursos Humanos",
    responsavel: "Mariana Souza",
    numero: "1002",
    email: "rh@empresa.com"
  },
  {
    id: "3",
    departamento: "Atendimento",
    responsavel: "Pedro Oliveira",
    numero: "1003",
    email: "atendimento@empresa.com"
  },
  {
    id: "4",
    departamento: "Comercial",
    responsavel: "Amanda Costa",
    numero: "1004",
    email: "comercial@empresa.com"
  },
  {
    id: "5",
    departamento: "Suporte Técnico",
    responsavel: "Lucas Mendes",
    numero: "1005",
    email: "suporte@empresa.com"
  }
];

// Dados de exemplo para assessorias
const assessoriasExemplo: Assessoria[] = [
  {
    id: "1",
    nome: "AssessoriaFin Ltda",
    contato: "Roberto Gomes",
    telefone: "(11) 3456-7890",
    email: "contato@assessoriafin.com",
    endereco: "Av. Paulista, 1000, São Paulo - SP"
  },
  {
    id: "2",
    nome: "Consultoria Legal S.A.",
    contato: "Juliana Alves",
    telefone: "(21) 2345-6789",
    email: "contato@consultorialegal.com",
    endereco: "Rua do Ouvidor, 50, Rio de Janeiro - RJ"
  },
  {
    id: "3",
    nome: "Assessoria Jurídica Nacional",
    contato: "Fernando Costa",
    telefone: "(31) 3456-7891",
    email: "contato@ajn.com",
    endereco: "Av. Afonso Pena, 1500, Belo Horizonte - MG"
  }
];

// Dados de exemplo para bancos
const bancosExemplo: Banco[] = [
  {
    id: "1",
    nome: "Banco Nacional",
    contato: "Central de Atendimento",
    telefone: "0800 123 4567",
    email: "atendimento@banconacional.com",
    website: "https://www.banconacional.com"
  },
  {
    id: "2",
    nome: "Banco Investimentos",
    contato: "Gerente de Relacionamento",
    telefone: "0800 765 4321",
    email: "contato@bancoinvestimentos.com",
    website: "https://www.bancoinvestimentos.com"
  },
  {
    id: "3",
    nome: "Financeira Crédito Fácil",
    contato: "SAC",
    telefone: "0800 888 9999",
    email: "sac@creditofacil.com",
    website: "https://www.creditofacil.com"
  },
  {
    id: "4",
    nome: "Banco Múltiplo",
    contato: "Ouvidoria",
    telefone: "0800 555 1234",
    email: "ouvidoria@bancomultiplo.com",
    website: "https://www.bancomultiplo.com"
  }
];

// Dados de exemplo para links úteis
const linksUteisExemplo: LinkUtil[] = [
  {
    id: "1",
    nome: "Portal do Cliente",
    url: "https://cliente.empresa.com",
    categoria: "Interno",
    descricao: "Acesso ao portal do cliente para consultas"
  },
  {
    id: "2",
    nome: "Consulta CPF/CNPJ",
    url: "https://consulta.gov.br",
    categoria: "Externo",
    descricao: "Site para consulta de CPF e CNPJ"
  },
  {
    id: "3",
    nome: "Sistema de Contratos",
    url: "https://contratos.empresa.com",
    categoria: "Interno",
    descricao: "Sistema interno para geração de contratos"
  },
  {
    id: "4",
    nome: "Calculadora Financeira",
    url: "https://calculadora.financeira.com",
    categoria: "Ferramentas",
    descricao: "Ferramenta para cálculos financeiros"
  }
];

// Dados de exemplo para páginas jurídicas
const paginasJuridicasExemplo: PaginaJuridica[] = [
  {
    id: "1",
    titulo: "Código Civil",
    descricao: "Acesso ao código civil brasileiro atualizado",
    link: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm",
    categoria: "Legislação"
  },
  {
    id: "2",
    titulo: "CLT - Consolidação das Leis do Trabalho",
    descricao: "Consulta à CLT atualizada",
    link: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
    categoria: "Legislação"
  },
  {
    id: "3",
    titulo: "Modelos de Contratos",
    descricao: "Biblioteca de modelos de contratos",
    link: "https://modelos.juridico.empresa.com",
    categoria: "Modelos"
  },
  {
    id: "4",
    titulo: "Consulta Processos",
    descricao: "Sistema de consulta processual",
    link: "https://pje.tjsp.jus.br/",
    categoria: "Consulta"
  }
];

const Agenda = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [regiaoFilter, setRegiaoFilter] = useState("todas");
  const [escritorioFilter, setEscritorioFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoContratoFilter, setTipoContratoFilter] = useState("todos");
  const [visualizacao, setVisualizacao] = useState("lista");
  const [secaoAtual, setSecaoAtual] = useState("clientes");

  // Obter valores únicos para os filtros
  const regioes = Array.from(new Set(clientesExemplo.map(cliente => cliente.regiao)));
  const escritorios = Array.from(new Set(clientesExemplo.map(cliente => cliente.escritorio)));
  const tiposContrato = Array.from(new Set(clientesExemplo.map(cliente => cliente.tipoContrato)));

  // Filtro para ramais
  const [ramalSearchTerm, setRamalSearchTerm] = useState("");
  const [departamentoFilter, setDepartamentoFilter] = useState("todos");
  
  // Filtros para todas as seções
  const [generalSearchTerm, setGeneralSearchTerm] = useState("");

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

  // Filtrar ramais
  const ramaisFiltrados = ramaisExemplo.filter(ramal => {
    return (
      ramal.departamento.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      ramal.responsavel.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      ramal.numero.includes(generalSearchTerm) ||
      ramal.email.toLowerCase().includes(generalSearchTerm.toLowerCase())
    );
  });

  // Filtrar assessorias
  const assessoriasFiltradas = assessoriasExemplo.filter(assessoria => {
    return (
      assessoria.nome.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      assessoria.contato.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      assessoria.telefone.includes(generalSearchTerm) ||
      assessoria.email.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      assessoria.endereco.toLowerCase().includes(generalSearchTerm.toLowerCase())
    );
  });

  // Filtrar bancos
  const bancosFiltrados = bancosExemplo.filter(banco => {
    return (
      banco.nome.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      banco.contato.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      banco.telefone.includes(generalSearchTerm) ||
      banco.email.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      banco.website.toLowerCase().includes(generalSearchTerm.toLowerCase())
    );
  });

  // Filtrar links úteis
  const linksUteisFiltrados = linksUteisExemplo.filter(link => {
    return (
      link.nome.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      link.categoria.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      link.descricao.toLowerCase().includes(generalSearchTerm.toLowerCase())
    );
  });

  // Filtrar páginas jurídicas
  const paginasJuridicasFiltradas = paginasJuridicasExemplo.filter(pagina => {
    return (
      pagina.titulo.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      pagina.descricao.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      pagina.categoria.toLowerCase().includes(generalSearchTerm.toLowerCase()) ||
      pagina.link.toLowerCase().includes(generalSearchTerm.toLowerCase())
    );
  });

  const handleClienteClick = (id: string) => {
    navigate(`/cliente/${id}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
        </div>
      </div>

      <Tabs value={secaoAtual} onValueChange={setSecaoAtual} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
          <TabsTrigger value="clientes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="ramais" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Ramais</span>
          </TabsTrigger>
          <TabsTrigger value="assessorias" className="flex items-center gap-2">
            <GanttChart className="h-4 w-4" />
            <span className="hidden sm:inline">Assessorias</span>
          </TabsTrigger>
          <TabsTrigger value="bancos" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bancos</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Links Úteis</span>
          </TabsTrigger>
          <TabsTrigger value="juridico" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Jurídico</span>
          </TabsTrigger>
        </TabsList>

        {/* Seção de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                  ${cliente.status === "Pendente" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : cliente.status === "Prioridade Total"
                                    ? "bg-red-100 text-red-800"
                                    : cliente.status === "Prioridade"
                                    ? "bg-orange-100 text-orange-800"
                                    : cliente.status === "Verificado"
                                    ? "bg-green-100 text-green-800"
                                    : cliente.status === "Análise"
                                    ? "bg-blue-100 text-blue-800"
                                    : cliente.status === "Aprovado"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : cliente.status === "Quitado"
                                    ? "bg-teal-100 text-teal-800"
                                    : cliente.status === "Apreendido"
                                    ? "bg-purple-100 text-purple-800"
                                    : cliente.status === "Cancelado"
                                    ? "bg-slate-100 text-slate-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {cliente.status}
                                </span>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${cliente.status === "Pendente" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : cliente.status === "Prioridade Total"
                              ? "bg-red-100 text-red-800"
                              : cliente.status === "Prioridade"
                              ? "bg-orange-100 text-orange-800"
                              : cliente.status === "Verificado"
                              ? "bg-green-100 text-green-800"
                              : cliente.status === "Análise"
                              ? "bg-blue-100 text-blue-800"
                              : cliente.status === "Aprovado"
                              ? "bg-emerald-100 text-emerald-800"
                              : cliente.status === "Quitado"
                              ? "bg-teal-100 text-teal-800"
                              : cliente.status === "Apreendido"
                              ? "bg-purple-100 text-purple-800"
                              : cliente.status === "Cancelado"
                              ? "bg-slate-100 text-slate-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {cliente.status}
                          </span>
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

                          <div className="flex items-center text-sm">
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
        </TabsContent>

        {/* Seção de Ramais */}
        <TabsContent value="ramais" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Ramais Telefônicos</CardTitle>
              <CardDescription>Lista de ramais internos da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar ramal por departamento, responsável..."
                  className="pl-10"
                  value={generalSearchTerm}
                  onChange={(e) => setGeneralSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Ramal</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ramaisFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          Nenhum ramal encontrado com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      ramaisFiltrados.map((ramal) => (
                        <TableRow key={ramal.id}>
                          <TableCell className="font-medium">{ramal.departamento}</TableCell>
                          <TableCell>{ramal.responsavel}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {ramal.numero}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                              {ramal.email}
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
        </TabsContent>

        {/* Seção de Assessorias */}
        <TabsContent value="assessorias" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Assessorias</CardTitle>
              <CardDescription>Contatos de assessorias parceiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar assessoria por nome, contato..."
                  className="pl-10"
                  value={generalSearchTerm}
                  onChange={(e) => setGeneralSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessoriasFiltradas.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-muted-foreground">
                    Nenhuma assessoria encontrada com os filtros selecionados.
                  </div>
                ) : (
                  assessoriasFiltradas.map((assessoria) => (
                    <Card key={assessoria.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{assessoria.nome}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{assessoria.contato}</span>
                          </div>

                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{assessoria.telefone}</span>
                          </div>

                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{assessoria.email}</span>
                          </div>

                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                            <span>{assessoria.endereco}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção de Bancos */}
        <TabsContent value="bancos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Bancos e Financeiras</CardTitle>
              <CardDescription>Contatos de instituições financeiras parceiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar banco por nome, contato..."
                  className="pl-10"
                  value={generalSearchTerm}
                  onChange={(e) => setGeneralSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Website</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bancosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                          Nenhum banco encontrado com os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bancosFiltrados.map((banco) => (
                        <TableRow key={banco.id}>
                          <TableCell className="font-medium">{banco.nome}</TableCell>
                          <TableCell>{banco.contato}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              {banco.telefone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                              {banco.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center" 
                              onClick={() => window.open(banco.website, '_blank')}
                            >
                              <LinkIcon className="w-3 h-3 mr-1" />
                              Acessar Site
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

        {/* Seção de Links Úteis */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Links Úteis</CardTitle>
              <CardDescription>Acesso rápido a sites e sistemas importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, categoria..."
                  className="pl-10"
                  value={generalSearchTerm}
                  onChange={(e) => setGeneralSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {linksUteisFiltrados.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-muted-foreground">
                    Nenhum link encontrado com os filtros selecionados.
                  </div>
                ) : (
                  linksUteisFiltrados.map((link) => (
                    <Card key={link.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{link.nome}</CardTitle>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {link.categoria}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{link.descricao}</p>
                          
                          <div className="pt-2">
                            <Button 
                              className="w-full" 
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Acessar Link
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seção de Páginas Jurídicas */}
        <TabsContent value="juridico" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Páginas Jurídicas</CardTitle>
              <CardDescription>Acesso a legislações e documentos jurídicos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por título, categoria..."
                  className="pl-10"
                  value={generalSearchTerm}
                  onChange={(e) => setGeneralSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginasJuridicasFiltradas.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-muted-foreground">
                    Nenhuma página jurídica encontrada com os filtros selecionados.
                  </div>
                ) : (
                  paginasJuridicasFiltradas.map((pagina) => (
                    <Card key={pagina.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{pagina.titulo}</CardTitle>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {pagina.categoria}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{pagina.descricao}</p>
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline"
                              className="w-full" 
                              onClick={() => window.open(pagina.link, '_blank')}
                            >
                              <Scale className="w-4 h-4 mr-2" />
                              Consultar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Agenda;

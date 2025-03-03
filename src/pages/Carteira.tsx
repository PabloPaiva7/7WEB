import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, Download, Plus, Trash, Edit, HelpCircle, ArrowRight, AlertTriangle, CheckCircle2, Clock, CreditCard, Users, FileText, Wallet, Filter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ValidationError } from "@/utils/csvUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ColumnConfigBase = {
  label: string;
  type: string;
};

type ColumnConfigWithFormat = ColumnConfigBase & {
  format?: (value: string) => string;
};

type ColumnConfigWithValidate = ColumnConfigBase & {
  validate?: (value: string) => string;
};

type ColumnConfig = ColumnConfigWithFormat & ColumnConfigWithValidate;

const columnConfig: Record<string, ColumnConfig> = {
  data: {
    label: "Data",
    format: (value: string) => new Date(value).toLocaleDateString(),
    type: "date",
  },
  resolucao: {
    label: "Resolução",
    type: "text",
  },
  contrato: {
    label: "Contrato",
    type: "text",
  },
  escritorio: {
    label: "Escritório",
    type: "text",
  },
  ultimoPagamento: {
    label: "Último Pagamento",
    format: (value: string) => new Date(value).toLocaleDateString(),
    type: "date",
  },
  prazo: {
    label: "Prazo",
    type: "text",
  },
  entrada: {
    label: "Entrada (Qualidade)",
    type: "text",
  },
  banco: {
    label: "Banco",
    type: "text",
    validate: (value: string) => value.trim().toUpperCase(),
  },
  codigo: {
    label: "Código",
    type: "text",
    validate: (value: string) => value.trim(),
  },
  valorCliente: {
    label: "Valor do Cliente",
    type: "currency",
    format: (value: string) => {
      const numberValue = Number(value.replace(/[^0-9.-]+/g, ""));
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numberValue);
    },
  },
  contato: {
    label: "Contato",
    type: "phone",
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
      }
      return value;
    },
  },
  negociacao: {
    label: "Negociação",
    type: "text",
  },
  situacao: {
    label: "Situação",
    type: "text",
  },
};

type Cliente = {
  id: number;
  data: string;
  resolucao: string;
  contrato: string;
  escritorio: string;
  ultimoPagamento: string;
  prazo: string;
  entrada: string;
  banco: string;
  codigo: string;
  valorCliente: string;
  contato: string;
  negociacao: string;
  situacao: string;
};

const clientesCarteira: Cliente[] = [
  {
    id: 1,
    data: "2024-03-15",
    resolucao: "Pendente",
    contrato: "CT001",
    escritorio: "Escritório A",
    ultimoPagamento: "2024-02-15",
    prazo: "30 dias",
    entrada: "Alta",
    banco: "Banco X",
    codigo: "COD001",
    valorCliente: "R$ 50.000,00",
    contato: "(11) 99999-9999",
    negociacao: "Em andamento",
    situacao: "Ativo",
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Carteira = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>(clientesCarteira);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientesCarteira);
  const [filters, setFilters] = useState({
    banco: "",
    escritorio: "",
    prazo: ""
  });
  const [historico, setHistorico] = useState<{data: string, acao: string}[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewErrors, setPreviewErrors] = useState<ValidationError[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const form = useForm<Cliente>({
    defaultValues: {
      id: 0,
      data: new Date().toISOString().split('T')[0],
      resolucao: "",
      contrato: "",
      escritorio: "",
      ultimoPagamento: new Date().toISOString().split('T')[0],
      prazo: "",
      entrada: "",
      banco: "",
      codigo: "",
      valorCliente: "",
      contato: "",
      negociacao: "",
      situacao: "",
    }
  });

  const handleSubmit = (data: Cliente) => {
    if (editingCliente) {
      const updatedClientes = clientes.map(c => 
        c.id === editingCliente.id ? { ...data, id: editingCliente.id } : c
      );
      setClientes(updatedClientes);
      setFilteredClientes(updatedClientes);
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso.",
      });
    } else {
      const newCliente = {
        ...data,
        id: clientes.length + 1,
      };
      const newClientes = [...clientes, newCliente];
      setClientes(newClientes);
      setFilteredClientes(newClientes);
      toast({
        title: "Sucesso!",
        description: "Cliente adicionado com sucesso.",
      });
    }
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: editingCliente ? `Cliente ${editingCliente.id} editado` : "Novo cliente adicionado"
    }]);
    setIsDialogOpen(false);
    setEditingCliente(null);
    form.reset();
  };

  const handleDelete = (cliente: Cliente) => {
    const newClientes = clientes.filter(c => c.id !== cliente.id);
    setClientes(newClientes);
    setFilteredClientes(newClientes);
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: `Cliente ${cliente.id} removido`
    }]);
    toast({
      title: "Sucesso!",
      description: "Cliente removido com sucesso.",
    });
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    form.reset(cliente);
    setIsDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name); // Debug log
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          console.log("Conteúdo do arquivo:", text.substring(0, 100)); // Debug log dos primeiros 100 caracteres
          
          const lines = text.split("\n").filter(line => line.trim());
          const headers = lines[0].split(",").map(header => header.trim());
          console.log("Headers detectados:", headers); // Debug log
          
          const newClientes = lines.slice(1).map((line, index) => {
            const values = line.split(",").map(value => value.trim());
            console.log(`Processando linha ${index + 1}:`, values); // Debug log
            
            const cliente: Partial<Cliente> = { id: clientes.length + index + 1 };
            
            headers.forEach((header, i) => {
              const key = Object.keys(columnConfig).find(
                k => columnConfig[k].label.toLowerCase() === header.toLowerCase()
              );
              
              if (key) {
                const config = columnConfig[key];
                let value = values[i] || "";
                
                try {
                  if (config.validate) {
                    value = config.validate(value);
                  }
                  
                  if (config.format) {
                    value = config.format(value);
                  }
                  
                  (cliente[key as keyof Cliente] as any) = value;
                } catch (error) {
                  console.error(`Erro ao processar ${key}:`, error);
                  toast({
                    title: "Erro no processamento",
                    description: `Erro ao processar o campo ${config.label} na linha ${index + 1}`,
                    variant: "destructive",
                  });
                }
              }
            });
            
            return cliente as Cliente;
          });

          console.log("Clientes processados:", newClientes); // Debug log
          
          if (newClientes.length > 0) {
            setClientes(prev => [...prev, ...newClientes]);
            setFilteredClientes(prev => [...prev, ...newClientes]);
            
            setHistorico(prev => [...prev, {
              data: new Date().toISOString(),
              acao: `Importação de ${newClientes.length} registros via CSV`
            }]);
            
            toast({
              title: "Sucesso!",
              description: `${newClientes.length} registros importados com sucesso.`,
            });
          } else {
            toast({
              title: "Aviso",
              description: "Nenhum registro válido encontrado no arquivo CSV.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          toast({
            title: "Erro",
            description: "Erro ao processar o arquivo. Verifique se o formato do CSV está correto.",
            variant: "destructive",
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Erro",
          description: "Erro ao ler o arquivo.",
          variant: "destructive",
        });
      };
      
      reader.readAsText(file);
    }
  };

  const bancos = Array.from(new Set(clientes.map(c => c.banco))).filter(banco => banco && banco.trim() !== '').sort();
  const escritorios = Array.from(new Set(clientes.map(c => c.escritorio))).filter(escritorio => escritorio && escritorio.trim() !== '').sort();
  const prazos = Array.from(new Set(clientes.map(c => c.prazo))).filter(prazo => prazo && prazo.trim() !== '').sort();

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    let filtered = clientes;
    
    if (newFilters.banco && newFilters.banco !== 'todos') {
      filtered = filtered.filter(c => c.banco === newFilters.banco);
    }
    if (newFilters.escritorio && newFilters.escritorio !== 'todos') {
      filtered = filtered.filter(c => c.escritorio === newFilters.escritorio);
    }
    if (newFilters.prazo && newFilters.prazo !== 'todos') {
      filtered = filtered.filter(c => c.prazo === newFilters.prazo);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        Object.values(c).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredClientes(filtered);
    
    setHistorico(prev => [...prev, {
      data: new Date().toISOString(),
      acao: `Filtro aplicado: ${type} = ${value}`
    }]);
  };

  const estatisticas = {
    totalClientes: filteredClientes.length,
    porSituacao: filteredClientes.reduce((acc, cliente) => {
      acc[cliente.situacao] = (acc[cliente.situacao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    porBanco: filteredClientes.reduce((acc, cliente) => {
      acc[cliente.banco] = (acc[cliente.banco] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    valorTotal: filteredClientes.reduce((acc, cliente) => {
      const valor = Number(cliente.valorCliente.replace(/[^0-9.-]+/g, "")) || 0;
      return acc + valor;
    }, 0),
    mediaPrazo: filteredClientes.reduce((acc, cliente) => {
      const dias = parseInt(cliente.prazo) || 0;
      return acc + dias;
    }, 0) / (filteredClientes.length || 1),
  };

  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const dadosPizza = Object.entries(estatisticas.porBanco).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  const dadosTendencia = [
    { mes: 'Jan', valor: 42000 },
    { mes: 'Fev', valor: 53000 },
    { mes: 'Mar', valor: 48000 },
    { mes: 'Abr', valor: 62000 },
    { mes: 'Mai', valor: 78000 },
    { mes: 'Jun', valor: 83000 },
  ];

  const cardsDashboard = [
    { 
      titulo: 'Guia de Início Rápido', 
      descricao: 'Como gerenciar seus contratos e carteira de clientes',
      icone: <HelpCircle className="h-8 w-8 text-blue-500" />,
      cor: 'bg-blue-50 border-blue-200',
      acoes: [
        { texto: 'Ver tutorial', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Contratos Próximos do Vencimento', 
      descricao: '3 contratos vencem nos próximos 7 dias',
      icone: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      cor: 'bg-amber-50 border-amber-200',
      acoes: [
        { texto: 'Ver lista', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Clientes Pendentes', 
      descricao: '7 clientes aguardando análise de documentação',
      icone: <Clock className="h-8 w-8 text-purple-500" />,
      cor: 'bg-purple-50 border-purple-200',
      acoes: [
        { texto: 'Verificar', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    },
    { 
      titulo: 'Contratos Aprovados', 
      descricao: '12 contratos aprovados no último mês',
      icone: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      cor: 'bg-green-50 border-green-200',
      acoes: [
        { texto: 'Ver detalhes', icone: <ArrowRight className="h-4 w-4" /> }
      ]
    }
  ];

  const kpis = [
    { 
      valor: estatisticas.totalClientes.toString(),
      label: 'Clientes Ativos',
      icone: <Users className="h-6 w-6 text-indigo-500" />,
      cor: 'bg-indigo-50 border-indigo-200'
    },
    { 
      valor: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(estatisticas.valorTotal),
      label: 'Carteira Total',
      icone: <Wallet className="h-6 w-6 text-emerald-500" />,
      cor: 'bg-emerald-50 border-emerald-200'
    },
    { 
      valor: '27',
      label: 'Contratos Pendentes',
      icone: <FileText className="h-6 w-6 text-amber-500" />,
      cor: 'bg-amber-50 border-amber-200'
    },
    { 
      valor: `${Math.round(estatisticas.mediaPrazo)} dias`,
      label: 'Prazo Médio',
      icone: <CreditCard className="h-6 w-6 text-blue-500" />,
      cor: 'bg-blue-50 border-blue-200'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background z-10 pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCliente ? "Editar Cliente" : "Novo Cliente"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(columnConfig).map(([key, config]) => (
                          key !== 'id' && (
                            <FormField
                              key={key}
                              control={form.control}
                              name={key as keyof Cliente}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{config.label}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type={config.type === 'date' ? 'date' : 'text'}
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          )
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsDialogOpen(false);
                          setEditingCliente(null);
                          form.reset();
                        }}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {editingCliente ? "Salvar" : "Adicionar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    onClick={(e) => (e.currentTarget.value = '')}
                  />
                </label>
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`${kpi.cor}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.valor}</p>
              </div>
              <div className="p-3 rounded-full bg-white">
                {kpi.icone}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsDashboard.map((card, index) => (
          <Card key={index} className={`${card.cor}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold">{card.titulo}</CardTitle>
                {card.icone}
              </div>
              <CardDescription>{card.descricao}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex space-x-2 mt-2">
                {card.acoes.map((acao, i) => (
                  <Button key={i} variant="outline" size="sm" className="bg-white hover:bg-white/90">
                    {acao.texto}
                    {acao.icone}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Análise da Carteira</CardTitle>
            <CardDescription>Distribuição de contratos por situação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-xl font-bold">{estatisticas.totalClientes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(estatisticas.valorTotal)}
                  </p>
                </div>
              </div>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dadosGrafico} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribuição por Banco</CardTitle>
            <CardDescription>Análise do volume por instituição financeira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Evolução da Carteira</CardTitle>
          <CardDescription>Valores totais nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosTendencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  } 
                />
                <Tooltip 
                  formatter={(value: number) => 
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(value)
                  }
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tabela de Contratos</CardTitle>
          <CardDescription>Lista completa de contratos na carteira</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.entries(columnConfig).map(([key, config]) => (
                  <TableHead key={key}>{config.label}</TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  {Object.entries(columnConfig).map(([key]) => (
                    <TableCell key={`${cliente.id}-${key}`}>
                      {cliente[key as keyof Cliente]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(cliente)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Histórico de Ações</CardTitle>
          <CardDescription>Registro das últimas alterações na carteira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {historico.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{new Date(item.data).toLocaleString()}</span>
                <span>{item.acao}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Carteira;

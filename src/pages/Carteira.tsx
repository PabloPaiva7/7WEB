import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Upload, Download, BarChart, Plus, Trash, Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
} from "recharts";
import { CarteiraSidebar } from "@/components/CarteiraSidebar";
import { useForm } from "react-hook-form";

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
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split("\n").filter(line => line.trim());
          const headers = lines[0].split(",").map(header => header.trim());
          
          const newClientes = lines.slice(1).map((line, index) => {
            const values = line.split(",").map(value => value.trim());
            const cliente: Partial<Cliente> = { id: index + 1 };
            
            Object.keys(columnConfig).forEach((key, i) => {
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
                (cliente[key as keyof Cliente] as any) = value;
              }
            });
            
            return cliente as Cliente;
          });

          setClientes(newClientes);
          setFilteredClientes(newClientes);
          
          setHistorico(prev => [...prev, {
            data: new Date().toISOString(),
            acao: `Importação de ${newClientes.length} registros`
          }]);
          
          toast({
            title: "Sucesso!",
            description: `${newClientes.length} registros importados com sucesso.`,
          });
          
          event.target.value = '';
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          toast({
            title: "Erro",
            description: "Erro ao processar o arquivo. Verifique o formato do CSV.",
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

  const bancos = Array.from(new Set(clientes.map(c => c.banco))).sort();
  const escritorios = Array.from(new Set(clientes.map(c => c.escritorio))).sort();
  const prazos = Array.from(new Set(clientes.map(c => c.prazo))).sort();

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    let filtered = clientes;
    if (newFilters.banco) {
      filtered = filtered.filter(c => c.banco === newFilters.banco);
    }
    if (newFilters.escritorio) {
      filtered = filtered.filter(c => c.escritorio === newFilters.escritorio);
    }
    if (newFilters.prazo) {
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
    }, 0) / filteredClientes.length,
  };

  const dadosGrafico = Object.entries(estatisticas.porSituacao).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  const dadosPizza = Object.entries(estatisticas.porBanco).map(([nome, valor]) => ({
    name: nome,
    value: valor,
  }));

  return (
    <div className="flex gap-6">
      {!isMobile && (
        <CarteiraSidebar
          bancos={bancos}
          escritorios={escritorios}
          prazos={prazos}
          onFilterChange={handleFilterChange}
        />
      )}
      <div className="flex-1 space-y-6 animate-fadeIn min-w-0">
        <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-center gap-4`}>
          <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-4 items-center`}>
            <div className={`relative ${isMobile ? 'w-full' : 'w-64'}`}>
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Cliente
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
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              <label className="cursor-pointer">
                Importar CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise da Carteira</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Clientes</p>
                  <p className="text-2xl font-bold">{estatisticas.totalClientes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(estatisticas.valorTotal)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Distribuição por Situação</p>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={dadosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Banco</h3>
            <div className="h-[250px]">
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
          </Card>
        </div>

        <Card>
          <div className="p-6 overflow-x-auto">
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
                      <div className="flex gap-2">
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
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Histórico de Ações</h3>
            <div className="space-y-2">
              {historico.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{new Date(item.data).toLocaleString()}</span>
                  <span>{item.acao}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Carteira;
